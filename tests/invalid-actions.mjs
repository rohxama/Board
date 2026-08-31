// Task 26 — Invalid Action Test (Golden Rule).
// Invalid actions must NEVER crash or show technical errors; they must show a
// clear, user-friendly message. Covers: invalid uploads, empty text, unsupported
// imports, empty exports, and repeated clicks.
import puppeteer from 'puppeteer-core'
import { spawn } from 'child_process'
import fs from 'node:fs'
import path from 'node:path'

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
const URL = 'http://localhost:5173/'
const ROOT = 'D:/Board'
const VITE = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
const sleep = ms => new Promise(r => setTimeout(r, ms))

const results = []
const record = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`)
}
const isFriendly = (m) => {
  if (!m) return false
  if (m.length > 220) return false
  return !/(TypeError|ReferenceError|SyntaxError|is not a function|Cannot read|undefined is not|null is not|at [a-zA-Z_.]+\([^)]*:\d+:\d+\)|raven|chunk)/.test(m)
}

const server = spawn(process.execPath, [VITE, '--port', '5173', '--strictPort'], { cwd: ROOT, stdio: 'ignore', detached: true })
let browser
try {
  for (let i = 0; i < 60; i++) { try { const r = await fetch(URL); if (r.ok) break } catch {}; await sleep(300) }

  browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--window-size=1200,800', '--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  const pageErrors = []
  page.on('pageerror', e => { pageErrors.push(e.message); console.log('PAGEERROR:', e.message) })

  const installCapture = () => page.evaluate(() => {
    window.__dl = []
    const orig = URL.createObjectURL.bind(URL)
    URL.createObjectURL = blob => {
      const fr = new FileReader()
      fr.onload = () => window.__dl.push({ type: blob.type, dataUrl: fr.result })
      fr.readAsDataURL(blob)
      return orig(blob)
    }
    HTMLAnchorElement.prototype.click = function () {}
  })
  const waitReady = async () => {
    for (let i = 0; i < 200; i++) {
      const ok = await page.evaluate(() => !document.querySelector('.splash-screen') && !!window.__stage && window.__app?.shapes).catch(() => false)
      if (ok) break
      await sleep(100)
    }
    await installCapture()
  }
  const gotoFresh = async () => {
    await page.goto(URL, { waitUntil: 'networkidle0' })
    await waitReady()
    await page.evaluate(() => { try { window.localStorage.clear() } catch {} })
    await page.reload({ waitUntil: 'networkidle0' })
    await waitReady()
    await page.evaluate(() => { const t = document.querySelector('.app-toast'); if (t) t.remove() })
  }
  const getToast = async () => page.evaluate(() => { const t = document.querySelector('.app-toast'); return t ? t.textContent : '' })
  const shapes = () => page.evaluate(() => window.__app.shapes.map(s => JSON.parse(JSON.stringify(s))))
  const captureLast = async () => { await sleep(200); return page.evaluate(() => window.__dl[window.__dl.length - 1] || null) }
  const dropFile = async (name, type, bytesB64) => {
    await page.evaluate(async ({ name, type, b64 }) => {
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
      const file = new File([bytes], name, { type })
      const dt = new DataTransfer(); dt.items.add(file)
      const event = new DragEvent('drop', { bubbles: true, cancelable: true })
      Object.defineProperty(event, 'dataTransfer', { value: dt })
      const host = document.querySelector('.canvas-host')
      host.dispatchEvent(event)
    }, { name, type, b64: bytesB64 })
    await sleep(400)
  }
  const exportViaMenu = async (label) => {
    await page.click('button[title="Export board"]').catch(() => {})
    await sleep(150)
    await page.click(`button ::-p-text(${label})`).catch(() => {})
    await sleep(300)
    return captureLast()
  }

  // ---- 1. invalid image upload (wrong type) ----
  await gotoFresh()
  await dropFile('bad.txt', 'text/plain', btoa('just some text'))
  const toast1 = await getToast()
  record('invalid image upload: shows friendly message (not crash)', /Image upload failed|Use a PNG, JPG, SVG, or WEBP/.test(toast1), `toast=${toast1.slice(0, 80)}`)
  record('invalid image upload: message is user-friendly', toast1.length > 0 && isFriendly(toast1), toast1.slice(0, 80))
  record('invalid image upload: no uncaught error', pageErrors.length === 0, pageErrors.join(' | '))

  // ---- 2. corrupt image upload (valid ext, garbage bytes) ----
  await gotoFresh()
  await dropFile('broken.png', 'image/png', btoa('not really an image at all, just garbage'))
  const toast2 = await getToast()
  record('corrupt image upload: friendly message', /valid image|Image upload failed/.test(toast2), `toast=${toast2.slice(0, 80)}`)
  record('corrupt image upload: no uncaught error', pageErrors.length === 0, pageErrors.join(' | '))

  // ---- 3. invalid JSON import (malformed) ----
  await gotoFresh()
  const tmp1 = path.join(ROOT, 'tests', '.inv1.json')
  fs.writeFileSync(tmp1, '{ this is not valid json')
  await (await page.$('input[type=file][accept="application/json"]')).uploadFile(tmp1)
  await sleep(500)
  const toast3 = await getToast()
  record('invalid JSON import: friendly message', /Import Failed|not valid JSON/i.test(toast3), `toast=${toast3.slice(0, 80)}`)
  record('invalid JSON import: message user-friendly', toast3.length > 0 && isFriendly(toast3), toast3.slice(0, 80))
  record('invalid JSON import: no uncaught error', pageErrors.length === 0, pageErrors.join(' | '))

  // ---- 4. unsupported import (valid JSON, wrong shape) ----
  await gotoFresh()
  const tmp2 = path.join(ROOT, 'tests', '.inv2.json')
  fs.writeFileSync(tmp2, JSON.stringify({ foo: 1 }))
  await (await page.$('input[type=file][accept="application/json"]')).uploadFile(tmp2)
  await sleep(500)
  const toast4 = await getToast()
  record('unsupported import: friendly message', /Import Failed|Unsupported or oversized/i.test(toast4), `toast=${toast4.slice(0, 80)}`)
  record('unsupported import: no uncaught error', pageErrors.length === 0, pageErrors.join(' | '))

  // ---- 5. empty text ----
  await gotoFresh()
  await page.click('[title^="Text"]').catch(() => {})
  await sleep(150)
  await page.mouse.click(400, 400)
  await sleep(150)
  await page.keyboard.press('Escape')
  await sleep(200)
  const afterEmptyText = await shapes()
  const toast5 = await getToast()
  record('empty text: no crash / no technical error', pageErrors.length === 0, pageErrors.join(' | '))
  record('empty text: no empty text shape created', !afterEmptyText.some(s => s.type === 'text' && (!s.text || !s.text.trim())), `shapes=${afterEmptyText.map(s => s.type).join(',')}`)
  record('empty text: no dialog/error shown', toast5.length === 0, `toast=${toast5.slice(0, 80)}`)

  // ---- 6. empty exports (must produce valid files, not crash) ----
  await gotoFresh()
  let cap = await exportViaMenu('Download PNG')
  let okPng = false, pngDetail = 'no download captured'
  if (cap) {
    const b = Buffer.from(cap.dataUrl.split(',')[1], 'base64')
    okPng = cap.type === 'image/png' && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47
    pngDetail = `type=${cap.type} bytes=${b.length}`
  }
  record('empty export PNG: valid file produced', okPng, pngDetail)
  cap = await exportViaMenu('Export SVG')
  let okSvg = !!cap && /<svg/.test(Buffer.from(cap.dataUrl.split(',')[1], 'base64').toString('utf8'))
  record('empty export SVG: valid file produced', okSvg, cap ? `type=${cap.type}` : 'no download')
  cap = await exportViaMenu('Export JSON')
  let okJson = false
  if (cap) { try { const j = JSON.parse(Buffer.from(cap.dataUrl.split(',')[1], 'base64').toString('utf8')); okJson = j.version === 1 && Array.isArray(j.shapes) } catch {} }
  record('empty export JSON: valid file produced', okJson, cap ? `type=${cap.type}` : 'no download')
  record('empty exports: no uncaught error', pageErrors.length === 0, pageErrors.join(' | '))

  // ---- 7. repeated clicks (rapid) ----
  await gotoFresh()
  for (let i = 0; i < 12; i++) { await page.click('[title^="Rectangle"]').catch(() => {}); await page.click('[title^="Ellipse"]').catch(() => {}); await page.click('[title^="Arrow"]').catch(() => {}) }
  for (let i = 0; i < 8; i++) { await page.click('button[title="Export board"]').catch(() => {}); await sleep(40); await page.click('button ::-p-text(Download PNG)').catch(() => {}); await sleep(40) }
  await sleep(500)
  record('repeated clicks: no uncaught error', pageErrors.length === 0, pageErrors.join(' | '))
  record('repeated clicks: app still responsive', await page.evaluate(() => !!(window.__stage && window.__app)), '')

  // ---- summary ----
  const allToasts = []
  for (const t of [toast1, toast2, toast3, toast4, toast5]) { if (t) allToasts.push(t) }
  const unfriendly = allToasts.filter(d => !isFriendly(d))
  record('GOLDEN RULE: every message is user-friendly (no stack traces)', unfriendly.length === 0, unfriendly.join(' | '))
  record('GOLDEN RULE: no uncaught page errors across all invalid actions', pageErrors.length === 0, pageErrors.join(' | '))

  const failed = results.filter(r => !r.pass)
  console.log(`\n==== ${results.length - failed.length}/${results.length} checks passed ====`)
  if (failed.length) { console.log('FAILED:\n' + failed.map(f => `  ${f.name} — ${f.detail}`).join('\n')); process.exitCode = 1 }
} catch (e) {
  console.error('TEST HARNESS ERROR:', e.stack || e.message)
  process.exitCode = 2
} finally {
  if (browser) await browser.close()
  try { process.kill(-server.pid) } catch {}
}
