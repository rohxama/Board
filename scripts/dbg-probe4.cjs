const puppeteer = require('puppeteer-core')
const { decodePNG } = require('./pnglib.cjs')
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
  await page.click('[title="Pan (H)"]')
  await sleep(200)
  await page.mouse.move(600, 400)
  await page.mouse.down()
  await page.mouse.move(900, 400, { steps: 16 })
  await page.mouse.up()
  await sleep(400)

  const info = await page.evaluate(() => {
    const st = window.__benchStage
    const wildcardCount = st.find('*').length
    const layers = st.getLayers()
    const deep = []
    const walk = n => { deep.push(n); if (n.hasChildren()) n.getChildren().forEach(walk) }
    layers.forEach(walk)
    const cleared = deep.filter(n => { n._clearCache('absoluteTransform'); return true }).length
    const r = st.findOne('Rect')
    st.draw()
    return JSON.stringify({ wildcardCount, cleared, rectAbsCached: r.getAbsoluteTransform().getTranslation(), stagePos: st.position() })
  })
  console.log('after deep clear + sync draw:', info)

  const deepPath = path.join(OUT, 'debug-deep.png')
  await page.screenshot({ path: deepPath, clip: { x: 0, y: 0, width: 1200, height: 800, scale: 1 } })
  const img = decodePNG(fs.readFileSync(deepPath))
  let nOld = 0, nNew = 0
  for (let y = 290; y < 510; y++) for (let x = 440; x < 760; x++) { const i = (y * img.w + x) * 4; if (img.data[i] < 90 && img.data[i + 1] < 100 && img.data[i + 2] < 110) nOld++ }
  for (let y = 290; y < 510; y++) for (let x = 740; x < 1060; x++) { const i = (y * img.w + x) * 4; if (img.data[i] < 90 && img.data[i + 1] < 100 && img.data[i + 2] < 110) nNew++ }
  console.log('dark px at old pos (440-760):', nOld, '  at new pos (740-1060):', nNew)

  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })