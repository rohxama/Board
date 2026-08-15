const puppeteer = require('puppeteer-core')
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:4179/'
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

function components(img, x0, y0, x1, y1) {
  const visited = new Uint8Array(img.w * img.h)
  const comps = []
  const isDark = (x, y) => {
    const i = (y * img.w + x) * 4
    const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2]
    return r < 90 && g < 100 && b < 110 && r + g + b < 270
  }
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = y * img.w + x
      if (visited[i] || !isDark(x, y)) continue
      const stack = [[x, y]]
      visited[i] = 1
      let minX = x, maxX = x, minY = y, maxY = y, count = 0
      while (stack.length) {
        const [cx, cy] = stack.pop()
        count++
        if (cx < minX) minX = cx; if (cx > maxX) maxX = cx
        if (cy < minY) minY = cy; if (cy > maxY) maxY = cy
        for (const [nx, ny] of [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]]) {
          if (nx < x0 || nx >= x1 || ny < y0 || ny >= y1) continue
          const ni = ny * img.w + nx
          if (!visited[ni] && isDark(nx, ny)) { visited[ni] = 1; stack.push([nx, ny]) }
        }
      }
      comps.push({ x: minX, y: minY, w: maxX - minX, h: maxY - minY, px: count })
    }
  }
  return comps.sort((a, b) => b.px - a.px)
}

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
  await sleep(1200)

  const before = path.join(__dirname, 'viewport-tests', 'X-before-draw.png')
  await page.screenshot({ path: before })

  await page.click('[title="Rectangle (R)"]')
  await sleep(200)
  await page.mouse.move(450, 300)
  await page.mouse.down()
  await page.mouse.move(750, 500, { steps: 10 })
  await page.mouse.up()
  await sleep(600)
  const after = path.join(__dirname, 'viewport-tests', 'X-after-draw.png')
  await page.screenshot({ path: after })

  const A = components(decodePNG(fs.readFileSync(before)), 0, 0, 1200, 800)
  const B = components(decodePNG(fs.readFileSync(after)), 0, 0, 1200, 800)
  console.log('=== BEFORE DRAW (top 12) ===')
  A.slice(0, 12).forEach(c => console.log(`x=${c.x} y=${c.y} w=${c.w} h=${c.h} px=${c.px}`))
  console.log('=== AFTER DRAW (top 20) ===')
  B.slice(0, 20).forEach(c => console.log(`x=${c.x} y=${c.y} w=${c.w} h=${c.h} px=${c.px}`))
  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })