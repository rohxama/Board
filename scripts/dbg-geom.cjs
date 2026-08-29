const puppeteer = require('puppeteer-core')
const fs = require('fs')
const path = require('path')
const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const OUT = path.join(__dirname, '..', 'artifacts', 'viewport-tests')
const sleep = ms => new Promise(r => setTimeout(r, ms))

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
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

  const dump = label => page.evaluate(l => {
    const st = window.__benchStage
    const rect = st.findOne('Rect')
    const t = st.findOne('Transformer')
    const cs = [...document.querySelectorAll('canvas')].map(c => ({ w: c.width, h: c.height, cls: c.className }))
    const out = {
      stage: { x: st.x(), y: st.y(), s: st.scaleX() },
      rectAbs: rect ? rect.getAbsolutePosition() : null,
      rectClient: rect ? rect.getClientRect() : null,
      rectParent: rect ? rect.getParent().getClassName() + ':' + rect.getParent().name() : null,
      transformer: t ? { x: t.x(), y: t.y(), node: !!t.nodes() } : null,
      layerNames: st.getLayers().map(lr => lr.getClassName() + ':' + lr.name()),
      canvases: cs
    }
    return JSON.stringify(out)
  }, label).then(s => console.log(label, s))

  await dump('BEFORE pan: ')

  await page.click('[title="Pan (H)"]')
  await sleep(200)
  await page.mouse.move(600, 400)
  await page.mouse.down()
  await page.mouse.move(900, 400, { steps: 16 })
  await page.mouse.up()
  await sleep(400)

await dump('AFTER  pan: ')

  const shot1 = await page.screenshot({ path: path.join(OUT, 'debug-mid.png') })
  console.log('screenshot bytes (with patch):', shot1.length)

  await page.evaluate(() => {
    window.__benchStage.find('*').forEach(n => n._clearCache('absoluteTransform'))
    window.__benchStage.getLayers().forEach(l => l.batchDraw())
  })
  await sleep(300)
  await dump('FORCED cache clear: ')
  const shot2 = await page.screenshot({ path: path.join(OUT, 'debug-mid-cleared.png') })
  console.log('screenshot bytes (cache cleared):', shot2.length)

  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })

