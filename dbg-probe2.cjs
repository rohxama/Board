const puppeteer = require('puppeteer-core')
const { decodePNG } = require('./pnglib.cjs')
const fs = require('fs')
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

  await page.click('[title="Pan (H)"]')
  await sleep(200)
  await page.mouse.move(600, 400)
  await page.mouse.down()
  await page.mouse.move(900, 400, { steps: 16 })
  await page.mouse.up()
  await sleep(400)

  const probe = await page.evaluate(() => {
    const st = window.__benchStage
    const r = st.findOne('Rect')
    return {
      stagePos: st.position(),
      stageAbsFresh: st.getAbsoluteTransform(true).getTranslation(),
      rectParent: r.getParent().getClassName(),
      layerAbsFresh: r.getParent().getAbsoluteTransform(true).getTranslation(),
      rectAbsFresh: r.getAbsoluteTransform(true).getTranslation(),
      rectAbsCached: r.getAbsoluteTransform().getTranslation(),
      htmlVersion: (document.documentElement.outerHTML.match(/<html[^>]*>/) || [''])[0]
    }
  })
  console.log('PROBE:', JSON.stringify(probe))

  await page.evaluate(() => {
    const m = document.createElement('div')
    m.id = 'MARKER'
    m.style.cssText = 'position:fixed;top:380px;left:60px;width:40px;height:40px;background:rgb(200,0,0);z-index:99999'
    document.body.appendChild(m)
  })
  await sleep(250)
  await page.screenshot({ path: 'viewport-tests/debug-marker.png', clip: { x: 0, y: 0, width: 1200, height: 800, scale: 1 } })
  const img = decodePNG(fs.readFileSync('viewport-tests/debug-marker.png'))
  const px = []
  for (const [x, y] of [[80, 400], [79, 399], [60, 380], [100, 420]]) {
    const i = (y * img.w + x) * 4
    px.push(`(${x},${y}) rgb(${img.data[i]},${img.data[i + 1]},${img.data[i + 2]})`)
  }
  console.log('MARKER PIXELS:', px.join('  '))

  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })