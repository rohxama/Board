const puppeteer = require('puppeteer-core')
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const sleep = ms => new Promise(r => setTimeout(r, ms))

function decodePNG(buf) {
  let pos = 8, w = 0, h = 0, colorType = 6
  const chunks = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.slice(pos + 8, pos + 8 + len)
    pos += 12 + len
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); colorType = data[8] }
    else if (type === 'IDAT') chunks.push(data)
    else if (type === 'IEND') break
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks))
  const bpp = colorType === 6 ? 4 : 3
  const stride = w * bpp
  const out = Buffer.alloc(w * h * bpp)
  let prev = Buffer.alloc(stride), o = 0
  for (let y = 0; y < h; y++) {
    const f = raw[o++]
    const line = raw.slice(o, o + stride); o += stride
    const cur = Buffer.alloc(stride)
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0
      const b = prev[i]
      const c = i >= bpp ? prev[i - bpp] : 0
      let v = line[i]
      if (f === 1) v += a
      else if (f === 2) v += b
      else if (f === 3) v += (a + b) >> 1
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
      cur[i] = v & 0xff
    }
    cur.copy(out, y * stride)
    prev = cur
  }
  return { w, h, data: out }
}

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

  const p1 = path.join(__dirname, 'viewport-tests', 'Y-puppeteer.png')
  await page.screenshot({ path: p1 })
  console.log('puppeteer shot black box:', JSON.stringify(blackBox(decodePNG(fs.readFileSync(p1)))))

  const cdp = await page.createCDPSession()
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
  const p2 = path.join(__dirname, 'viewport-tests', 'Y-cdp.png')
  fs.writeFileSync(p2, Buffer.from(data, 'base64'))
  console.log('cdp shot black box:', JSON.stringify(blackBox(decodePNG(fs.readFileSync(p2)))))

  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })