/*
 * Read-only browser stress harness for the Kanvas board.
 * It drives the shipped UI and the existing window.__app test seam; it does
 * not alter application source, persisted user data, or production settings.
 *
 * Usage: node tests/performance-repro.mjs
 */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import puppeteer from 'puppeteer'

const baseUrl = process.env.BOARD_URL || 'http://127.0.0.1:4183/#/board'
const outDir = path.resolve('artifacts/performance-repro')
const now = () => performance.now()
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const errors = []
const timeline = []

const stable = value => JSON.stringify(value, null, 2)
const rounded = value => Math.round(value * 100) / 100

async function makePage(browser) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 })
  await page.evaluateOnNewDocument(() => {
    localStorage.clear()
    window.__perfRepro = { longTasks: [], errors: [], marks: [] }
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) window.__perfRepro.longTasks.push({ start: entry.startTime, duration: entry.duration })
    }).observe({ type: 'longtask', buffered: true })
    window.addEventListener('error', event => window.__perfRepro.errors.push({ type: 'error', message: event.message, stack: event.error?.stack || '' }))
    window.addEventListener('unhandledrejection', event => window.__perfRepro.errors.push({ type: 'unhandledrejection', message: String(event.reason), stack: event.reason?.stack || '' }))
  })
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push({ source: 'console', type: message.type(), text: message.text(), at: new Date().toISOString() })
  })
  page.on('pageerror', error => errors.push({ source: 'pageerror', message: String(error.message || error), stack: error.stack || '', at: new Date().toISOString() }))
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => !!(window.__app && window.__stage), { timeout: 15000 })
  const fresh = await page.$('.modal-fresh')
  if (fresh) await fresh.click()
  return page
}

async function measureFrames(page, windowMs = 1000) {
  return page.evaluate(async ms => {
    const frames = []
    const start = performance.now()
    await new Promise(resolve => {
      const tick = time => {
        frames.push(time)
        if (time - start >= ms) resolve()
        else requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    const intervals = frames.slice(1).map((time, index) => time - frames[index])
    const sum = intervals.reduce((total, value) => total + value, 0)
    return {
      frames: frames.length,
      fps: intervals.length ? 1000 * intervals.length / sum : 0,
      maxFrameMs: intervals.length ? Math.max(...intervals) : 0,
      droppedFrames: intervals.filter(value => value > 33.34).length,
    }
  }, windowMs)
}

async function devtoolsMetrics(client) {
  const [metrics, heap, dom] = await Promise.all([
    client.send('Performance.getMetrics'),
    client.send('Runtime.getHeapUsage'),
    client.send('Memory.getDOMCounters'),
  ])
  const read = name => metrics.metrics.find(metric => metric.name === name)?.value ?? null
  return {
    jsHeapUsedMB: rounded(heap.usedSize / 1024 / 1024),
    jsHeapTotalMB: rounded(heap.totalSize / 1024 / 1024),
    nodes: dom.nodes,
    jsEventListeners: dom.jsEventListeners,
    layoutCount: read('LayoutCount'),
    layoutDurationMs: read('LayoutDuration') === null ? null : rounded(read('LayoutDuration') * 1000),
    scriptDurationMs: read('ScriptDuration') === null ? null : rounded(read('ScriptDuration') * 1000),
    taskDurationMs: read('TaskDuration') === null ? null : rounded(read('TaskDuration') * 1000),
  }
}

async function createShapes(page, count, kind) {
  const start = now()
  await page.evaluate(({ count, kind }) => {
    const palette = ['#1e293b', '#0f766e', '#7c3aed', '#b45309']
    const base = (id, type, x, y) => ({ id, type, x, y, stroke: palette[id.length % palette.length], strokeWidth: 2, dash: 'solid', fill: 'transparent', opacity: 1 })
    const shapes = Array.from({ length: count }, (_, index) => {
      const column = index % 100
      const row = Math.floor(index / 100)
      const x = column * 12
      const y = row * 7
      const id = `${kind}-${index}`
      if (kind === 'simple') return { ...base(id, 'rectangle', x, y), width: 10, height: 5, cornerRadius: 0 }
      if (kind === 'complex') {
        const points = []
        for (let p = 0; p < 160; p++) points.push(p * 1.2, Math.sin(p / 4) * 10 + (p % 3))
        return { ...base(id, 'pen', x, y), points }
      }
      const type = ['rectangle', 'ellipse', 'diamond', 'line', 'arrow', 'pen', 'text'][index % 7]
      if (type === 'rectangle') return { ...base(id, type, x, y), width: 10, height: 7, cornerRadius: 2 }
      if (type === 'ellipse' || type === 'diamond') return { ...base(id, type, x, y), width: 10, height: 7 }
      if (type === 'text') return { ...base(id, type, x, y), width: 40, height: 18, text: `n${index}`, fontSize: 10 }
      if (type === 'pen') {
        const points = []
        for (let p = 0; p < 40; p++) points.push(p * 1.5, Math.sin(p / 3) * 5)
        return { ...base(id, type, x, y), points }
      }
      return { ...base(id, type, x, y), points: [0, 0, 10, 7] }
    })
    window.__app.__scenarioShapeCount = count
    window.__commit(shapes)
  }, { count, kind })
  const expected = count <= 10000 ? count : 0
  let applied = true
  try { await page.waitForFunction(target => window.__app.shapes.length === target, { timeout: 30000 }, expected) } catch { applied = false }
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  return { elapsedMs: rounded(now() - start), expected, actual: await page.evaluate(() => window.__app.shapes.length), applied }
}

async function recordScenario(page, client, name, action) {
  const before = await devtoolsMetrics(client)
  const start = now()
  const result = await action()
  const elapsedMs = rounded(now() - start)
  const frame = await measureFrames(page, 1000)
  const after = await devtoolsMetrics(client)
  const browser = await page.evaluate(() => ({
    longTasks: window.__perfRepro.longTasks.slice(-40),
    errors: window.__perfRepro.errors.slice(),
    shapes: window.__app.shapes.length,
    nodesWithShapeId: window.__stage.find(node => Boolean(node.getAttr?.('shapeId'))).length,
  }))
  const entry = { name, elapsedMs, result, frame: Object.fromEntries(Object.entries(frame).map(([key, value]) => [key, rounded(value)])), before, after, browser }
  timeline.push(entry)
  return entry
}

async function runLoad(browser, label, count, kind) {
  const page = await makePage(browser)
  const client = await page.target().createCDPSession()
  await client.send('Performance.enable')
  await recordScenario(page, client, label, () => createShapes(page, count, kind))
  await page.close()
}

async function runInteractions(browser) {
  const page = await makePage(browser)
  const client = await page.target().createCDPSession()
  await client.send('Performance.enable')
  await recordScenario(page, client, 'mixed-shapes-5k-load', () => createShapes(page, 5000, 'mixed'))

  await recordScenario(page, client, 'rapid-drawing-30-rectangles-on-5k-board', async () => {
    for (let i = 0; i < 30; i++) {
      await page.evaluate(() => window.__dispatch({ type: 'SET_TOOL', tool: 'rectangle' }))
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)))
      const x = 70 + (i % 10) * 35
      const y = 90 + Math.floor(i / 10) * 35
      await page.mouse.move(x, y)
      await page.mouse.down()
      await page.mouse.move(x + 24, y + 18, { steps: 3 })
      await page.mouse.up()
    }
    await page.waitForFunction(() => window.__app.shapes.length === 5030, { timeout: 30000 })
    return { finalShapeCount: await page.evaluate(() => window.__app.shapes.length) }
  })

  await recordScenario(page, client, 'rapid-drag-60-events-on-5k-board', async () => {
    const target = await page.evaluate(() => {
      const stage = window.__stage
      const p = { x: 1140, y: 350 }
      const node = stage.getIntersection(p)
      const id = node?.getAttr('shapeId')
      if (!id) throw new Error('No draggable shape found at stress-test point')
      window.__dispatch({ type: 'SET_TOOL', tool: 'select' })
      window.__dispatch({ type: 'SET_SELECTION', ids: [id] })
      return { id, x: p.x, y: p.y }
    })
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)))
    await page.mouse.move(target.x, target.y)
    await page.mouse.down()
    await page.mouse.move(target.x - 280, target.y + 100, { steps: 60 })
    await page.mouse.up()
    return { target }
  })

  await recordScenario(page, client, 'pan-60-events-on-5k-board', async () => {
    await page.evaluate(() => window.__dispatch({ type: 'SET_TOOL', tool: 'pan' }))
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)))
    await page.mouse.move(900, 500)
    await page.mouse.down()
    await page.mouse.move(300, 350, { steps: 60 })
    await page.mouse.up()
    return await page.evaluate(() => window.__app.view)
  })

  await recordScenario(page, client, 'wheel-zoom-40-events-on-5k-board', async () => {
    await page.mouse.move(640, 400)
    for (let i = 0; i < 20; i++) await page.mouse.wheel({ deltaY: -110 })
    for (let i = 0; i < 20; i++) await page.mouse.wheel({ deltaY: 110 })
    return await page.evaluate(() => window.__app.view)
  })

  await recordScenario(page, client, '10-commit-undo-redo-cycle-on-5k-board', async () => {
    const original = await page.evaluate(() => window.__app.shapes[0].x)
    for (let i = 1; i <= 10; i++) {
      await page.evaluate(i => window.__commit(previous => previous.map((shape, index) => index === 0 ? { ...shape, x: i } : shape)), i)
      await page.waitForFunction(x => window.__app.shapes[0].x === x, { timeout: 30000 }, i)
    }
    await page.mouse.click(1100, 700)
    for (let i = 0; i < 10; i++) {
      await page.keyboard.down('Control'); await page.keyboard.press('KeyZ'); await page.keyboard.up('Control')
      await sleep(25)
    }
    const afterUndo = await page.evaluate(() => window.__app.shapes[0].x)
    for (let i = 0; i < 10; i++) {
      await page.keyboard.down('Control'); await page.keyboard.press('KeyY'); await page.keyboard.up('Control')
      await sleep(25)
    }
    const afterRedo = await page.evaluate(() => window.__app.shapes[0].x)
    return { original, afterUndo, afterRedo }
  })
  await page.close()
}

async function environment(browser) {
  const page = await browser.newPage()
  const browserInfo = await browser.version()
  const platform = await page.evaluate(() => ({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemoryGB: navigator.deviceMemory ?? null,
    devicePixelRatio: devicePixelRatio,
  }))
  await page.close()
  return {
    browser: browserInfo,
    platform,
    os: { type: os.type(), release: os.release(), arch: os.arch(), cpus: os.cpus().map(cpu => cpu.model), totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024) },
  }
}

/* The initial prose template is retained below for reference while the compact
 * concatenated template avoids nested template-literal delimiters.
function unusedMarkdownTemplate(report) {
  const rows = report.scenarios.map(s => `| ${s.name} | ${s.elapsedMs} | ${s.result.actual ?? s.result.finalShapeCount ?? '—'} | ${s.frame.fps} | ${s.frame.maxFrameMs} | ${s.after.jsHeapUsedMB} | ${s.after.nodes} |`).join('\n')
  const longTasks = report.scenarios.flatMap(s => s.browser.longTasks.map(t => ({ scenario: s.name, ...t })))
  return `# Drawing-app performance reproduction\n\nRun: ${report.createdAt}\n\n## Environment\n\n- Browser: ${report.environment.browser}\n- User agent: ${report.environment.platform.userAgent}\n- OS: ${report.environment.os.type} ${report.environment.os.release} (${report.environment.os.arch})\n- CPU: ${report.environment.os.cpus[0]} (${report.environment.platform.hardwareConcurrency} browser-visible logical cores)\n- System RAM: ${report.environment.os.totalMemoryMB} MB\n- Viewport: 1280 × 800, DPR ${report.environment.platform.devicePixelRatio}\n\n## Measured scenarios\n\n| Scenario | Action time (ms) | Shapes | FPS (1s post-action) | Worst frame (ms) | JS heap (MB) | DOM nodes |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows}\n\n## Failure criteria observed\n\n- **10,001-shape admission:** ${report.scenarios.find(s => s.name === 'simple-shapes-10001-load')?.result.actual ?? 'n/a'} shapes were accepted. The reducer rejects any array over 10,000 without a UI error.\n- **Console/page errors:** ${report.errors.length ? `${report.errors.length}; see raw JSON.` : 'none captured.'}\n- **Long tasks:** ${longTasks.length ? `${longTasks.length} captured; see raw JSON.` : 'none captured.'}\n\n## Exact automated reproduction steps\n\n1. Start the unmodified app at `${baseUrl}` in a clean, temporary Chromium profile.\n2. Programmatically call the app's already-exposed test seam `window.__commit(shapes)` with the listed generated data sets (the same history and renderer path used by drawing).\n3. Use real mouse/pointer events for 30 rectangle draws, a 60-event drag, a 60-event pan, and 40 wheel events.\n4. Add ten history commits to a 5,030-shape mixed board, then dispatch ten Ctrl+Z and ten Ctrl+Y keyboard events.\n5. Measure CDP task/layout/script timing, JS heap, DOM counts, browser long tasks, rAF FPS, and console/page errors before/after each phase.\n\n## Source-level attribution to verify\n\n- `historyState.js` deep-clones the entire shape graph on every COMMIT, UNDO, and REDO, and stores up to 200 full snapshots. This is the primary state/allocation pressure during repeated history activity.\n- `CanvasStage.jsx` maps every committed shape to a React-Konva node before culling is applied imperatively. This makes initial bulk loads and React reconciliation proportional to total shape count.\n- The culler subsequently hides offscreen nodes, but it still walks every shape on every view/shapes change; pan/zoom cost is therefore O(n) in shape count.\n- Pen/line/arrow bounding boxes and point arrays make complexity a separate multiplier: points are cloned by the history reducer and rasterized by Konva.\n\nThe raw report contains each phase's before/after metrics, detailed long-task timeline, errors, and shape/node counts.\n`
}
*/

function markdown(report) {
  const rows = report.scenarios.map(s => `| ${s.name} | ${s.elapsedMs} | ${s.result.actual ?? s.result.finalShapeCount ?? '—'} | ${s.frame.fps} | ${s.frame.maxFrameMs} | ${s.after.jsHeapUsedMB} | ${s.after.nodes} |`).join('\n')
  const rejected = report.scenarios.find(s => s.name === 'simple-shapes-10001-load')?.result.actual ?? 'n/a'
  const longTasks = report.scenarios.reduce((count, s) => count + s.browser.longTasks.length, 0)
  return [
    '# Drawing-app performance reproduction', '', `Run: ${report.createdAt}`, '',
    '## Environment', '',
    `- Browser: ${report.environment.browser}`,
    `- User agent: ${report.environment.platform.userAgent}`,
    `- OS: ${report.environment.os.type} ${report.environment.os.release} (${report.environment.os.arch})`,
    `- CPU: ${report.environment.os.cpus[0]} (${report.environment.platform.hardwareConcurrency} browser-visible logical cores)`,
    `- System RAM: ${report.environment.os.totalMemoryMB} MB`,
    `- Viewport: 1280 × 800, DPR ${report.environment.platform.devicePixelRatio}`, '',
    '## Measured scenarios', '',
    '| Scenario | Action time (ms) | Shapes | FPS (1s post-action) | Worst frame (ms) | JS heap (MB) | DOM nodes |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |', rows, '',
    '## Failure criteria observed', '',
    `- **10,001-shape admission:** ${rejected} shapes were accepted. The reducer rejects any array over 10,000 without a UI error.`,
    `- **Console/page errors:** ${report.errors.length ? `${report.errors.length}; see raw JSON.` : 'none captured.'}`,
    `- **Long tasks:** ${longTasks ? `${longTasks} captured; see raw JSON.` : 'none captured.'}`, '',
    '## Exact automated reproduction steps', '',
    '1. Start the unmodified app in a clean, temporary Chromium profile.',
    '2. Call the app’s existing window.__commit(shapes) test seam with the listed generated data sets.',
    '3. Use real mouse/pointer events for 30 rectangle draws, a 60-event drag, a 60-event pan, and 40 wheel events.',
    '4. Add ten history commits to a 5,030-shape mixed board, then dispatch ten Ctrl+Z and ten Ctrl+Y keyboard events.',
    '5. Measure CDP task/layout/script timing, JS heap, DOM counts, browser long tasks, rAF FPS, and console/page errors before/after each phase.', '',
    '## Source-level attribution to verify', '',
    '- historyState.js deep-clones the entire shape graph on every COMMIT, UNDO, and REDO, and stores up to 200 full snapshots. This is the primary state/allocation pressure during repeated history activity.',
    '- CanvasStage.jsx maps every committed shape to a React-Konva node before culling is applied imperatively. This makes initial bulk loads and React reconciliation proportional to total shape count.',
    '- The culler subsequently hides offscreen nodes, but it still walks every shape on every view/shapes change; pan/zoom cost is therefore O(n) in shape count.',
    '- Pen/line/arrow bounding boxes and point arrays make complexity a separate multiplier: points are cloned by the history reducer and rasterized by Konva.', '',
    'The raw report contains each phase’s before/after metrics, detailed long-task timeline, errors, and shape/node counts.',
  ].join('\n')
}

await fs.mkdir(outDir, { recursive: true })
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--enable-precise-memory-info', '--window-size=1280,800'],
  defaultViewport: null,
})
try {
  const report = { createdAt: new Date().toISOString(), environment: await environment(browser), scenarios: [], errors }
  await runLoad(browser, 'simple-shapes-1000-load', 1000, 'simple')
  await runLoad(browser, 'simple-shapes-5000-load', 5000, 'simple')
  await runLoad(browser, 'simple-shapes-10000-load', 10000, 'simple')
  await runLoad(browser, 'simple-shapes-10001-load', 10001, 'simple')
  await runLoad(browser, 'complex-pen-1000x160-points-load', 1000, 'complex')
  await runInteractions(browser)
  report.scenarios = timeline
  await fs.writeFile(path.join(outDir, 'report.json'), stable(report))
  await fs.writeFile(path.join(outDir, 'report.md'), markdown(report))
  console.log(stable({ output: outDir, scenarios: report.scenarios.map(s => ({ name: s.name, elapsedMs: s.elapsedMs, fps: s.frame.fps, heapMB: s.after.jsHeapUsedMB, shapes: s.browser.shapes })), errors }))
} finally {
  await browser.close()
}
