const puppeteer = require('puppeteer-core')

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:4179/'
const sleep = ms => new Promise(r => setTimeout(r, ms))

;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--window-size=1200,800', '--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  page.on('pageerror', e => console.log('PAGE ERROR:', e.message))
  await page.goto(URL, { waitUntil: 'networkidle0' })
  for (let i = 0; i < 200; i++) {
    const ready = await page.evaluate(() => !document.querySelector('.splash-screen') && !!window.__benchStage).catch(() => false)
    if (ready) break
    await sleep(100)
  }
  await sleep(1000)

  const before = await page.evaluate(() => ({
    ls: localStorage.getItem('diagram-board-v1'),
    allNodes: window.__benchStage.find('Rect').map(r => ({ x: r.x(), y: r.y(), w: r.width(), h: r.height(), stroke: r.stroke(), dash: r.dash(), fill: r.fill() })),
  }))
  console.log('BEFORE DRAW:')
  console.log('localStorage:', before.ls)
  console.log('rects:', JSON.stringify(before.allNodes))

  await page.click('[title="Rectangle (R)"]')
  await sleep(200)
  await page.mouse.move(450, 300)
  await page.mouse.down()
  await page.mouse.move(750, 500, { steps: 10 })
  await page.mouse.up()
  await sleep(600)

  const after = await page.evaluate(() => ({
    ls: localStorage.getItem('diagram-board-v1'),
    allNodes: window.__benchStage.find('Rect').map(r => ({ x: r.x(), y: r.y(), w: r.width(), h: r.height(), stroke: r.stroke(), dash: r.dash(), fill: r.fill(), vis: r.visible() })),
    hintPresent: !!document.querySelector('.canvas-host > div[style*="Your canvas is empty"]') || [...document.querySelectorAll('.canvas-host div')].some(d => d.textContent.includes('canvas is empty')),
  }))
  console.log('AFTER DRAW:')
  console.log('localStorage:', after.ls && after.ls.slice(0, 300))
  console.log('rects:', JSON.stringify(after.allNodes))
  console.log('hint:', after.hintPresent)
  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })