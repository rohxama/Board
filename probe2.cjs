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
  await sleep(800)

  const info = await page.evaluate(() => {
    const darkEls = []
    document.querySelectorAll('body *').forEach(el => {
      if (el === document.body) return
      const cs = getComputedStyle(el)
      const bg = cs.backgroundColor
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
      if (m) {
        const [, r, g, b, a] = m
        const alpha = a === undefined ? 1 : parseFloat(a)
        const ar = +r * alpha, ag = +g * alpha, ab = +b * alpha
        if (ar + ag + ab < 240) {
          const rc = el.getBoundingClientRect()
          darkEls.push({ tag: el.tagName, cls: el.className, text: (el.textContent || '').slice(0, 60), rect: { x: Math.round(rc.x), y: Math.round(rc.y), w: Math.round(rc.width), h: Math.round(rc.height) }, bg: `${bg} @${alpha}` })
        }
      }
    })
    const canvases = [...document.querySelectorAll('.canvas-host canvas')].map(c => ({ cssTr: getComputedStyle(c).transform, rect: { x: Math.round(c.getBoundingClientRect().x), y: Math.round(c.getBoundingClientRect().y), w: Math.round(c.getBoundingClientRect().width), h: Math.round(c.getBoundingClientRect().height) } }))
    const layers = window.__benchStage.getLayers().map(l => ({ sx: l.scaleX(), sy: l.scaleY(), x: l.x(), y: l.y(), vis: l.visible() }))
    return { darkEls, canvases, layers }
  })
  console.log(JSON.stringify(info, null, 1))
  await browser.close()
})().catch(e => { console.error('FATAL', e); process.exit(2) })