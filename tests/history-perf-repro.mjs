/* Read-only benchmark for the production history reducer. */
import fs from 'node:fs/promises'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { createInitialHistoryState, historyReducer, MAX_SHAPES } from '../src/context/historyState.js'

const output = path.resolve('artifacts/performance-repro')
const round = value => Math.round(value * 100) / 100
const memory = () => { const usage = process.memoryUsage(); return { heapUsedMB: round(usage.heapUsed / 1048576), heapTotalMB: round(usage.heapTotal / 1048576), rssMB: round(usage.rss / 1048576) } }
const run = (name, fn) => { const before = memory(); const start = performance.now(); const value = fn(); return { name, durationMs: round(performance.now() - start), before, after: memory(), ...value } }

function shapes(count, complex = false) {
  return Array.from({ length: count }, (_, index) => {
    const base = { id: `s-${index}`, x: (index % 100) * 12, y: Math.floor(index / 100) * 7, stroke: '#1e293b', strokeWidth: 2, fill: 'transparent', opacity: 1 }
    if (!complex) return { ...base, type: 'rectangle', width: 10, height: 5 }
    const points = []
    for (let point = 0; point < 160; point++) points.push(point * 1.2, Math.sin(point / 4) * 10)
    return { ...base, type: 'pen', points }
  })
}

const results = []
for (const count of [1000, 5000, 10000, 10001]) {
  results.push(run(`commit-${count}-simple-shapes`, () => {
    const next = historyReducer(createInitialHistoryState(), { type: 'COMMIT', shapes: shapes(count) })
    return { acceptedShapes: next.shapes.length, revision: next.revision, undoFrames: next.undoStack.length }
  }))
}
results.push(run('commit-1000-complex-pens-160-points', () => {
  const next = historyReducer(createInitialHistoryState(), { type: 'COMMIT', shapes: shapes(1000, true) })
  return { acceptedShapes: next.shapes.length, revision: next.revision, undoFrames: next.undoStack.length }
}))
results.push(run('10-commit-undo-redo-cycle-5000-simple-shapes', () => {
  let state = historyReducer(createInitialHistoryState(), { type: 'COMMIT', shapes: shapes(5000) })
  const phases = []
  for (let step = 1; step <= 10; step++) { const t = performance.now(); state = historyReducer(state, { type: 'COMMIT', shapes: previous => previous.map((shape, index) => index === 0 ? { ...shape, x: step } : shape) }); phases.push({ phase: `commit-${step}`, durationMs: round(performance.now() - t), ...memory() }) }
  for (let step = 1; step <= 10; step++) { const t = performance.now(); state = historyReducer(state, { type: 'UNDO' }); phases.push({ phase: `undo-${step}`, durationMs: round(performance.now() - t), ...memory() }) }
  for (let step = 1; step <= 10; step++) { const t = performance.now(); state = historyReducer(state, { type: 'REDO' }); phases.push({ phase: `redo-${step}`, durationMs: round(performance.now() - t), ...memory() }) }
  return { acceptedShapes: state.shapes.length, revision: state.revision, undoFrames: state.undoStack.length, redoFrames: state.redoStack.length, phases }
}))

await fs.mkdir(output, { recursive: true })
const report = { createdAt: new Date().toISOString(), node: process.version, maxShapes: MAX_SHAPES, results }
await fs.writeFile(path.join(output, 'history-report.json'), JSON.stringify(report, null, 2))
await fs.writeFile(path.join(output, 'history-report.md'), [
  '# History reducer stress reproduction', '',
  `Node: ${report.node}`, `MAX_SHAPES: ${MAX_SHAPES}`, '',
  '| Phase | Duration (ms) | Accepted shapes | Heap after (MB) | RSS after (MB) |', '| --- | ---: | ---: | ---: | ---: |',
  ...results.map(result => `| ${result.name} | ${result.durationMs} | ${result.acceptedShapes ?? '—'} | ${result.after.heapUsedMB} | ${result.after.rssMB} |`), '',
  'The cycle result includes the full per-action allocation/timing timeline in history-report.json.',
].join('\n'))
console.log(JSON.stringify(results, null, 2))
