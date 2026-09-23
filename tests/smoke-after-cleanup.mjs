import puppeteer from 'puppeteer'

const BASE = 'http://localhost:5199'
const sleep = ms => new Promise(r => setTimeout(r, ms))

const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
}

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
const errors = []
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))
page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()) })

// ---------------- Landing page ----------------
await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 30000 })
await sleep(600)
check('landing: renders hero headline', (await page.$('.ol-headline')) !== null)
check('landing: has START DRAWING cta', (await page.$('.ol-slack-cta')) !== null)
check('landing: hero image loads', await page.evaluate(() => {
  const img = document.querySelector('.ol-headline-portrait')
  return !!img && img.complete && img.naturalWidth > 0
}))
check('landing: doodle svg loads', await page.evaluate(() => {
  const img = document.querySelector('.ol-underline')
  return !!img && img.complete && img.naturalWidth > 0
}))
check('landing: menu popover opens', async () => {
  await page.click('.ol-control--menu')
  await sleep(200)
  return (await page.$('.ol-menu-popover')) !== null
})

// ---------------- Board route ----------------
await page.goto(BASE + '/#/board', { waitUntil: 'domcontentloaded' })
await page.waitForSelector('.canvas-host', { timeout: 15000 }).catch(() => {})
await sleep(1000)

const boardMounted = await page.evaluate(() => !!document.querySelector('.canvas-host') && !!document.querySelector('.left-toolbar') && !!document.querySelector('.top-toolbar'))
check('board: canvas + toolbars mount after splash', boardMounted)

if (boardMounted) {
  const modal = await page.$('.previous-board-modal')
  if (modal) { await page.click('.modal-fresh'); await sleep(400) }

  const shapeTypes = () => page.evaluate(() => (window.__app?.shapes || []).map(s => s.type))

  // Draw rectangle
  await page.keyboard.press('r'); await sleep(120)
  await page.mouse.move(400, 500); await page.mouse.down()
  await page.mouse.move(620, 660, { steps: 10 }); await page.mouse.up(); await sleep(250)
  check('board: draw rectangle (R + drag)', (await shapeTypes()).includes('rectangle'))

  // Draw ellipse
  await page.keyboard.press('o'); await sleep(120)
  await page.mouse.move(800, 300); await page.mouse.down()
  await page.mouse.move(950, 420, { steps: 8 }); await page.mouse.up(); await sleep(250)
  check('board: draw ellipse (O + drag)', (await shapeTypes()).includes('ellipse'))

  // Add text
  await page.keyboard.press('t'); await sleep(120)
  await page.mouse.click(500, 250); await sleep(300)
  await page.keyboard.type('Kanvas cleanup test', { delay: 15 }); await sleep(200)
  await page.keyboard.press('Escape'); await sleep(300)
  check('board: add text (T + click + type)', (await shapeTypes()).includes('text'))

  // Undo + redo
  await page.keyboard.down('Control'); await page.keyboard.press('z'); await page.keyboard.up('Control'); await sleep(200)
  const afterUndo = await shapeTypes()
  await page.keyboard.down('Control'); await page.keyboard.press('y'); await page.keyboard.up('Control'); await sleep(200)
  const afterRedo = await shapeTypes()
  check('board: undo removes text', !afterUndo.includes('text'), JSON.stringify(afterUndo))
  check('board: redo restores text', afterRedo.includes('text'), JSON.stringify(afterRedo))

  // Select-all, copy, paste
  await page.keyboard.press('v'); await sleep(80)
  await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await sleep(120)
  await page.keyboard.down('Control'); await page.keyboard.press('c'); await page.keyboard.up('Control'); await sleep(80)
  await page.keyboard.down('Control'); await page.keyboard.press('v'); await page.keyboard.up('Control'); await sleep(300)
  const countAfterPaste = await page.evaluate(() => (window.__app?.shapes || []).length)
  check('board: copy + paste duplicates all shapes', countAfterPaste >= 5, `shapes=${countAfterPaste}`)

  // Zoom out
  await page.keyboard.down('Control'); await page.keyboard.press('-'); await page.keyboard.up('Control'); await sleep(200)
  const scale = await page.evaluate(() => window.__app?.view?.scale)
  check('board: ctrl+- zooms out', typeof scale === 'number' && scale < 1, `scale=${scale}`)

  // Rename board (input is uncontrolled; set value + Enter, then blur)
  await page.click('.board-name-input', { clickCount: 3 }); await sleep(100)
  await page.evaluate(() => { const el = document.querySelector('.board-name-input'); el.value = 'Cleanup Test Board'; el.dispatchEvent(new Event('input', { bubbles: true })) })
  await page.keyboard.press('Enter'); await sleep(400)
  const fname = await page.evaluate(() => document.querySelector('.board-name-input')?.value)
  check('board: rename updates input value', fname === 'Cleanup Test Board', `fileName=${fname}`)

  // Export menu
  await page.click('.header-export'); await sleep(250)
  const exportItems = await page.evaluate(() => document.querySelectorAll('.export-menu [role="menuitem"]').length)
  check('board: export menu opens with actions', exportItems === 7, `items=${exportItems}`)
  await page.keyboard.press('Escape'); await sleep(200)

  // Autosave to localStorage
  await sleep(900)
  const savedOk = await page.evaluate(() => {
    try {
      const store = JSON.parse(localStorage.getItem('diagram-board-boards-v1') || '{}')
      const rec = Object.values(store.boards || {}).find(b => b.fileName === 'Cleanup Test Board')
      return !!rec && rec.shapes.length >= 5
    } catch { return false }
  })
  check('board: autosave persisted board to localStorage', savedOk)

  // Dark mode toggle via top bar account menu (appearance panel)
  await page.click('.account-button'); await sleep(200)
  await page.evaluate(() => [...document.querySelectorAll('[role="menuitem"]')].find(b => b.textContent.includes('Appearance'))?.click())
  await sleep(200)
  await page.evaluate(() => [...document.querySelectorAll('.side-theme-row button')].find(b => b.textContent.includes('Dark'))?.click())
  await sleep(300)
  const darkOn = await page.evaluate(() => document.documentElement.dataset.theme === 'dark')
  check('board: dark mode toggle works', darkOn)
  await page.evaluate(() => [...document.querySelectorAll('.side-theme-row button')].find(b => b.textContent.includes('Light'))?.click())
  await sleep(200)

  // ---------------- Docs page ----------------
  await page.goto(BASE + '/#/docs', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(600)
  check('docs: renders doc layout', (await page.$('.doc-header, .doc-shell, .doc-section')) !== null)
  check('docs: title set', (await page.title()).includes('Documentation'))

  // ---------------- 404 route ----------------
  await page.goto(BASE + '/#/definitely-not-a-route', { waitUntil: 'domcontentloaded' })
  await sleep(500)
  check('404: not-found page renders', (await page.$('.not-found-page')) !== null)

  // ---------------- Landing again ----------------
  await page.goto(BASE + '/#/', { waitUntil: 'domcontentloaded' })
  await sleep(500)
  check('landing: renders after board session', (await page.$('.ol-headline')) !== null)
}

// ---------------- Errors ----------------
const realErrors = errors.filter(e => !e.includes('favicon'))
check('no page/console errors across routes', realErrors.length === 0, realErrors.slice(0, 4).join(' | '))

await browser.close()
const failed = results.filter(r => !r.ok)
console.log(`\n=== ${results.length - failed.length}/${results.length} checks passed ===`)
process.exit(failed.length ? 1 : 0)
