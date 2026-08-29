const puppeteer = require('puppeteer-core')
const fs = require('fs')
const path = require('path')
const { decodePNG } = require('./pnglib.cjs')

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const VIEWPORT_DIR = path.join(__dirname, '..', 'artifacts', 'viewport-tests')
const sleep = ms => new Promise(r => setTimeout(r, ms))

function blackBox(img) {
  let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1, n = 0
  for (let y = 0; y < img.h; y++) {
    for (let x = 0; x < img.w; x++) {
      const i = (y * img.w + x) * 4
      if (img.data[i] < 20 && img.data[i + 1] < 20 && img.data[i + 2] < 20) {
        if (x < minX) minX = x; if (x > maxX) maxX = x
        if (y < minY) minY = y; if (y > maxY) maxY = y
        n++
      }
    }
  }
  return { l: minX, t: minY, r: maxX, b: maxY, w: maxX - minX, h: maxY - minY, n }
}

;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--window-size=1200,800', '--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  await page.goto('data:text/html,<body style="margin:0"><div style="position:fixed;left:100px;top:80px;width:400px;height:200px;background:#000"></div></body>')
  await sleep(500)
  const info = await page.evaluate(() => ({
    inner: [window.innerWidth, window.innerHeight],
    vv: [window.visualViewport.width, window.visualViewport.height, window.visualViewport.scale, window.visualViewport.offsetLeft, window.visualViewport.offsetTop],
    dpr: window.devicePixelRatio,
    zoom: getComputedStyle(document.documentElement).zoom,
  }))
  console.log('page info:', JSON.stringify(info))

  fs.mkdirSync(VIEWPORT_DIR, { recursive: true })
  const p1 = path.join(VIEWPORT_DIR, 'Y-puppeteer.png')
  await page.screenshot({ path: p1 })
  console.log('puppeteer shot black box:', JSON.stringify(blackBox(decodePNG(fs.readFileSync(p1)))))

  const cdp = await page.createCDPSession()
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
  const p2 = path.join(VIEWPORT_DIR, 'Y-cdp.png')
  fs.writeFileSync(p2, Buffer.from(data, 'base64'))
  console.log('cdp shot black box:', JSON.stringify(blackBox(decodePNG(fs.readFileSync(p2)))))

  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })