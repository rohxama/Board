const puppeteer = require('puppeteer-core')
const { decodePNG } = require('./pnglib.cjs')
const fs = require('fs')
const path = require('path')

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:4179/'
const OUT = path.join(__dirname, 'viewport-tests')

const sleep = ms => new Promise(r => setTimeout(r, ms))
const results = []
const check = (name, ok, detail) => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  ${detail}`) }

// Largest connected dark component = the rectangle outline (UI glyphs are tiny).
function biggestComp(img) {
  const dark = (x, y) => {
    const i = (y * img.w + x) * 4
    const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2]
    return r < 90 && g < 100 && b < 110 && r + g + b < 270
  }
  const visited = new Uint8Array(img.w * img.h)
  let best = null
  for (let y = 60; y < 760; y++) {
    for (let x = 64; x < 1140; x++) {
      const i = y * img.w + x
      if (visited[i] || !dark(x, y)) continue
      const stack = [[x, y]]
      visited[i] = 1
      let minX = x, maxX = x, minY = y, maxY = y, n = 0
      while (stack.length) {
        const [cx, cy] = stack.pop()
        n++
        if (cx < minX) minX = cx; if (cx > maxX) maxX = cx
        if (cy < minY) minY = cy; if (cy > maxY) maxY = cy
        for (const [nx, ny] of [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]]) {
          if (nx < 64 || nx >= 1140 || ny < 60 || ny >= 760) continue
          const ni = ny * img.w + nx
          if (!visited[ni] && dark(nx, ny)) { visited[ni] = 1; stack.push([nx, ny]) }
        }
      }
      if (!best || n > best.px) best = { x: minX, y: minY, w: maxX - minX, h: maxY - minY, px: n, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 }
    }
  }
  return best
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--window-size=1200,800'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  page.on('pageerror', e => console.log('PAGE ERROR:', e.message))

  await page.goto(URL, { waitUntil: 'networkidle0' })
  for (let i = 0; i < 200; i++) {
    const ready = await page.evaluate(() => !document.querySelector('.splash-screen') && !!window.__benchStage).catch(() => false)
    if (ready) break
    await sleep(100)
  }
  await sleep(1500)

  const stageState = () => page.evaluate(() => ({ x: Math.round(window.__benchStage.x() * 100) / 100, y: Math.round(window.__benchStage.y() * 100) / 100, s: Math.round(window.__benchStage.scaleX() * 1000) / 1000 }))
  const rectWorld = () => page.evaluate(() => { const r = window.__benchStage.findOne('Rect'); return r ? { x: r.x(), y: r.y(), w: r.width(), h: r.height() } : null })

  await page.click('[title="Rectangle (R)"]')
  await sleep(200)
  await page.mouse.move(450, 300)
  await page.mouse.down()
  await page.mouse.move(750, 500, { steps: 12 })
  await page.mouse.up()
  await sleep(500)
  const world0 = await rectWorld()
  console.log('drawn rect world:', JSON.stringify(world0))

  const shot = async name => {
    const p = path.join(OUT, name + '.png')
    await page.screenshot({ path: p, clip: { x: 0, y: 0, width: 1200, height: 800, scale: 1 } })
    const img = decodePNG(fs.readFileSync(p))
    return biggestComp(img)
  }

  let b = await shot('00-baseline')
  console.log('baseline rect component:', JSON.stringify(b))
  check('setup: rectangle visible at center', !!b && b.w > 250 && b.h > 150, `bbox w=${b ? b.w : 0} h=${b ? b.h : 0}`)
  const C0 = b

  const pan = async (x1, y1, x2, y2) => {
    await page.mouse.move(x1, y1)
    await page.mouse.down()
    await page.mouse.move(x2, y2, { steps: 16 })
    await page.mouse.up()
    await sleep(300)
  }

  // A: pan right 300
  await page.click('[title="Pan (H)"]')
  await sleep(200)
  await pan(600, 400, 900, 400)
  const A = await shot('A-pan-right')
  check('A: rect moved RIGHT ~300px', A && Math.abs(A.cx - (C0.cx + 300)) < 30, `center ${C0.cx}->${A.cx} (want +300)`)
  console.log('A stage:', JSON.stringify(await stageState()))

  // B: pan left 300
  await pan(900, 400, 600, 400)
  const B = await shot('B-pan-left')
  check('B: rect moved LEFT ~300px (back)', B && Math.abs(B.cx - C0.cx) < 30, `center ${A.cx}->${B.cx} (want ~${C0.cx})`)

  // C: pan up 150
  await pan(600, 400, 600, 250)
  const C = await shot('C-pan-up')
  check('C: rect moved UP ~150px', C && Math.abs(C.cy - (C0.cy - 150)) < 30, `center ${C0.cy}->${C.cy} (want -150)`)

  // D: pan down 150
  await pan(600, 250, 600, 400)
  const D = await shot('D-pan-down')
  check('D: rect moved DOWN ~150px (back)', D && Math.abs(D.cy - C0.cy) < 30, `center ${C.cy}->${D.cy} (want ~${C0.cy})`)

  // E: zoom in (1.15)
  await page.click('[title="Zoom in"]')
  await sleep(400)
  const E = await shot('E-zoom-in')
  check('E: rect visually LARGER', E && E.w > C0.w * 1.08, `width ${C0.w}->${E.w} (want >=${Math.round(C0.w * 1.08)})`)
  check('E: zoom keeps center', E && Math.abs(E.cx - C0.cx) < 25 && Math.abs(E.cy - C0.cy) < 25, `center ${C0.cx},${C0.cy} -> ${E.cx},${E.cy}`)

  // F: zoom out (back to 1.0)
  await page.click('[title="Zoom out"]')
  await sleep(400)
  const F = await shot('F-zoom-out')
  check('F: rect visually SMALLER (back)', F && Math.abs(F.w - C0.w) < 15, `width ${E.w}->${F.w} (want ~${C0.w})`)

  // G: zoom in twice, then pan right 200
  await page.click('[title="Zoom in"]')
  await sleep(350)
  await page.click('[title="Zoom in"]')
  await sleep(350)
  const G0 = await shot('G-zoomed-before-pan')
  await pan(600, 400, 800, 400)
  const G1 = await shot('G-pan-after-zoom')
  check('G: pan works while zoomed (moved RIGHT 200)', G1 && Math.abs(G1.cx - (G0.cx + 200)) < 30, `center ${G0.cx}->${G1.cx} (want +200)`)
  check('G: zoom survives pan (still larger than 1x)', G1 && G1.w > C0.w * 1.15, `width ${G1.w} vs 1x ${C0.w}`)

  // H: pan -> Rectangle -> pan again
  await page.click('[title="Rectangle (R)"]')
  await sleep(200)
  await page.click('[title="Pan (H)"]')
  await sleep(200)
  await pan(600, 400, 450, 400)
  const H = await shot('H-pan-after-tool-switch')
  check('H: pan still works after tool switch (LEFT 150)', H && Math.abs(H.cx - (G1.cx - 150)) < 30, `center ${G1.cx}->${H.cx} (want -150)`)

  const worldEnd = await rectWorld()
  const stageEnd = await stageState()
  check('world coords NEVER changed', world0 && worldEnd && world0.x === worldEnd.x && world0.y === worldEnd.y && world0.w === worldEnd.w && world0.h === worldEnd.h, `${JSON.stringify(world0)} -> ${JSON.stringify(worldEnd)}`)
  console.log('final stage:', JSON.stringify(stageEnd))

  await browser.close()
  const failed = results.filter(r => !r.ok)
  console.log(`\n=== ${results.length - failed.length}/${results.length} passed ===`)
  process.exit(failed.length ? 1 : 0)
})().catch(e => { console.error('FATAL', e); process.exit(2) })