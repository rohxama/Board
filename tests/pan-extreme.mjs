// Extreme pan stress test. Drives the real app via Puppeteer and pans the canvas
// to very large (and very negative) viewport offsets in all four directions,
// then checks: no crash/freeze, coordinates stay finite, objects survive and
// reappear on return, and frame times stay reasonable.
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:5173/'
const sleep = ms => new Promise(r => setTimeout(r, ms))

const results = []
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`)
}

async function waitServer(url, timeout = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try { const r = await fetch(url); if (r.ok) return true } catch {}
    await sleep(300)
  }
  return false
}

let browser
try {
  if (!(await waitServer(URL))) throw new Error('dev server did not start')
  browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--window-size=1200,800', '--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })

  const pageErrors = []
  page.on('pageerror', e => pageErrors.push(e.message))
  page.on('error', e => pageErrors.push('crash: ' + e.message))

  await page.goto(URL, { waitUntil: 'networkidle0' })
  // wait for app ready (bench stage mounted, splash gone)
  for (let i = 0; i < 200; i++) {
    const ready = await page.evaluate(() => !document.querySelector('.splash-screen') && !!window.__benchStage && typeof window.__setView === 'function').catch(() => false)
    if (ready) break
    await sleep(100)
  }

  // start from a clean board
  await page.evaluate(() => { try { window.localStorage.clear() } catch {} })

  const getView = () => page.evaluate(() => ({ ...window.__app.view }))
  const getShapes = () => page.evaluate(() => window.__app.shapes.map(s => ({ id: s.id, type: s.type, x: s.x, y: s.y })))
  const setView = v => page.evaluate(val => window.__setView(val), v)
  const nextFrame = () => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))

  const drawShape = async (toolTitle, x1, y1, x2, y2) => {
    const before = (await getShapes()).length
    for (let attempt = 0; attempt < 3; attempt++) {
      await page.click(`[title="${toolTitle}"]`); await sleep(150)
      await page.mouse.move(x1, y1); await page.mouse.down()
      await page.mouse.move((x1 + x2) / 2, (y1 + y2) / 2, { steps: 5 })
      await page.mouse.move(x2, y2, { steps: 5 }); await page.mouse.up()
      await sleep(300)
      if ((await getShapes()).length > before) return true
    }
    return false
  }
  const nodeInfo = () => page.evaluate(() => window.__app.shapes.map(s => {
    const node = window.__benchStage.findOne('#' + s.id)
    if (!node) return { id: s.id, visible: null, ax: null, ay: null }
    const abs = node.getAbsolutePosition()
    return { id: s.id, visible: node.visible(), ax: abs.x, ay: abs.y }
  }))

  // ---- setup: create a few objects near the center ----
  const r1 = await drawShape('Rectangle (R)', 500, 350, 700, 520)
  const e1 = await drawShape('Ellipse (O)', 760, 300, 940, 470)
  const r2 = await drawShape('Rectangle (R)', 520, 520, 680, 660)

  let shapes = await getShapes()
  record('setup: created 3 objects', r1 && e1 && r2 && shapes.length === 3, `rect=${r1} ellipse=${e1} rect2=${r2} count=${shapes.length}`)
  const ids = shapes.map(s => s.id)

  // ---- check responsiveness helper ----
  const responsive = async (label) => {
    const t = await page.evaluate(() => new Promise(res => {
      const s = performance.now(); setTimeout(() => res(performance.now() - s), 0)
    }))
    return t
  }

  // ---- extreme pan sweep in each direction ----
  const extremes = {
    'RIGHT':  { x:  5_000_000, y: 0 },
    'LEFT':   { x: -5_000_000, y: 0 },
    'DOWN':   { x: 0, y:  5_000_000 },
    'UP':     { x: 0, y: -5_000_000 },
  }
  // also probe a much larger magnitude to find the breaking point
  const farProbe = [1e7, 1e8, 1e9, -1e9]

  for (const [dir, off] of Object.entries(extremes)) {
    const errBefore = pageErrors.length
    await setView({ x: off.x, y: off.y, scale: 1 })
    await nextFrame()
    const v = await getView()
    const finite = Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.scale)
    const shapesAfter = await getShapes()
    const sameCount = shapesAfter.length === ids.length
    const resp = await responsive()
    const errAfter = pageErrors.length
    const crashed = errAfter > errBefore
    record(`pan ${dir} to ${off.x || off.y}: coords finite`, finite, `view=(${v.x},${v.y}) scale=${v.scale}`)
    record(`pan ${dir}: shapes preserved`, sameCount, `count=${shapesAfter.length}`)
    record(`pan ${dir}: no crash`, !crashed, crashed ? pageErrors.slice(errBefore).join('; ') : 'ok')
    record(`pan ${dir}: responsive (<50ms eval)`, resp < 50, `eval=${resp.toFixed(1)}ms`)
  }

  // large-magnitude probe
  let safeMax = 0
  for (const mag of farProbe) {
    const errBefore = pageErrors.length
    await setView({ x: mag, y: mag, scale: 1 })
    await nextFrame()
    const v = await getView()
    const finite = Number.isFinite(v.x) && Number.isFinite(v.y)
    const crashed = pageErrors.length > errBefore
    const ok = finite && !crashed
    if (ok) safeMax = Math.abs(mag)
    record(`probe offset ${mag}: ${ok ? 'stable' : 'BROKE'}`, ok, ok ? 'finite, no error' : (crashed ? pageErrors.slice(errBefore).join('; ') : 'non-finite view'))
  }
  record('large-magnitude safe bound', safeMax >= 1e8, `max stable |offset| ~ ${safeMax}`)

  // ---- return to origin: objects must reappear ----
  await setView({ x: 0, y: 0, scale: 1 })
  await nextFrame(); await nextFrame()
  const info = await nodeInfo()
  const allVisible = info.length === ids.length && info.every(n => n.visible === true)
  const allFinitePos = info.every(n => Number.isFinite(n.ax) && Number.isFinite(n.ay))
  record('return to origin: all objects visible again', allVisible, JSON.stringify(info.map(n => n.visible)))
  record('return to origin: object positions finite', allFinitePos)

  // verify objects are roughly where they were drawn (center region on screen)
  const onScreen = info.filter(n => n.ax > -200 && n.ax < 1400 && n.ay > -200 && n.ay < 1000).length
  record('return to origin: objects drawn on/near viewport', onScreen === ids.length, `${onScreen}/${ids.length} within viewport`)

  // ---- performance: frame timing during active panning ----
  const frameStats = await page.evaluate(async () => {
    const samples = []
    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      samples.push(now - last)
      last = now
    }
    // simulate continuous panning by mutating the view each frame
    let x = 0
    const frames = 120
    let i = 0
    return await new Promise(resolve => {
      const loop = () => {
        tick()
        x += 60
        window.__setView({ x, y: 0, scale: 1 })
        if (++i < frames) requestAnimationFrame(loop)
        else {
          samples.sort((a, b) => a - b)
          const avg = samples.reduce((s, v) => s + v, 0) / samples.length
          const max = samples[samples.length - 1]
          const p95 = samples[Math.floor(samples.length * 0.95)]
          resolve({ avg, max, p95, n: samples.length })
        }
      }
      requestAnimationFrame(loop)
    })
  })
  // Headless Chrome uses software rendering, so absolute frame times are higher
  // than a GPU-accelerated real browser; we assert the pan stays interactive
  // (no multi-hundred-ms freezes) rather than a strict 60fps target.
  record('perf: avg frame time during pan < 34ms', frameStats.avg < 34, `avg=${frameStats.avg.toFixed(1)}ms p95=${frameStats.p95.toFixed(1)}ms max=${frameStats.max.toFixed(1)}ms`)
  record('perf: max frame time during pan < 100ms', frameStats.max < 100, `max=${frameStats.max.toFixed(1)}ms`)

  // ---- final crash check ----
  record('no uncaught page errors during whole test', pageErrors.length === 0, pageErrors.join(' | ') || 'none')

  const failed = results.filter(r => !r.pass)
  console.log(`\n==== ${results.length - failed.length}/${results.length} checks passed ====`)
  if (failed.length) { console.log('FAILED:', failed.map(f => f.name).join('; ')); process.exitCode = 1 }
} catch (e) {
  console.error('TEST HARNESS ERROR:', e.message)
  process.exitCode = 2
} finally {
  if (browser) await browser.close()
}
