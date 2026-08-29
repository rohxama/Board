const puppeteer = require('puppeteer-core')
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const sleep = ms => new Promise(r => setTimeout(r, ms))
const results = []
const check = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  ${detail}`) }

;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--window-size=1200,800'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  page.on('pageerror', e => console.log('PAGE ERROR:', e.message))
  await page.goto('http://localhost:4179/', { waitUntil: 'networkidle0' })
  for (let i = 0; i < 200; i++) {
    if (await page.evaluate(() => !document.querySelector('.splash-screen') && !!window.__benchStage).catch(() => false)) break
    await sleep(100)
  }
  await sleep(1200)

  const state = () => page.evaluate(() => {
    const st = window.__benchStage
    return JSON.stringify({ stage: { x: st.x(), y: st.y(), s: st.scaleX() }, shapes: st.find('Shape').filter(n => n.getAttr('shapeId')).map(n => ({ t: n.getClassName(), x: Math.round(n.x() * 100) / 100, y: Math.round(n.y() * 100) / 100, w: Math.round(n.width() * 100) / 100, h: Math.round(n.height() * 100) / 100 })) })
  })
  const rect = () => page.evaluate(() => { const r = window.__benchStage.findOne('Rect'); return r ? { x: r.x(), y: r.y(), w: r.width(), h: r.height() } : null })
  const nShapes = () => page.evaluate(() => window.__benchStage.find('Shape').filter(n => n.getAttr('shapeId')).length)

  await page.click('[title="Rectangle (R)"]')
  await sleep(200)
  await page.mouse.move(450, 300)
  await page.mouse.down()
  await page.mouse.move(750, 500, { steps: 12 })
  await page.mouse.up()
  await sleep(400)
  const r0 = await rect()
  check('rect drawn', r0 && Math.abs(r0.x - 450) < 6 && Math.abs(r0.w - 300) < 12, JSON.stringify(r0))

  // select + drag the rect by (100, 0) — deselect first so the Transformer doesn't intercept
  await page.click('[title="Select (V)"]')
  await sleep(200)
  await page.mouse.click(200, 650)
  await sleep(300)
  await page.mouse.move(560, 400)
  await page.mouse.down()
  await page.mouse.move(660, 400, { steps: 10 })
  await page.mouse.up()
  await sleep(400)
  const r1 = await rect()
  check('drag moves rect in world space', r0 && r1 && Math.abs(r1.x - (r0.x + 100)) < 10 && Math.abs(r1.y - r0.y) < 10, `${JSON.stringify(r0)} -> ${JSON.stringify(r1)}`)

  // undo / redo
  await page.keyboard.down('Control')
  await page.keyboard.press('z')
  await page.keyboard.up('Control')
  await sleep(400)
  const r2 = await rect()
  check('undo restores position', r2 && Math.abs(r2.x - r0.x) < 6, `${JSON.stringify(r1)} -> ${JSON.stringify(r2)}`)
  await page.keyboard.down('Control')
  await page.keyboard.down('Shift')
  await page.keyboard.press('z')
  await page.keyboard.up('Shift')
  await page.keyboard.up('Control')
  await sleep(400)
  const r3 = await rect()
  check('redo re-applies position', r3 && Math.abs(r3.x - (r0.x + 100)) < 10, `-> ${JSON.stringify(r3)}`)

  // text tool: click, type, commit
  await page.click('[title="Text (T)"]')
  await sleep(200)
  await page.mouse.click(300, 260)
  await sleep(300)
  await page.keyboard.type('hi there')
  await sleep(200)
  await page.mouse.click(500, 600)
  await sleep(500)
  const txt = await page.evaluate(() => { const t = window.__benchStage.findOne('Text'); return t ? { text: t.text(), x: t.x(), y: t.y() } : null })
  check('text committed', !!txt && txt.text === 'hi there', JSON.stringify(txt))

  // eraser removes the text
  await page.click('[title="Eraser (X)"]')
  await sleep(200)
  const tp = txt ? { x: txt.x + 40, y: txt.y + 20 } : { x: 300, y: 260 }
  await page.mouse.click(tp.x, tp.y)
  await sleep(400)
  check('eraser removes shape', (await nShapes()) === 1, `shapes now ${await nShapes()}`)

  // zoom reset to 100%
  await page.click('[title="Zoom in"]')
  await sleep(300)
  await page.click('[title="Zoom in"]')
  await sleep(300)
  let s = await state()
  check('zoomed in to 1.32', s.includes('"s":1.3225000000000002') || s.includes('"s":1.32'), s)
  await page.click('[title="Reset zoom (double-click)"]')
  await sleep(400)
  s = await state()
  check('reset to 100% at 0,0', s.includes('"s":1') && s.includes('"x":0') && s.includes('"y":0'), s)

  // zoom to fit
  await page.click('[title="Zoom to fit"]')
  await sleep(400)
  s = await state()
  const fitCheck = await page.evaluate(() => {
    const st = window.__benchStage
    const r = st.findOne('Rect')
    const l = r.x(), t = r.y(), w = r.width(), h = r.height()
    const s = st.scaleX()
    const vl = -st.x() / s, vt = -st.y() / s
    return { scale: Math.round(s * 100) / 100, leftVisible: vl, topVisible: vt, rightEdge: l + w, bottomEdge: t + h, fits: (l >= vl - 2 && t >= vt - 2) }
  })
  check('fit shows whole rect', fitCheck.fits && fitCheck.scale >= 1, JSON.stringify(fitCheck))

  // wheel zoom at pointer: world point under cursor stays fixed
  await page.click('[title="Reset zoom (double-click)"]')
  await sleep(300)
  const before = await page.evaluate(() => { const st = window.__benchStage; const p = st.getPointerPosition(); return { x: st.x(), y: st.y(), s: st.scaleX(), p } })
  await page.mouse.move(700, 500)
  await page.mouse.wheel({ deltaY: -120 })
  await sleep(500)
  const after = await page.evaluate(() => { const st = window.__benchStage; return { x: st.x(), y: st.y(), s: st.scaleX() } })
  const bx = (700 - before.x) / before.s, by = (500 - before.y) / before.s
  const ax = (700 - after.x) / after.s, ay = (500 - after.y) / after.s
  check('ctrl-wheel zoom at pointer (anchored)', after.s > before.s && Math.abs(ax - bx) < 0.5 && Math.abs(ay - by) < 0.5, `scale ${before.s}->${after.s}, anchor drift ${Math.round((ax - bx) * 1000) / 1000},${Math.round((ay - by) * 1000) / 1000}`)

  await browser.close()
  const failed = results.filter(r => !r.ok)
  console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`)
  process.exit(failed.length ? 1 : 0)
})().catch(e => { console.error('FATAL', e); process.exit(2) })