// Redo integrity E2E test.
// Performs a sequence of board actions (draw shapes, connect with an arrow,
// add text, upload an image, move and resize), undoes EVERYTHING, then redoes
// EVERYTHING and verifies order, positions, sizes, text, and connections are
// restored exactly.
import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = 'D:/Board'
const FIX = path.join(ROOT, 'tests', 'fixtures')
const URL = 'http://localhost:5173/'

const results = []
const record = (section, name, pass, detail = '') => {
  results.push({ section, name, pass, detail })
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${section} :: ${name}${detail ? ' — ' + detail : ''}`)
}
const sleep = ms => new Promise(r => setTimeout(r, ms))
const round = n => Math.round((n ?? 0) * 10) / 10

async function generateFixtures(page) {
  const fixtures = await page.evaluate(() => {
    function make(w, h, format, transparent, color) {
      const c = document.createElement('canvas'); c.width = w; c.height = h
      const ctx = c.getContext('2d')
      if (!transparent) { ctx.fillStyle = '#3366cc'; ctx.fillRect(0, 0, w, h) }
      ctx.fillStyle = color || '#22cc88'
      const mw = Math.max(4, Math.floor(w * 0.4)), mh = Math.max(4, Math.floor(h * 0.4))
      ctx.fillRect(Math.floor(w * 0.3), Math.floor(h * 0.3), mw, mh)
      return c.toDataURL(format === 'image/jpeg' ? 'image/jpeg' : 'image/png', 0.92)
    }
    return { 'square.png': make(600, 600, 'image/png') }
  })
  fs.mkdirSync(FIX, { recursive: true })
  for (const [name, dataUrl] of Object.entries(fixtures)) {
    const b64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
    fs.writeFileSync(path.join(FIX, name), Buffer.from(b64, 'base64'))
  }
}

const getShapes = page => page.evaluate(() => (window.__app?.shapes || []).map(s => ({
  id: s.id, type: s.type, x: s.x, y: s.y, width: s.width, height: s.height,
  rotation: s.rotation, text: s.text ?? null,
  points: Array.isArray(s.points) ? s.points.slice() : null,
  startBinding: s.startBinding ? s.startBinding.shapeId : null,
  endBinding: s.endBinding ? s.endBinding.shapeId : null,
  srcLen: typeof s.src === 'string' ? s.src.length : 0,
})))
const getShape = (shapes, id) => shapes.find(s => s.id === id)

async function waitApp(page, timeout = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await page.evaluate(() => !!(window.__app && window.__stage))) return true
    await sleep(200)
  }
  return false
}

async function drag(page, x1, y1, x2, y2, steps = 18) {
  await page.mouse.move(x1, y1)
  await page.mouse.down()
  await page.mouse.move(x2, y2, { steps })
  await sleep(60)
  await page.mouse.up()
  await sleep(140)
}
async function setTool(page, key) {
  await page.evaluate(() => { const a = document.activeElement; if (a && a !== document.body) a.blur() })
  await page.keyboard.press(key); await sleep(90)
}
async function resetBoard(page) {
  await page.evaluate(() => { const a = document.activeElement; if (a && a !== document.body) a.blur() })
  await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control')
  await sleep(80); await page.keyboard.press('Delete'); await sleep(150)
  await setTool(page, 'v')
}
async function uploadImage(page, fileName) {
  const input = await page.$('input[type=file][accept*="image/png"]')
  if (!input) throw new Error('image file input not found')
  const before = (await getShapes(page)).length
  await input.uploadFile(path.join(FIX, fileName))
  const start = Date.now()
  while (Date.now() - start < 8000) {
    if ((await getShapes(page)).length > before) return true
    await sleep(100)
  }
  return false
}
const transformerAnchor = (page, name) => page.evaluate(n => {
  const tr = window.__stage.find('Transformer')[0]
  if (!tr) return null
  const a = tr.findOne('.' + n)
  return a ? a.getAbsolutePosition() : null
}, name)

const norm = s => ({
  id: s.id, type: s.type,
  x: round(s.x), y: round(s.y),
  width: round(s.width), height: round(s.height),
  rotation: round(s.rotation || 0),
  text: s.text,
  points: Array.isArray(s.points) ? s.points.map(round) : null,
  startBinding: s.startBinding ?? null,
  endBinding: s.endBinding ?? null,
  srcLen: s.srcLen,
})
const snapNorm = async page => (await getShapes(page)).map(norm)
const shallowEqual = (a, b) => a.id === b.id && a.type === b.type &&
  a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height &&
  a.rotation === b.rotation && a.text === b.text &&
  a.startBinding === b.startBinding && a.endBinding === b.endBinding &&
  a.srcLen === b.srcLen &&
  JSON.stringify(a.points) === JSON.stringify(b.points)
const deepEqual = (left, right) =>
  left.length === right.length && left.every((s, i) => shallowEqual(s, right[i]))

async function main() {
  const consoleErrors = [], pageErrors = []
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: await puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    defaultViewport: { width: 1280, height: 800 },
  })
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('diagram-board-cookie-consent', JSON.stringify({ choice: 'accept_all', timestamp: Date.now() })) } catch (e) {} })
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  page.on('pageerror', e => pageErrors.push(String(e)))
  page.on('dialog', async d => { try { await d.accept() } catch {} })

  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await waitApp(page)
  if (await page.evaluate(() => !!document.querySelector('.modal-fresh'))) { await page.click('.modal-fresh'); await sleep(400) }
  await page.evaluate(() => { try { localStorage.clear() } catch {} })
  await page.reload({ waitUntil: 'domcontentloaded' }); await waitApp(page)
  if (await page.evaluate(() => !!document.querySelector('.modal-fresh'))) { await page.click('.modal-fresh'); await sleep(300) }
  await generateFixtures(page)
  await resetBoard(page)

  // 1) Rectangle A
  await setTool(page, 'r'); await drag(page, 200, 200, 360, 320)
  const A = (await getShapes(page)).at(-1)
  // 2) Ellipse B
  await setTool(page, 'o'); await drag(page, 720, 200, 880, 340)
  const B = (await getShapes(page)).at(-1)
  // 3) Arrow connecting A -> B
  {
    const a = getShape(await getShapes(page), A.id)
    const b = getShape(await getShapes(page), B.id)
    const ax = a.x + a.width, ay = a.y + a.height / 2
    const bx = b.x, by = b.y + b.height / 2
    await setTool(page, 'a'); await drag(page, ax, ay, bx, by)
  }
  const arrow = (await getShapes(page)).at(-1)
  // 4) Text
  await setTool(page, 't')
  await page.mouse.click(250, 460); await sleep(150)
  await page.keyboard.type('Redo Integrity', { delay: 12 }); await sleep(120)
  await page.mouse.click(760, 660); await sleep(200) // commit text by blurring
  const text = (await getShapes(page)).at(-1)
  // 5) Image
  await uploadImage(page, 'square.png'); await sleep(250)
  const img = (await getShapes(page)).at(-1)
  // 6) Move A
  await setTool(page, 'v')
  await page.mouse.click(A.x + A.width / 2, A.y + A.height / 2); await sleep(120)
  await drag(page, A.x + A.width / 2, A.y + A.height / 2, A.x + A.width / 2, A.y + A.height / 2 + 140)
  // 7) Resize B
  await page.mouse.click(B.x + B.width / 2, B.y + B.height / 2); await sleep(120)
  const br = await transformerAnchor(page, 'bottom-right')
  if (br) await drag(page, br.x, br.y, br.x + 50, br.y + 40)
  await sleep(150)

  const expected = await snapNorm(page)
  record('REDO-SETUP', 'built a mixed board (rect, ellipse, arrow, text, image, move, resize)',
    expected.length === 5 && !!A && !!B && arrow.type === 'arrow' && text.type === 'text' && img.type === 'image',
    `shapes=${expected.length}`)

  // Verify the arrow connection targets A and B in the live board.
  const liveConn = arrow.startBinding === A.id && arrow.endBinding === B.id
  record('REDO-SETUP', 'arrow binds A (start) and B (end) live', liveConn,
    `start=${arrow.startBinding} end=${arrow.endBinding}`)

  // Undo EVERYTHING until the board is empty.
  let undoCount = 0
  for (let i = 0; i < 40; i++) {
    const n = (await getShapes(page)).length
    if (n === 0) break
    await page.evaluate(() => { const a = document.activeElement; if (a && a !== document.body) a.blur() })
    await page.keyboard.down('Control'); await page.keyboard.press('KeyZ'); await page.keyboard.up('Control')
    await sleep(110); undoCount++
  }
  const afterUndo = await snapNorm(page)
  record('REDO-UNDO', 'undo removed every action (board empty)', afterUndo.length === 0, `undoCount=${undoCount} remaining=${afterUndo.length}`)

  // Redo EVERYTHING, replaying commits in order.
  let restored = null, redoCount = 0
  for (let i = 0; i < 40; i++) {
    const cur = await snapNorm(page)
    if (deepEqual(cur, expected)) { restored = cur; redoCount = i + 1; break }
    await page.evaluate(() => { const a = document.activeElement; if (a && a !== document.body) a.blur() })
    await page.keyboard.down('Control'); await page.keyboard.down('Shift'); await page.keyboard.press('KeyZ'); await page.keyboard.up('Shift'); await page.keyboard.up('Control')
    await sleep(120); redoCount++
  }
  if (!restored) restored = await snapNorm(page)
  // One more redo must be a no-op (redo stack exhausted).
  const beforeExtra = JSON.stringify(restored)
  await page.evaluate(() => { const a = document.activeElement; if (a && a !== document.body) a.blur() })
  await page.keyboard.down('Control'); await page.keyboard.down('Shift'); await page.keyboard.press('KeyZ'); await page.keyboard.up('Shift'); await page.keyboard.up('Control')
  await sleep(120)
  const afterExtra = await snapNorm(page)
  const noopRedo = JSON.stringify(afterExtra) === beforeExtra

  const orderOk = restored.map(s => s.type).join(',') === expected.map(s => s.type).join(',')
  record('REDO-ORDER', 'restored shape order matches', orderOk, restored.map(s => s.type).join(','))

  const positionsOk = restored.length === expected.length && restored.every((s, i) => s.x === expected[i].x && s.y === expected[i].y)
  record('REDO-POS', 'restored positions match', positionsOk,
    restored.map(s => `${s.type}:${s.x},${s.y}`).join(' '))

  const sizesOk = restored.every((s, i) => s.width === expected[i].width && s.height === expected[i].height)
  record('REDO-SIZE', 'restored sizes match', sizesOk,
    restored.map(s => `${s.type}:${s.width}x${s.height}`).join(' '))

  const textOk = restored.some(s => s.type === 'text' && s.text === 'Redo Integrity')
  record('REDO-TEXT', 'restored text content matches', textOk,
    JSON.stringify(restored.find(s => s.type === 'text')?.text))

  // Connections: arrow must bind the SAME A and B, and those shapes must exist.
  const rArrow = restored.find(s => s.type === 'arrow')
  const rA = getShape(restored, A.id), rB = getShape(restored, B.id)
  const connOk = !!rArrow && rArrow.startBinding === A.id && rArrow.endBinding === B.id && !!rA && !!rB
  record('REDO-CONN', 'restored arrow still connects A and B (bindings + targets intact)', connOk,
    `start=${rArrow?.startBinding} end=${rArrow?.endBinding}`)

  record('REDO-EXHAUST', 'final redo is a no-op (stack fully replayed)', noopRedo && deepEqual(afterExtra, expected))

  record('REDO-FULL', 'restored board deep-equals pre-undo board', deepEqual(restored, expected),
    `redoCount=${redoCount}`)

  record('REDO-CONSOLE', 'no unexpected console/page errors during redo cycle', consoleErrors.length === 0 && pageErrors.length === 0,
    `consoleErrors=${consoleErrors.length} pageErrors=${pageErrors.length}`)

  await browser.close()

  const passed = results.filter(r => r.pass).length
  console.log(`\n==== REDO INTEGRITY SUMMARY: ${passed}/${results.length} passed ====`)
  if (passed !== results.length) process.exitCode = 1
}
main().catch(e => { console.error(e); process.exit(1) })
