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

  await page.evaluate(() => {
    window.__ddInfo = () => {
      const DD = window.KonvaInternals ? window.KonvaInternals.DD : null
      return 'n/a'
    }
  })
  const info1 = await page.evaluate(() => {
    const r = window.__benchStage.findOne('Rect')
    return JSON.stringify({ eventKeys: Object.keys(r.eventListeners || {}), mousedownLen: (r.eventListeners.mousedown || []).length, touchstartLen: (r.eventListeners.touchstart || []).length })
  })
  console.log('rect event listeners:', info1)

  await page.mouse.move(560, 400)
  await page.mouse.down()
  const info2 = await page.evaluate(() => {
    const KonvaNS = eval('Konva')
    const DD = KonvaNS && KonvaNS.DD
    return JSON.stringify({ ddSize: DD ? DD._dragElements.size : -1, ddKeys: DD ? [...DD._dragElements.keys()] : [] })
  })
  console.log('after pointerdown:', info2)
  await page.mouse.move(580, 400, { steps: 2 })
  const info3 = await page.evaluate(() => {
    const KonvaNS = eval('Konva')
    const DD = KonvaNS && KonvaNS.DD
    const els = DD ? [...DD._dragElements.entries()].map(([k, e]) => ({ k, status: e.dragStatus, x: e.node && Math.round(e.node.x()) })) : []
    return JSON.stringify({ dd: els })
  })
  console.log('after move:', info3)
  await page.mouse.up()
  await sleep(200)

  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })