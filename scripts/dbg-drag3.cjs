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
    window.__evs = []
    window.addEventListener('mousedown', e => window.__evs.push('window-md:' + e.clientX + ',' + e.clientY), true)
    window.addEventListener('pointerdown', e => window.__evs.push('window-pd:' + e.clientX + ',' + e.clientY), true)
    document.addEventListener('mousedown', e => window.__evs.push('doc-md:' + e.target.tagName + '.' + (e.target.className || '')), true)
  })
  await page.mouse.move(560, 400)
  await page.mouse.down()
  await sleep(150)
  const evs = await page.evaluate(() => JSON.stringify(window.__evs))
  console.log('DOM events at drag point:', evs)

  const dd = await page.evaluate(() => {
    const content = document.querySelector('.konvajs-content')
    return JSON.stringify({ contentClass: content ? content.className : 'NONE', listeners: content ? (content.__listeners ? 'has' : 'no') : '' })
  })
  console.log('content:', dd)

  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })