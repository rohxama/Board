import puppeteer from 'puppeteer'
const sleep = ms => new Promise(r => setTimeout(r, ms))
const ROOT = 'D:/Board'
const browser = await puppeteer.launch({ headless: 'new', executablePath: await puppeteer.executablePath(), args: ['--no-sandbox', '--window-size=1280,800'], defaultViewport: { width: 1280, height: 800 } })
const page = await browser.newPage()
page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE-ERR', m.text()) })
page.on('pageerror', e => console.log('PAGEERR', String(e)))
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
while (!(await page.evaluate(() => !!(window.__app && window.__stage)))) await sleep(200)
if (await page.evaluate(() => !!document.querySelector('.modal-fresh'))) { await page.click('.modal-fresh'); await sleep(400) }
// reset
await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control'); await sleep(80)
await page.keyboard.press('Delete'); await sleep(150)
// blur + select tool
await page.evaluate(() => { const a = document.activeElement; if (a && a !== document.body) a.blur() })
await page.keyboard.press('v'); await sleep(80)
console.log('activeTool after v:', await page.evaluate(() => window.__app.state.activeTool))
// try rectangle via 'r'
await page.evaluate(() => { const a = document.activeElement; if (a && a !== document.body) a.blur() })
await page.keyboard.press('r'); await sleep(100)
console.log('activeTool after r:', await page.evaluate(() => window.__app.state.activeTool))
const drag = async (x1, y1, x2, y2) => { await page.mouse.move(x1, y1); await page.mouse.down(); await page.mouse.move(x2, y2, { steps: 15 }); await page.mouse.up(); await sleep(150) }
await drag(250, 640, 400, 720)
console.log('shapes after rectangle drag:', await page.evaluate(() => window.__app.shapes.map(s => s.type)))
// Now image + resize anchor test
await page.evaluate(() => { const a = document.activeElement; if (a && a !== document.body) a.blur() })
await page.keyboard.press('v'); await sleep(80)
// upload an image
const input = await page.$('input[type=file][accept*="image/png"]')
const FIX = ROOT + '/tests/fixtures'
await input.uploadFile(FIX + '/square.png'); await sleep(400)
console.log('shapes after upload:', await page.evaluate(() => window.__app.shapes.map(s => s.type)))
const img = await page.evaluate(() => { const s = window.__app.shapes.find(x => x.type === 'image'); return s ? { x: s.x, y: s.y, w: s.width, h: s.height } : null })
console.log('img:', img)
// click center to select
await page.mouse.click(img.x + img.w / 2, img.y + img.h / 2); await sleep(150)
console.log('selected:', await page.evaluate(() => window.__app.state.selectedShapeIds))
const anchor = await page.evaluate(() => { const tr = window.__stage.find('Transformer')[0]; if (!tr) return null; const a = tr.findOne('.bottom-right'); return a ? a.getAbsolutePosition() : null })
console.log('anchor:', anchor)
if (anchor) { await drag(anchor.x, anchor.y, anchor.x + 60, anchor.y + 30) }
console.log('img after resize:', await page.evaluate(() => { const s = window.__app.shapes.find(x => x.type === 'image'); return s ? { w: s.width, h: s.height } : null }))
await browser.close()
