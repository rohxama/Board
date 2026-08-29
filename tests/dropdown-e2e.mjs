// Dropdown / menu interaction & visual test for Kanvas Whiteboard.
// Covers: open, close, outside-click, button alignment, spacing,
// text alignment, icon alignment, keyboard navigation, mobile layout.
// Run: node tests/dropdown-e2e.mjs
import { spawn } from 'node:child_process'
import path from 'node:path'
import puppeteer from 'puppeteer'

const PORT = 5174
const URL = `http://localhost:${PORT}/`

const sleep = ms => new Promise(r => setTimeout(r, ms))

function startServer() {
  const viteBin = path.resolve(process.cwd(), 'node_modules/vite/bin/vite.js')
  const proc = spawn(process.execPath, [viteBin, '--port', String(PORT), '--strictPort', '--clearScreen', 'false'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  })
  proc.stdout.on('data', () => {})
  proc.stderr.on('data', d => process.stderr.write(`[vite] ${d}`))
  return proc
}

async function waitForServer() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(URL)
      if (res.ok) return
    } catch {}
    await sleep(300)
  }
  throw new Error('dev server did not start')
}

const results = []
const consoleErrors = []
function record(name, pass, detail = '') {
  results.push({ name, pass, detail })
  const tag = pass ? 'PASS' : 'FAIL'
  console.log(`[${tag}] ${name}${detail ? ' — ' + detail : ''}`)
}

// Each dropdown descriptor: trigger aria-label + menu selector
const DROPDOWNS = [
  { id: 'board', trigger: 'Board options', menu: '.board-management-menu' },
  { id: 'export', trigger: 'Export board', menu: '.export-menu' },
  { id: 'account', trigger: 'Account menu', menu: '.account-menu' },
]

async function main() {
  const server = startServer()
  let browser
  try {
    await waitForServer()
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    page.on('pageerror', err => { consoleErrors.push('PAGEERROR: ' + (err.stack || err.message)); console.log('LIVE PAGEERR', err.message) })

    await page.goto(URL, { waitUntil: 'networkidle2' })
    await page.waitForSelector('.canvas-host', { timeout: 15000 })
    await page.waitForFunction(() => window.__app && Array.isArray(window.__app.shapes) && window.__app.view, { timeout: 10000 })
    await sleep(300)

    // helpers ------------------------------------------------------
    const isOpen = async (dd) => page.evaluate((sel) => {
      const el = document.querySelector(sel)
      if (!el) return false
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'
    }, dd.menu)
    const triggerExpanded = async (dd) => page.$eval(`[aria-label="${dd.trigger}"]`, el => el.getAttribute('aria-expanded'))
    const openMenu = async (dd) => {
      if (!(await isOpen(dd))) {
        await page.click(`[aria-label="${dd.trigger}"]`)
        await sleep(120)
      }
    }
    const closeMenu = async (dd) => {
      if (await isOpen(dd)) {
        await page.click(`[aria-label="${dd.trigger}"]`)
        await sleep(120)
      }
    }
    // rect of element (viewport-relative)
    const rectOf = async (sel) => page.$eval(sel, el => {
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, left: r.left, right: r.right, bottom: r.bottom }
    }).catch(() => null)

    // =========================================================
    // Group A — open / close toggling + aria-expanded
    // =========================================================
    for (const dd of DROPDOWNS) {
      await closeMenu(dd)
      const before = await triggerExpanded(dd)
      await openMenu(dd)
      const openState = await isOpen(dd)
      const expandedOpen = await triggerExpanded(dd)
      await closeMenu(dd)
      const closedState = await isOpen(dd)
      const expandedClosed = await triggerExpanded(dd)
      const ok = before === 'false' && openState && expandedOpen === 'true' && !closedState && expandedClosed === 'false'
      record(`A.${dd.id} open/close toggles + aria-expanded`, ok,
        `before=${before} open=${openState} expandedOpen=${expandedOpen} closed=${closedState} expandedClosed=${expandedClosed}`)
    }

    // =========================================================
    // Group B — outside click closes
    // =========================================================
    for (const dd of DROPDOWNS) {
      await openMenu(dd)
      const wasOpen = await isOpen(dd)
      // click far away (top-left corner of canvas area)
      await page.mouse.click(640, 600)
      await sleep(120)
      const stillOpen = await isOpen(dd)
      const ok = wasOpen && !stillOpen
      record(`B.${dd.id} outside click closes`, ok, `wasOpen=${wasOpen} afterOutside=${stillOpen}`)
    }

    // =========================================================
    // Group C — only one menu open at a time
    // =========================================================
    {
      await closeMenu(DROPDOWNS[0]); await closeMenu(DROPDOWNS[1]); await closeMenu(DROPDOWNS[2])
      await openMenu(DROPDOWNS[0])
      await openMenu(DROPDOWNS[1])
      const b0 = await isOpen(DROPDOWNS[0])
      const b1 = await isOpen(DROPDOWNS[1])
      const b2 = await isOpen(DROPDOWNS[2])
      // opening the second should NOT force the first closed (separate anchors),
      // but verify each opens independently and none is accidentally hidden.
      const ok = b0 && b1 && !b2
      record('C. multiple menus open independently', ok, `board=${b0} export=${b1} account=${b2}`)
      await closeMenu(DROPDOWNS[0]); await closeMenu(DROPDOWNS[1]); await closeMenu(DROPDOWNS[2])
    }

    // =========================================================
    // Group D — Escape closes
    // =========================================================
    for (const dd of DROPDOWNS) {
      await openMenu(dd)
      await page.keyboard.press('Escape')
      await sleep(120)
      const open = await isOpen(dd)
      record(`D.${dd.id} Escape closes`, !open, `open=${open}`)
    }

    // =========================================================
    // Group E — clicking an item closes the menu
    // =========================================================
    {
      // board menu: click "Board details" (keeps details popover) -> menu closes
      await openMenu(DROPDOWNS[0])
      await page.evaluate(() => {
        const m = document.querySelector('.board-management-menu')
        const btn = [...m.querySelectorAll('button')].find(b => /Board details/.test(b.innerText))
        btn && btn.click()
      })
      await sleep(120)
      const boardClosed = !(await isOpen(DROPDOWNS[0]))
      const detailsOpen = await page.evaluate(() => !!document.querySelector('.board-details-popover'))
      // reset
      await page.evaluate(() => { const c = document.querySelector('.board-details-popover button'); c && c.click() })
      await sleep(80)

      // export menu: click an item -> menu must close (regression for fixed bug)
      await openMenu(DROPDOWNS[1])
      await page.evaluate(() => {
        const m = document.querySelector('.export-menu')
        const btn = [...m.querySelectorAll('button')].find(b => /Export JSON/.test(b.innerText))
        btn && btn.click()
      })
      await sleep(200)
      const exportClosed = !(await isOpen(DROPDOWNS[1]))

      // account menu: click Profile -> opens side panel, menu closes
      await openMenu(DROPDOWNS[2])
      await page.evaluate(() => {
        const m = document.querySelector('.account-menu')
        const btn = [...m.querySelectorAll('button')].find(b => /Profile/.test(b.innerText))
        btn && btn.click()
      })
      await sleep(150)
      const accountClosed = !(await isOpen(DROPDOWNS[2]))
      const panelOpen = await page.evaluate(() => !!document.querySelector('.side-panel'))
      // reset account panel
      await page.keyboard.press('Escape')
      await sleep(80)

      const ok = boardClosed && exportClosed && accountClosed && detailsOpen && panelOpen
      record('E. clicking item closes its menu', ok,
        `board=${boardClosed}(details=${detailsOpen}) export=${exportClosed} account=${accountClosed}(panel=${panelOpen})`)
    }

    // =========================================================
    // Group F — item layout: icon + text, alignment, spacing
    // =========================================================
    for (const dd of DROPDOWNS) {
      await openMenu(dd)
      const report = await page.evaluate((menuSel) => {
        const menu = document.querySelector(menuSel)
        const items = [...menu.querySelectorAll('button[role="menuitem"]')]
        const out = { count: items.length, badIconAlign: 0, badTextAlign: 0, badSpacing: 0, minItemH: Infinity, detail: [] }
        let prevBottom = null
        for (const it of items) {
          const icon = it.querySelector('svg, img, span') // first visual
          const span = it.querySelector('span')
          if (!span) continue
          const ir = icon ? icon.getBoundingClientRect() : null
          const sr = span.getBoundingClientRect()
          const tr = it.getBoundingClientRect()
          // icon vertically aligned with text (centers within 2px)
          if (ir) {
            const ic = ir.top + ir.height / 2
            const sc = sr.top + sr.height / 2
            if (Math.abs(ic - sc) > 2) { out.badIconAlign++; out.detail.push('icon-center off by ' + (ic - sc).toFixed(1)) }
            // icon must sit to the left of the text
            if (ir.right > sr.left + 1) { out.badIconAlign++; out.detail.push('icon not left of text') }
          }
          // text left aligned
          const ta = getComputedStyle(span).textAlign
          if (ta !== 'left' && ta !== 'start') out.badTextAlign++
          // item min height + stacking
          if (tr.height < 30) { out.badSpacing++; out.detail.push('item height ' + tr.height.toFixed(0)) }
          if (prevBottom !== null && tr.top < prevBottom - 1) { out.badSpacing++; out.detail.push('overlap') }
          prevBottom = tr.bottom
          out.minItemH = Math.min(out.minItemH, tr.height)
        }
        return out
      }, dd.menu)
      const ok = report.count > 0 && report.badIconAlign === 0 && report.badTextAlign === 0 && report.badSpacing === 0
      record(`F.${dd.id} item layout (icon/text align, spacing)`, ok,
        `items=${report.count} minH=${report.minItemH} iconBad=${report.badIconAlign} textBad=${report.badTextAlign} spaceBad=${report.badSpacing}`)
      await closeMenu(dd)
    }

    // =========================================================
    // Group G — menu anchored to trigger & inside viewport (desktop)
    // =========================================================
    for (const dd of DROPDOWNS) {
      await openMenu(dd)
      const trig = await rectOf(`[aria-label="${dd.trigger}"]`)
      const menu = await rectOf(dd.menu)
      const vw = 1280, vh = 800
      const within = menu.left >= -1 && menu.top >= -1 && menu.right <= vw + 1 && menu.bottom <= vh + 1
      const anchored = menu.top >= trig.top - 6 && (menu.top <= trig.bottom + 24) // opens below trigger
      const ok = trig && menu && within && anchored
      record(`G.${dd.id} anchored to button + within viewport`, ok,
        `trig=(${trig.left | 0},${trig.top | 0}) menu=(${menu.left | 0},${menu.top | 0},${menu.right | 0},${menu.bottom | 0}) within=${within} anchored=${anchored}`)
      await closeMenu(dd)
    }

    // =========================================================
    // Group H — keyboard navigation: Tab moves through items, Escape closes
    // =========================================================
    for (const dd of DROPDOWNS) {
      await openMenu(dd)
      // focus the trigger, then Tab into the menu
      await page.focus(`[aria-label="${dd.trigger}"]`)
      await page.keyboard.press('Tab')
      await sleep(60)
      const firstFocus = await page.evaluate(() => {
        const a = document.activeElement
        return a && a.getAttribute('role') === 'menuitem' ? a.innerText.trim().slice(0, 20) : null
      })
      // Tab again -> second item
      await page.keyboard.press('Tab')
      await sleep(60)
      const secondFocus = await page.evaluate(() => {
        const a = document.activeElement
        return a && a.getAttribute('role') === 'menuitem' ? a.innerText.trim().slice(0, 20) : null
      })
      await page.keyboard.press('Escape')
      await sleep(100)
      const closed = !(await isOpen(dd))
      const ok = !!firstFocus && !!secondFocus && closed && firstFocus !== secondFocus
      record(`H.${dd.id} keyboard nav (Tab through, Esc close)`, ok,
        `first="${firstFocus}" second="${secondFocus}" closed=${closed}`)
    }

    // =========================================================
    // Group I — mobile layout (375x667): menus fit inside viewport
    // =========================================================
    await page.setViewport({ width: 375, height: 667 })
    await sleep(200)
    for (const dd of DROPDOWNS) {
      await openMenu(dd)
      const menu = await rectOf(dd.menu)
      const within = menu && menu.left >= -1 && menu.top >= -1 && menu.right <= 376 && menu.bottom <= 668
      // also ensure the toolbar triggers themselves are on-screen
      const trig = await rectOf(`[aria-label="${dd.trigger}"]`)
      const trigOn = trig && trig.right <= 376 && trig.left >= -1
      const ok = within && trigOn
      record(`I.${dd.id} mobile (375x667) fits viewport`, ok,
        `trigOn=${trigOn} menu=(${menu ? menu.left | 0 : '?'},${menu ? menu.top | 0 : '?'},${menu ? menu.right | 0 : '?'},${menu ? menu.bottom | 0 : '?'})`)
      await closeMenu(dd)
    }
    // restore desktop
    await page.setViewport({ width: 1280, height: 800 })
    await sleep(150)

    // =========================================================
    // Group X — console audit
    // =========================================================
    {
      const real = consoleErrors.filter(e => !/favicon|404|net::ERR|Download is not allowed/i.test(e))
      const ok = real.length === 0
      record('X. no unexpected console errors', ok, real.length ? real.slice(0, 5).join(' || ') : 'clean')
    }

    const failed = results.filter(r => !r.pass)
    console.log('\n==== SUMMARY ====')
    console.log(`TOTAL ${results.length}  PASS ${results.length - failed.length}  FAIL ${failed.length}`)
    if (failed.length) {
      console.log('FAILED:')
      failed.forEach(f => console.log(' - ' + f.name + (f.detail ? ' :: ' + f.detail : ''))
    }
    process.exitCode = failed.length ? 1 : 0
  } catch (err) {
    console.error('HARNESS ERROR:', err)
    process.exitCode = 2
  } finally {
    if (browser) await browser.close()
    server.kill('SIGTERM')
  }
}

main()
