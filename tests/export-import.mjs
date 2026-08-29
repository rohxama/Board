// Export / Import test suite for tasks 17-20.
// Drives the real app in headless Chrome:
//   17. PNG export — empty, shapes, text, arrows, images, different backgrounds (light/dark),
//       must match the canvas (shapes present where expected) and NEVER be transparent.
//   18. SVG export — shapes, text, arrows, colors, positions, dimensions; loaded in a browser.
//   19. JSON export + reload + import — no data/object info lost.
//   20. Import — shapes, positions, colors, text, arrows, images, relationships restored.
import puppeteer from 'puppeteer-core'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { decodePNG } from '../pnglib.cjs'

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:5173/'
const ROOT = 'D:/Board'
const VITE = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
const sleep = ms => new Promise(r => setTimeout(r, ms))

const results = []
const record = (section, name, pass, detail = '') => {
  results.push({ section, name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  [${section}] ${name}${detail ? '  — ' + detail : ''}`)
}
const near = (a, b, t = 4) => Math.abs(a - b) <= t
const colorNear = (c, r, g, b, t = 6) => near(c[0], r, t) && near(c[1], g, t) && near(c[2], b, t)

const server = spawn(process.execPath, [VITE, '--port', '5173', '--strictPort'], { cwd: ROOT, stdio: 'ignore', detached: true })
let browser
try {
  // wait for server
  for (let i = 0; i < 60; i++) { try { const r = await fetch(URL); if (r.ok) break } catch {}; await sleep(300) }

  browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--window-size=1200,800', '--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  const pageErrors = []
  page.on('pageerror', e => { pageErrors.push(e.message); console.log('PAGEERROR:', e.message) })

  // capture download blobs as data URLs
  const installCapture = () => page.evaluate(() => {
    window.__dl = []
    const orig = URL.createObjectURL.bind(URL)
    URL.createObjectURL = blob => {
      const fr = new FileReader()
      fr.onload = () => window.__dl.push({ type: blob.type, dataUrl: fr.result })
      fr.readAsDataURL(blob)
      return orig(blob)
    }
    HTMLAnchorElement.prototype.click = function () {}
  })

  const waitReady = async () => {
    for (let i = 0; i < 200; i++) {
      const ok = await page.evaluate(() => !document.querySelector('.splash-screen') && !!window.__benchStage && typeof window.__setView === 'function' && window.__app?.shapes).catch(() => false)
      if (ok) break
      await sleep(100)
    }
    await installCapture()
  }
  const gotoFresh = async () => {
    await page.goto(URL, { waitUntil: 'networkidle0' })
    await waitReady()
    await page.evaluate(() => { try { window.localStorage.clear() } catch {} })
    await page.reload({ waitUntil: 'networkidle0' })
    await waitReady()
  }
  const shapes = () => page.evaluate(() => window.__app.shapes.map(s => JSON.parse(JSON.stringify(s))))
  const view = () => page.evaluate(() => ({ ...window.__app.view }))
  const setView = v => page.evaluate(val => window.__setView(val), v)
  const nextFrame = () => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))

  const draw = async (tool, x1, y1, x2, y2) => {
    await page.click(`[title^="${tool}"]`).catch(() => {})
    await sleep(120)
    await page.mouse.move(x1, y1); await page.mouse.down()
    await page.mouse.move((x1 + x2) / 2, (y1 + y2) / 2, { steps: 4 })
    await page.mouse.move(x2, y2, { steps: 4 }); await page.mouse.up()
    await sleep(200)
  }
  const captureLast = async () => {
    await sleep(200)
    return page.evaluate(() => window.__dl[window.__dl.length - 1])
  }
  const exportKind = async (kind, name = 'board') => {
    const status = await page.evaluate(async (k, n) => {
      try {
        const io = await import('/src/lib/io.js')
        if (k === 'png') await io.exportPNG(window.__benchStage, n)
        else if (k === 'svg') io.exportSVG(window.__app.shapes, n)
        else if (k === 'json') io.exportJSON(window.__app.shapes, n)
        return 'ok'
      } catch (e) { return 'ERR:' + (e && e.message) }
    }, kind, name)
    if (status !== 'ok') console.log('EXPORT', kind, 'status=', status)
    const last = await captureLast()
    if (!last) console.log('EXPORT', kind, 'no blob captured; __dl len=', await page.evaluate(() => (window.__dl || []).length))
    return last
  }
  const addImageViaDrop = async (b64) => {
    await page.evaluate(async (data) => {
      const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0))
      const file = new File([bytes], 'img.png', { type: 'image/png' })
      const dt = new DataTransfer(); dt.items.add(file)
      const host = document.querySelector('.canvas-host')
      host.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }))
    }, b64)
    await sleep(500)
  }
  const pngPixels = dataUrl => decodePNG(Buffer.from(dataUrl.split(',')[1], 'base64'))
  const pixelAt = (img, x, y) => { const i = (y * img.w + x) * 4; return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]] }
  const paper = dark => dark ? [18, 20, 24] : [248, 250, 252]
  const isPaperish = (c, dark) => { const p = paper(dark); const g = dark ? [40, 42, 46] : [203, 213, 225]; return colorNear(c, p[0], p[1], p[2], 14) || colorNear(c, g[0], g[1], g[2], 14) || c[3] < 250 }

  // ============================================================ PHASE A: build board + PNG/SVG/JSON (light)
  await gotoFresh()
  await setView({ x: 0, y: 0, scale: 1 }); await nextFrame()

  // empty canvas PNG check
  const probe = await page.evaluate(async () => {
    try { const u = window.__benchStage.toDataURL({ pixelRatio: 2 }); return { ok: true, len: u.length } }
    catch (e) { return { ok: false, err: e.message } }
  })
  console.log('PROBE toDataURL:', JSON.stringify(probe))
  let cap = await exportKind('png', 'empty')
  let ep = pngPixels(cap.dataUrl)
  let transparent = 0
  for (let i = 0; i < ep.w * ep.h; i += 997) if (ep.data[i * 4 + 3] < 255) transparent++
  record('PNG', 'empty canvas export is opaque (never transparent)', transparent === 0, `transparent samples=${transparent}, size=${ep.w}x${ep.h}`)
  record('PNG', 'empty canvas background = paper color', colorNear(pixelAt(ep, 5, 5), 248, 250, 252), `corner=${pixelAt(ep, 5, 5).slice(0, 3)}`)

  // draw shapes: rect A, rect B, arrow A->B (binds), text, then image via drop
  await draw('Rectangle', 200, 200, 360, 320)
  await draw('Rectangle', 600, 400, 760, 520)
  await draw('Arrow', 360, 260, 600, 460)
  await draw('Text', 240, 360)
  await page.keyboard.type('Hello board'); await page.keyboard.press('Escape'); await sleep(200)
  const IMG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  await addImageViaDrop(IMG_B64)
  await setView({ x: 0, y: 0, scale: 1 }); await nextFrame()

  let S = await shapes()
  const hasImage = S.some(s => s.type === 'image')
  const arrow = S.find(s => s.type === 'arrow')
  const arrowBinds = !!(arrow && (arrow.startBinding || arrow.endBinding))
  record('setup', 'board has rect, ellipse/rect2, arrow, text, image', S.filter(s => ['rectangle', 'ellipse', 'text', 'arrow', 'image'].includes(s.type)).length >= 5 && hasImage, `types=${S.map(s => s.type).join(',')}`)
  record('setup', 'arrow bound to shapes (relationship exists before export)', arrowBinds, arrow ? `start=${!!arrow.startBinding} end=${!!arrow.endBinding}` : 'no arrow')

  // PNG with content — opaque + shapes match canvas
  cap = await exportKind('png', 'content')
  ep = pngPixels(cap.dataUrl)
  let tCount = 0, total = 0
  for (let i = 0; i < ep.w * ep.h; i += 503) { total++; if (ep.data[i * 4 + 3] < 255) tCount++ }
  record('PNG', 'content export fully opaque (never transparent)', tCount === 0, `transparent samples=${tCount}/${total}`)
  record('PNG', 'content background = light paper', colorNear(pixelAt(ep, 5, 5), 248, 250, 252), `corner=${pixelAt(ep, 5, 5).slice(0, 3)}`)

  // reference: live stage render (shapes only, transparent bg) at pixelRatio 2
  const refData = await page.evaluate(() => window.__benchStage.toDataURL({ pixelRatio: 2 }))
  const ref = pngPixels(refData)
  // every shape pixel in reference must be a non-paper pixel in exported PNG
  let shapePix = 0, matched = 0
  for (let y = 0; y < ref.h; y++) for (let x = 0; x < ref.w; x++) {
    const ri = (y * ref.w + x) * 4
    if (ref.data[ri + 3] > 20) {
      shapePix++
      const c = pixelAt(ep, x, y)
      if (!isPaperish(c, false)) matched++
    }
  }
  record('PNG', 'exported PNG matches canvas (shapes present where drawn)', shapePix === 0 || matched / shapePix > 0.97, `matched ${matched}/${shapePix} shape pixels`)

  // per-shape presence + position check by sampling shape centers in PNG
  const sampleShape = async () => {
    const S2 = await shapes()
    let ok = true, detail = []
    for (const s of S2) {
      let cx, cy
      if (s.type === 'arrow') { cx = (s.x + (s.points[0] + s.points[2]) / 2) * 2; cy = (s.y + (s.points[1] + s.points[3]) / 2) * 2 }
      else if (s.type === 'text') { cx = s.x * 2; cy = (s.y + (s.fontSize || 20) / 2) * 2 }
      else if (s.type === 'image') { cx = (s.x + s.width / 2) * 2; cy = (s.y + s.height / 2) * 2 }
      else { cx = (s.x + s.width / 2) * 2; cy = (s.y + s.height / 2) * 2 }
      const c = pixelAt(ep, Math.round(cx), Math.round(cy))
      const present = !isPaperish(c, false)
      if (!present) { ok = false; detail.push(`${s.type}:paper@center`) }
    }
    record('PNG', 'every shape visible at its position in exported PNG', ok, detail.join('; ') || 'all shapes present')
  }
  await sampleShape()

  // ============================================================ PHASE B: SVG export
  cap = await exportKind('svg', 'board')
  const svgText = Buffer.from(cap.dataUrl.split(',')[1], 'base64').toString('utf8')
  record('SVG', 'export produces <svg> with background + grid', /<svg[\s\S]*<rect[^>]*fill="#f8fafc"[\s\S]*pattern/i.test(svgText), `len=${svgText.length}`)
  record('SVG', 'SVG contains rect/ellipse elements', (svgText.match(/<rect/g) || []).length >= 2)
  record('SVG', 'SVG contains text element', /<text/.test(svgText))
  record('SVG', 'SVG contains arrow marker', /marker-end="url\(#diagram-arrow\)"|<marker/.test(svgText))
  record('SVG', 'SVG contains image element', /<image/.test(svgText))
  // verify a rectangle's position+dimensions encoded correctly
  const rectS = S.find(s => s.type === 'rectangle')
  const rectMatch = rectS && new RegExp(`<rect x="${Math.round(rectS.x)}" y="${Math.round(rectS.y)}" width="${Math.round(rectS.width)}" height="${Math.round(rectS.height)}"`).test(svgText)
  record('SVG', 'rectangle position+dimensions encoded', !!rectMatch, rectS ? `expect x=${Math.round(rectS.x)} y=${Math.round(rectS.y)} w=${Math.round(rectS.width)}` : 'no rect')
  // open SVG in a separate browser page and confirm it parses + renders nodes
  const svgPage = await browser.newPage()
  const svgErr = []
  svgPage.on('pageerror', e => svgErr.push(e.message))
  await svgPage.setContent(`<!doctype html><html><body>${svgText}</body></html>`, { waitUntil: 'networkidle0' })
  await sleep(300)
  const svgInfo = await svgPage.evaluate(() => ({
    hasSvg: !!document.querySelector('svg'),
    rects: document.querySelectorAll('rect').length,
    texts: document.querySelectorAll('text').length,
    lines: document.querySelectorAll('line,polyline').length,
    images: document.querySelectorAll('image').length,
  }))
  record('SVG', 'SVG opens in browser & parses (has svg root)', svgInfo.hasSvg && svgErr.length === 0, `errors=${svgErr.join(';')}`)
  record('SVG', 'SVG renders expected node counts in browser', svgInfo.rects >= 2 && svgInfo.texts >= 1 && svgInfo.images >= 1, JSON.stringify(svgInfo))
  await svgPage.close()

  // ============================================================ PHASE C: JSON export + import (reload)
  cap = await exportKind('json', 'board')
  const jsonStr = Buffer.from(cap.dataUrl.split(',')[1], 'base64').toString('utf8')
  let parsed = JSON.parse(jsonStr)
  record('JSON', 'JSON export well-formed (version 1, shapes array)', parsed.version === 1 && Array.isArray(parsed.shapes) && parsed.shapes.length === S.length, `shapes=${parsed.shapes.length}`)
  // confirm image src + arrow bindings survived the JSON round-trip itself
  const jsonImg = parsed.shapes.find(s => s.type === 'image')
  record('JSON', 'image src preserved in export', !!jsonImg && /^data:image\/(png|jpeg|webp);base64,/.test(jsonImg.src), jsonImg ? `srclen=${jsonImg.src.length}` : 'no image')
  const jsonArrow = parsed.shapes.find(s => s.type === 'arrow')
  record('JSON', 'arrow bindings present in export', !!(jsonArrow && (jsonArrow.startBinding || jsonArrow.endBinding)), jsonArrow ? `start=${!!jsonArrow.startBinding}` : 'no arrow')

  // reload (close/reopen app) then import
  await page.reload({ waitUntil: 'networkidle0' })
  await waitReady()
  const tmpJson = path.join(ROOT, 'tests', '.import-test.json')
  fs.writeFileSync(tmpJson, jsonStr)
  const input = await page.$('input[type=file][accept="application/json"]')
  await input.uploadFile(tmpJson)
  await sleep(800)
  const imported = await shapes()
  const origIds = new Set(S.map(s => s.id))
  const impIds = new Set(imported.map(s => s.id))
  record('IMPORT', 'import keeps same shape count', imported.length === S.length, `before=${S.length} after=${imported.length}`)

  // compare each original shape (by type order) to an imported shape ignoring id
  const byType = t => imported.filter(s => s.type === t)
  let noLoss = true, lossDetail = []
  for (const o of S) {
    const cand = imported.find(s => s.type === o.type && Math.abs(s.x - o.x) < 1 && Math.abs(s.y - o.y) < 1)
    if (!cand) { noLoss = false; lossDetail.push(`${o.type}:missing`); continue }
    for (const f of ['width', 'height', 'rotation', 'stroke', 'fill', 'opacity', 'dash']) {
      if (o[f] !== undefined && cand[f] !== o[f]) { noLoss = false; lossDetail.push(`${o.type}.${f}:${o[f]}!=${cand[f]}`) }
    }
    if (o.type === 'text' && cand.text !== o.text) { noLoss = false; lossDetail.push(`text:${o.text}!=${cand.text}`) }
    if (o.type === 'image' && cand.src !== o.src) { noLoss = false; lossDetail.push('image.src changed') }
    if ((o.type === 'arrow' || o.type === 'line') && JSON.stringify(o.points) !== JSON.stringify(cand.points)) { noLoss = false; lossDetail.push(`${o.type}.points changed`) }
  }
  record('IMPORT', 'no data/object info lost (geometry, colors, text, image, points)', noLoss, lossDetail.join('; ') || 'all fields match')
  record('IMPORT', 'imported ids are fresh (remapped)', !imported.some(s => origIds.has(s.id)) && imported.length === impIds.size, 'new unique ids')

  // relationships: arrow bindings must reference EXISTING imported shapes
  const impArrow = imported.find(s => s.type === 'arrow')
  let relOk = false, relDetail = ''
  if (impArrow && (impArrow.startBinding || impArrow.endBinding)) {
    const boundIds = [impArrow.startBinding?.shapeId, impArrow.endBinding?.shapeId].filter(Boolean)
    relOk = boundIds.length > 0 && boundIds.every(id => impIds.has(id))
    relDetail = `boundIds=[${boundIds.join(',')}] validInImport=${boundIds.every(id => impIds.has(id))}`
  } else {
    relDetail = 'arrow has no bindings after import'
  }
  record('IMPORT', 'relationships (arrow bindings) restored & valid', relOk, relDetail)

  // ============================================================ PHASE D: dark mode PNG
  await page.evaluate(() => { try { window.localStorage.clear() } catch {} })
  await page.reload({ waitUntil: 'networkidle0' })
  await waitReady()
  // toggle dark theme via the account menu
  await page.click('button[title="Account menu"]').catch(() => {})
  await sleep(200)
  const radios = await page.$$('[role="radio"]')
  if (radios[1]) await radios[1].click()
  await sleep(250)
  const darkOn = await page.evaluate(() => document.documentElement.dataset.theme === 'dark')
  record('PNG', 'dark theme toggled on', darkOn, `theme=${await page.evaluate(() => document.documentElement.dataset.theme)}`)
  await draw('Rectangle', 300, 300, 520, 460)
  await setView({ x: 0, y: 0, scale: 1 }); await nextFrame()
  cap = await exportKind('png', 'dark')
  ep = pngPixels(cap.dataUrl)
  let darkTransparent = 0
  for (let i = 0; i < ep.w * ep.h; i += 503) if (ep.data[i * 4 + 3] < 255) darkTransparent++
  record('PNG', 'dark-mode export fully opaque', darkTransparent === 0, `transparent=${darkTransparent}`)
  record('PNG', 'dark-mode background = dark paper (#121418)', colorNear(pixelAt(ep, 5, 5), 18, 20, 24, 8), `corner=${pixelAt(ep, 5, 5).slice(0, 3)}`)
  // dark-mode SVG background
  cap = await exportKind('svg', 'dark')
  const svgDark = Buffer.from(cap.dataUrl.split(',')[1], 'base64').toString('utf8')
  record('SVG', 'dark-mode SVG background = dark paper', /fill="#121418"/.test(svgDark), `found=${/fill="#121418"/.test(svgDark)}`)

  record('ALL', 'no uncaught page errors', pageErrors.length === 0, pageErrors.join(' | ') || 'none')

  const failed = results.filter(r => !r.pass)
  console.log(`\n==== ${results.length - failed.length}/${results.length} checks passed ====`)
  if (failed.length) { console.log('FAILED:\n' + failed.map(f => `  [${f.section}] ${f.name} — ${f.detail}`).join('\n')); process.exitCode = 1 }
} catch (e) {
  console.error('TEST HARNESS ERROR:', e.stack || e.message)
  process.exitCode = 2
} finally {
  if (browser) await browser.close()
  try { process.kill(-server.pid) } catch {}
}
