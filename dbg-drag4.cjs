const puppeteer = require('puppeteer-core')
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const sleep = ms => new Promise(r => setTimeout(r, ms))

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
  await page.click('[title="Rectangle (R)"]')
  await sleep(200)
  await page.mouse.move(450, 300)
  await page.mouse.down()
  await page.mouse.move(750, 500, { steps: 12 })
  await page.mouse.up()
  await sleep(400)
  await page.click('[title="Select (V)"]')
  await sleep(200)
  await page.mouse.click(200, 650)
  await sleep(300)

  const out = await page.evaluate(() => {
    const st = window.__benchStage
    const r = st.findOne('Rect')
    window.__fired = []
    r.on('mousedown', () => window.__fired.push('rect-md'))
    r.on('pointerdown', () => window.__fired.push('rect-pd'))
    const c = document.querySelector('.konvajs-content')
    c.dispatchEvent(new MouseEvent('mousedown', { clientX: 560, clientY: 400, button: 0, bubbles: true, cancelable: true }))
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 570, clientY: 400, buttons: 1, bubbles: true }))
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 580, clientY: 400, buttons: 1, bubbles: true }))
    return JSON.stringify({ fired: window.__fired, isDragging: r.isDragging(), x: Math.round(r.x()) })
  })
  console.log('synthetic mousedown + mousemove:', out)

  const out2 = await page.evaluate(() => {
    const st = window.__benchStage
    const r = st.findOne('Rect')
    window.__fired2 = []
    r.on('pointerdown', () => window.__fired2.push('rect-pd2'))
    const c = document.querySelector('.konvajs-content')
    c.dispatchEvent(new PointerEvent('pointerdown', { clientX: 560, clientY: 400, pointerId: 1, button: 0, bubbles: true, cancelable: true, composed: true }))
    return JSON.stringify({ fired2: window.__fired2 })
  })
  console.log('synthetic pointerdown:', out2)

  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })