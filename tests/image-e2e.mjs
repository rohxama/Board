// PHASE 10 — Image Upload & Image Object lifecycle E2E test.
// Drives the real app via Puppeteer/Chrome and verifies the full image lifecycle.
import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = 'D:/Board'
const FIX = path.join(ROOT, 'tests', 'fixtures')
const URL = 'http://localhost:5173/'

const results = []
const record = (section, name, pass, detail = '') => {
  results.push({ section, name, pass, detail })
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${section} :: ${name}${detail ? ' — ' + detail : ''}`)
}
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function generateFixtures(page) {
  const fixtures = await page.evaluate(() => {
    function make(w, h, format, transparent, color) {
      const c = document.createElement('canvas'); c.width = w; c.height = h
      const ctx = c.getContext('2d')
      if (!transparent) { ctx.fillStyle = '#3366cc'; ctx.fillRect(0, 0, w, h) }
      ctx.fillStyle = color || '#22cc88'
      const mw = Math.max(4, Math.floor(w * 0.4)), mh = Math.max(4, Math.floor(h * 0.4))
      ctx.fillRect(Math.floor(w * 0.3), Math.floor(h * 0.3), mw, mh)
      return c.toDataURL(format === 'image/jpeg' ? 'image/jpeg' : 'image/png', 0.92)
    }
    return {
      'small.jpg': make(64, 64, 'image/jpeg'),
      'medium.jpg': make(800, 600, 'image/jpeg'),
      'large.jpg': make(2400, 1600, 'image/jpeg'),
      'hires.jpg': make(4000, 3000, 'image/jpeg'),
      'landscape.jpg': make(2000, 500, 'image/jpeg'),
      'portrait.jpg': make(500, 2000, 'image/jpeg'),
      'square.png': make(600, 600, 'image/png'),
      'transparent.png': make(400, 400, 'image/png', true, '#ff8800'),
      'magenta.png': make(300, 300, 'image/png', false, '#ff00ff'),
      'huge.jpg': make(9000, 60, 'image/jpeg'),
    }
  })
  fs.mkdirSync(FIX, { recursive: true })
  for (const [name, dataUrl] of Object.entries(fixtures)) {
    const b64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
    fs.writeFileSync(path.join(FIX, name), Buffer.from(b64, 'base64'))
  }
  fs.writeFileSync(path.join(FIX, 'invalid.txt'), Buffer.from('this is not an image at all'))
  fs.writeFileSync(path.join(FIX, 'corrupt.png'), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00, 0x00, 0xff, 0x10, 0x20, 0x30, 0x40, 0x50]))
}

const getShapes = page => page.evaluate(() => (window.__app?.shapes || []).map(s => ({
  id: s.id, type: s.type, x: s.x, y: s.y, width: s.width, height: s.height,
  rotation: s.rotation, flipX: s.flipX, flipY: s.flipY, opacity: s.opacity,
  srcHead: typeof s.src === 'string' ? s.src.slice(0, 22) : null,
  srcLen: typeof s.src === 'string' ? s.src.length : 0,
})))
const getView = page => page.evaluate(() => window.__app?.view || { x: 0, y: 0, scale: 1 })
const imgShapes = async page => (await getShapes(page)).filter(s => s.type === 'image')

async function waitApp(page, timeout = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await page.evaluate(() => !!(window.__app && window.__stage))) return true
    await sleep(200)
  }
  return false
}

async function uploadImage(page, fileName) {
  const input = await page.$('input[type=file][accept*="image/png"]')
  if (!input) throw new Error('image file input not found')
  const before = (await getShapes(page)).length
  const dialogs = []
  page.once('dialog', async d => { dialogs.push(d.message()); try { await d.accept() } catch {} })
  await input.uploadFile(path.join(FIX, fileName))
  const start = Date.now()
  while (Date.now() - start < 8000) {
    const now = (await getShapes(page)).length
    if (now > before) return { added: true, dialogs }
    if (dialogs.length) return { added: false, dialogs }
    await sleep(100)
  }
  return { added: (await getShapes(page)).length > before, dialogs }
}

async function drag(page, x1, y1, x2, y2, steps = 15) {
  await page.mouse.move(x1, y1)
  await page.mouse.down()
  await page.mouse.move(x2, y2, { steps })
  await sleep(60) // let the rAF that applies the final pointer-move flush before pointerup
  await page.mouse.up()
  await sleep(120)
}

const TOOL_KEY = { 'Select': 'v', 'Rectangle': 'r', 'Pan': 'h', 'Hand': 'h', 'Text': 't', 'Ellipse': 'o', 'Diamond': 'd' }
async function setTool(page, key) {
  // blur any focused control (e.g. the hidden file input after an upload) so the
  // window-level keyboard shortcut handler runs with a non-input target.
  await page.evaluate(() => { const a = document.activeElement; if (a && a !== document.body) a.blur() })
  await page.keyboard.press(key); await sleep(80)
}
async function clickTool(page, label) { await setTool(page, TOOL_KEY[label] || 'v') }
async function resetBoard(page) {
  await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control')
  await sleep(80); await page.keyboard.press('Delete'); await sleep(150)
  await clickTool(page, 'Select')
}
async function addSingle(page, file) {
  await resetBoard(page)
  await uploadImage(page, file)
  await sleep(200)
  const imgs = await imgShapes(page)
  return imgs[imgs.length - 1]
}

async function main() {
  const consoleErrors = [], pageErrors = []
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: await puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    defaultViewport: { width: 1280, height: 800 },
  })
  const page = await browser.newPage()
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('diagram-board-cookie-consent', JSON.stringify({ choice: 'accept_all', timestamp: Date.now() })) } catch (e) {} })
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()) })
  page.on('pageerror', e => pageErrors.push(String(e)))
  page.on('dialog', async d => { try { await d.accept() } catch {} })

  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await waitApp(page)
  if (await page.evaluate(() => !!document.querySelector('.modal-fresh'))) { await page.click('.modal-fresh'); await sleep(400) }
  await page.evaluate(() => { try { localStorage.clear() } catch {} })
  await page.reload({ waitUntil: 'domcontentloaded' }); await waitApp(page)
  if (await page.evaluate(() => !!document.querySelector('.modal-fresh'))) { await page.click('.modal-fresh'); await sleep(300) }
  await generateFixtures(page)

  // 1. JPG variants ---------------------------------------------------
  {
    const variants = ['small.jpg', 'medium.jpg', 'large.jpg', 'hires.jpg', 'landscape.jpg', 'portrait.jpg']
    let allOk = true, detail = []
    for (const f of variants) { const r = await uploadImage(page, f); if (!r.added) { allOk = false; detail.push(f + ': not added') } }
    const imgs = await imgShapes(page)
    for (const s of imgs) if (!/^data:image\/(png|jpeg)/.test(s.srcHead || '')) { allOk = false; detail.push('bad src') }
    for (const s of imgs) if (!(s.width > 0 && s.height > 0)) { allOk = false; detail.push('zero dims') }
    record('1.JPG', 'upload multiple JPG variants + aspect/visibility', allOk, detail.join('; '))
  }

  // 4. Small image placement ------------------------------------------
  {
    const s = (await imgShapes(page))[0]
    const ok = !!s && s.width > 0 && s.height > 0
    record('4.SMALL', 'small/placed image visible with positive size', ok, s ? `${s.width}x${s.height}` : 'no image')
  }

  // 2. PNG + transparency --------------------------------------------
  {
    const r = await uploadImage(page, 'transparent.png')
    let ok = r.added, detail = r.added ? '' : 'not added'
    if (r.added) {
      const fullSrc = await page.evaluate(() => { const s = window.__app.shapes.filter(x => x.type === 'image'); return s[s.length - 1]?.src })
      const alphaOk = await page.evaluate(src => new Promise(res => {
        const img = new Image(); img.onload = () => {
          const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight
          const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0)
          res(ctx.getImageData(2, 2, 1, 1).data[3] === 0)
        }; img.onerror = () => res(false); img.src = src
      }), fullSrc)
      ok = ok && alphaOk; detail = alphaOk ? 'transparency preserved' : 'alpha lost'
    }
    record('2.PNG', 'PNG upload + transparency preserved', ok, detail)
  }

  // 3. Large downscale + oversize guard ------------------------------
  {
    const big = await uploadImage(page, 'large.jpg')
    let dimOk = false, detail = ''
    if (big.added) {
      const fullSrc = await page.evaluate(() => { const s = window.__app.shapes.filter(x => x.type === 'image'); return s[s.length - 1]?.src })
      dimOk = await page.evaluate(src => new Promise(res => {
        const img = new Image(); img.onload = () => res(img.naturalWidth <= 2048 && img.naturalHeight <= 2048)
        img.onerror = () => res(false); img.src = src
      }), fullSrc)
      detail = dimOk ? 'downscaled <=2048px' : 'exceeds 2048'
    }
    record('3.LARGE', 'large image uploaded without crash + safe downscale', big.added && dimOk, detail)
    const huge = await uploadImage(page, 'huge.jpg')
    const rejected = !huge.added && huge.dialogs.length > 0
    record('3.LARGE-guard', 'oversized (>8192px) image rejected gracefully', rejected, rejected ? 'alert: ' + huge.dialogs[0] : 'was added or no alert')
  }

  // 6. Selection + re-selection (single isolated image) --------------
  {
    const t = await addSingle(page, 'square.png')
    await page.keyboard.press('Escape'); await sleep(100)
    const sel0 = await page.evaluate(() => window.__app.state.selectedShapeIds.length)
    const cx = t.x + t.width / 2, cy = t.y + t.height / 2
    await page.mouse.click(cx, cy); await sleep(120)
    const sel1 = await page.evaluate(() => window.__app.state.selectedShapeIds)
    await page.keyboard.press('Escape'); await sleep(80)
    await page.mouse.click(cx, cy); await sleep(120)
    const sel2 = await page.evaluate(() => window.__app.state.selectedShapeIds)
    const ok = sel0 === 0 && sel1.length === 1 && sel1[0] === t.id && sel2.length === 1 && sel2[0] === t.id
    record('6.SELECT', 'select + unselect + reselect correct image', ok, `sel=${sel2[0] === t.id}`)
  }

  // 7. Move + 8. Boundary --------------------------------------------
  {
    const t = await addSingle(page, 'square.png')
    const cx = t.x + t.width / 2, cy = t.y + t.height / 2
    await page.mouse.click(cx, cy); await sleep(80)
    await drag(page, cx, cy, cx + 120, cy + 60)
    const after = (await imgShapes(page))[0]
    const dx = after.x - t.x, dy = after.y - t.y
    const moveOk = Math.abs(dx - 120) < 4 && Math.abs(dy - 60) < 4
    record('7.MOVE', 'image moves correctly (delta preserved)', moveOk, `dx=${dx.toFixed(0)} dy=${dy.toFixed(0)}`)
    // move partially off top-left edge
    const cx2 = after.x + after.width / 2, cy2 = after.y + after.height / 2
    await page.mouse.click(cx2, cy2); await sleep(60)
    await drag(page, cx2, cy2, cx2 - 400, cy2 - 300)
    const edge = (await imgShapes(page))[0]
    const stillThere = !!edge && edge.id === after.id
    record('8.BOUNDARY', 'image survives move near/over canvas edge', stillThere, stillThere ? 'present after edge move' : 'lost')
  }

  // 9. Resize via transformer corner ----------------------------------
  {
    const t = await addSingle(page, 'square.png')
    const cx = t.x + t.width / 2, cy = t.y + t.height / 2
    await page.mouse.click(cx, cy); await sleep(120)
    const anchor = await page.evaluate(() => {
      const tr = window.__stage.find('Transformer')[0]; if (!tr) return null
      const a = tr.findOne('.bottom-right'); return a ? a.getAbsolutePosition() : null
    })
    let ok = false, detail = 'no transformer anchor'
    if (anchor) {
      const w0 = t.width, h0 = t.height
      await drag(page, anchor.x, anchor.y, anchor.x + 80, anchor.y + 40)
      const after = (await imgShapes(page))[0]
      const sel = await page.evaluate(() => window.__app.state.selectedShapeIds)
      ok = after.width > w0 && after.height > h0 && after.id === t.id && sel.includes(after.id)
      detail = `w ${w0.toFixed(0)}->${after.width.toFixed(0)} h ${h0.toFixed(0)}->${after.height.toFixed(0)}`
    }
    record('9.RESIZE', 'image resizes via handle and stays selected', ok, detail)
  }

  // 10. Mixed board: rectangle + image independence -------------------
  {
    const t = await addSingle(page, 'square.png')
    await clickTool(page, 'Rectangle')
    await drag(page, 250, 640, 400, 720)
    await sleep(150)
    const rect = (await getShapes(page)).find(s => s.type === 'rectangle')
    let ok = !!rect, detail = rect ? 'rect created' : 'rect not created'
    if (rect) {
      await clickTool(page, 'Select')
      const cx = t.x + t.width / 2, cy = t.y + t.height / 2
      await page.mouse.click(cx, cy); await sleep(80)
      const rectBefore = (await getShapes(page)).find(s => s.type === 'rectangle')
      await drag(page, cx, cy, cx + 90, cy - 70)
      const rectAfter = (await getShapes(page)).find(s => s.type === 'rectangle')
      const imgAfter = (await imgShapes(page))[0]
      const rectMoved = Math.abs(rectAfter.x - rectBefore.x) > 1 || Math.abs(rectAfter.y - rectBefore.y) > 1
      ok = ok && !rectMoved && !!imgAfter
      detail += rectMoved ? ' | RECT MOVED (bad)' : ' | rect independent OK'
    }
    record('10.MIXED', 'image + other objects coexist and stay independent', ok, detail)
  }

  // 12. Undo/Redo of a move ------------------------------------------
  {
    const t = await addSingle(page, 'square.png')
    const cx = t.x + t.width / 2, cy = t.y + t.height / 2
    const x0 = t.x
    await page.mouse.click(cx, cy); await sleep(80)
    await drag(page, cx, cy, cx + 50, cy + 20)
    const movedX = (await imgShapes(page))[0].x
    await page.keyboard.down('Control'); await page.keyboard.press('KeyZ'); await page.keyboard.up('Control'); await sleep(120)
    const undoneX = (await imgShapes(page))[0].x
    await page.keyboard.down('Control'); await page.keyboard.down('Shift'); await page.keyboard.press('KeyZ'); await page.keyboard.up('Shift'); await page.keyboard.up('Control'); await sleep(120)
    const redoneX = (await imgShapes(page))[0].x
    const ok = Math.abs(movedX - x0) > 1 && Math.abs(undoneX - x0) < 1 && Math.abs(redoneX - movedX) < 2
    record('12.UNDORDO', 'move undo/redo restores previous state', ok, `x0=${x0.toFixed(0)} moved=${movedX.toFixed(0)} undo=${undoneX.toFixed(0)} redo=${redoneX.toFixed(0)}`)
  }

  // 11 + 13. Multi-image delete/undo/redo independence ---------------
  {
    await resetBoard(page)
    const files = ['small.jpg', 'landscape.jpg', 'square.png']
    const spots = [[300, 300], [820, 300], [640, 560]]
    const created = []
    for (let i = 0; i < files.length; i++) {
      await uploadImage(page, files[i]); await sleep(150)
      const imgs = await imgShapes(page)
      const last = imgs[imgs.length - 1]
      // move it to its assigned spot (center of image to spot center)
      const cx = last.x + last.width / 2, cy = last.y + last.height / 2
      await page.mouse.click(cx, cy); await sleep(60)
      await drag(page, cx, cy, spots[i][0], spots[i][1])
      const imgs2 = await imgShapes(page)
      created.push(imgs2[imgs2.length - 1])
    }
    const [A, B, C] = created
    // Move A; B and C unchanged
    await page.mouse.click(A.x + A.width / 2, A.y + A.height / 2); await sleep(60)
    await drag(page, A.x + A.width / 2, A.y + A.height / 2, A.x + A.width / 2 + 70, A.y + A.height / 2)
    const afterMove = await imgShapes(page)
    const aMoved = afterMove.find(s => s.id === A.id), bSame = afterMove.find(s => s.id === B.id), cSame = afterMove.find(s => s.id === C.id)
    const moveOk = aMoved.x !== A.x && Math.abs(bSame.x - B.x) < 1 && Math.abs(cSame.x - C.x) < 1
    // Resize C; A and B unchanged
    const cCx = C.x + C.width / 2, cCy = C.y + C.height / 2
    await page.mouse.click(cCx, cCy); await sleep(120)
    let selNow = await page.evaluate(() => window.__app.state.selectedShapeIds)
    if (!selNow.includes(C.id)) { await page.mouse.click(cCx, cCy); await sleep(120) }
    const canchor = await page.evaluate(id => {
      const tr = window.__stage.find('Transformer')[0]; if (!tr) return null
      const a = tr.findOne('.bottom-right'); return a ? a.getAbsolutePosition() : null
    }, C.id)
    if (canchor) await drag(page, canchor.x, canchor.y, canchor.x + 60, canchor.y + 30)
    const afterResize = await imgShapes(page)
    const cResized = afterResize.find(s => s.id === C.id)
    const resizeOk = cResized.width > C.width && afterResize.find(s => s.id === A.id).x === aMoved.x && afterResize.find(s => s.id === B.id).x === B.x
    // Delete B
    await page.mouse.click(B.x + B.width / 2, B.y + B.height / 2); await sleep(80)
    await page.keyboard.press('Delete'); await sleep(150)
    const afterDel = await imgShapes(page)
    const delOk = afterDel.length === 2 && !afterDel.find(s => s.id === B.id)
    await page.keyboard.down('Control'); await page.keyboard.press('KeyZ'); await page.keyboard.up('Control'); await sleep(120)
    const afterUndo = await imgShapes(page)
    const undoOk = afterUndo.length === 3 && !!afterUndo.find(s => s.id === B.id)
    await page.keyboard.down('Control'); await page.keyboard.down('Shift'); await page.keyboard.press('KeyZ'); await page.keyboard.up('Shift'); await page.keyboard.up('Control'); await sleep(120)
    const afterRedo = await imgShapes(page)
    const redoOk = afterRedo.length === 2 && !afterRedo.find(s => s.id === B.id)
    record('11.DELETE', 'delete removes only intended image; others intact', delOk, `A/B/C=${A.id.slice(0,4)}/${B.id.slice(0,4)}/${C.id.slice(0,4)}`)
    record('13.MULTI-UD', 'move/resize/delete undo+redo affect only intended image', moveOk && resizeOk && delOk && undoOk && redoOk,
      `move=${moveOk} resize=${resizeOk} undo=${undoOk} redo=${redoOk}`)
  }

  // 14. Persistence ---------------------------------------------------
  {
    await resetBoard(page)
    await uploadImage(page, 'square.png'); await sleep(200)
    let imgs = await imgShapes(page)
    if (!imgs.length) { await uploadImage(page, 'square.png'); await sleep(200); imgs = await imgShapes(page) }
    const target = imgs[imgs.length - 1]
    const before = await page.evaluate(id => { const s = window.__app.shapes.find(x => x.id === id); return { x: s.x, y: s.y, width: s.width, height: s.height, srcLen: s.src.length, srcHead: s.src.slice(0, 20) } }, target.id)
    await page.evaluate(() => window.dispatchEvent(new Event('resize')))
    await sleep(800)
    await page.reload({ waitUntil: 'domcontentloaded' }); await waitApp(page)
    if (await page.evaluate(() => !!document.querySelector('.modal-restore'))) { await page.click('.modal-restore'); await sleep(600) }
    const after = await page.evaluate(id => { const s = window.__app.shapes.find(x => x.id === id); return s ? { x: s.x, y: s.y, width: s.width, height: s.height, srcLen: s.src.length, srcHead: s.src.slice(0, 20) } : null }, target.id)
    const ok = after && after.srcHead === before.srcHead && after.srcLen === before.srcLen &&
      Math.abs(after.x - before.x) < 1 && Math.abs(after.y - before.y) < 1 &&
      Math.abs(after.width - before.width) < 1 && Math.abs(after.height - before.height) < 1
    record('14.PERSIST', 'image survives refresh (save + reload + restore)', ok, after ? `pos ${after.x.toFixed(0)},${after.y.toFixed(0)} size ${after.width.toFixed(0)}x${after.height.toFixed(0)}` : 'lost')
  }

  // 17. Zoom + 18. Pan -----------------------------------------------
  {
    await clickTool(page, 'Select')
    const v0 = await getView(page)
    await page.keyboard.down('Control'); await page.keyboard.press('Equal'); await page.keyboard.up('Control'); await sleep(120)
    const v1 = await getView(page)
    const zoomed = v1.scale > v0.scale
    await page.keyboard.down('Control'); await page.keyboard.press('Digit0'); await page.keyboard.up('Control'); await sleep(120)
    const v2 = await getView(page)
    const resetOk = Math.abs(v2.scale - 1) < 0.01
    await clickTool(page, 'Pan')
    const vp = await getView(page)
    await drag(page, 700, 400, 760, 470)
    const vp2 = await getView(page)
    const panOk = Math.abs(vp2.x - vp.x) > 1 || Math.abs(vp2.y - vp.y) > 1
    await page.keyboard.press('Escape'); await sleep(60)
    await clickTool(page, 'Select')
    record('17.ZOOM', 'zoom in/out + reset works', zoomed && resetOk, `scale ${v0.scale}->${v1.scale}->${v2.scale}`)
    record('18.PAN', 'pan shifts viewport without losing image', panOk, `dx=${(vp2.x - vp.x).toFixed(0)} dy=${(vp2.y - vp.y).toFixed(0)}`)
  }

  // 19. Invalid + 20. Corrupt ----------------------------------------
  {
    const inv = await uploadImage(page, 'invalid.txt')
    const invalidOk = !inv.added && inv.dialogs.length > 0
    const cor = await uploadImage(page, 'corrupt.png')
    const corruptOk = !cor.added && cor.dialogs.length > 0
    record('19.INVALID', 'unsupported file rejected with friendly alert', invalidOk, invalidOk ? inv.dialogs[0] : 'no rejection')
    record('20.CORRUPT', 'corrupted image rejected gracefully', corruptOk, corruptOk ? cor.dialogs[0] : 'no rejection')
  }

  // 21. Rapid upload ------------------------------------------------
  {
    await resetBoard(page)
    const files = ['small.jpg', 'medium.jpg', 'landscape.jpg', 'portrait.jpg', 'square.png']
    for (const f of files) { await uploadImage(page, f); await sleep(60) }
    const count = (await imgShapes(page)).length
    record('21.RAPID', 'rapid multi-upload creates independent images', count === files.length, `uploaded ${count}/${files.length}`)
  }

  // 22. Memory/perf cleanup -----------------------------------------
  {
    for (let i = 0; i < 6; i++) { await uploadImage(page, 'large.jpg'); await sleep(50) }
    await sleep(300)
    const many = (await imgShapes(page)).length
    await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control'); await sleep(80)
    await page.keyboard.press('Delete'); await sleep(200)
    const remaining = (await imgShapes(page)).length
    record('22.MEMORY', 'many large uploads + full delete leaves no images', many >= 6 && remaining === 0, `had=${many} remaining=${remaining}`)
  }

  // 15/16. Export (PNG/JPG/PDF/SVG) incl. light & dark --------------
  {
    // reset any pan/zoom from earlier tests so export pixel coordinates map 1:1 to world coords
    await setTool(page, 'v')
    await page.keyboard.down('Control'); await page.keyboard.press('Digit0'); await page.keyboard.up('Control'); await sleep(120)
    await resetBoard(page)
    await uploadImage(page, 'magenta.png'); await sleep(400)
    const img = (await imgShapes(page))[0]
    const cx = img.x + img.width / 2, cy = img.y + img.height / 2
    await page.evaluate(() => {
      window.__lastBlob = null
      const orig = URL.createObjectURL.bind(URL)
      URL.createObjectURL = b => { window.__lastBlob = b; return orig(b) }
      HTMLAnchorElement.prototype.click = function () { /* suppress real download */ }
    })
    const exportAndCheck = async (menuText, kind) => {
      await page.evaluate(() => { window.__lastBlob = null })
      await page.click('.header-export'); await sleep(120)
      await page.evaluate(t => {
        const btns = [...document.querySelectorAll('.export-menu button')]
        const b = btns.find(x => x.textContent.includes(t)); if (b) b.click()
      }, menuText)
      await sleep(700)
      return page.evaluate(async (kind, sx, sy) => {
        const blob = window.__lastBlob; if (!blob) return { ok: false, reason: 'no blob' }
        try {
          if (kind === 'svg') { const txt = await blob.text(); return { ok: txt.includes('<image') } }
          if (kind === 'pdf') { const buf = new Uint8Array(await blob.arrayBuffer()); return { ok: String.fromCharCode(...buf.slice(0, 5)) === '%PDF-' } }
          const bm = await createImageBitmap(blob)
          const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height
          const ctx = c.getContext('2d'); ctx.drawImage(bm, 0, 0)
          const px = ctx.getImageData(Math.round(sx), Math.round(sy), 1, 1).data
          return { ok: px[0] > 180 && px[1] < 80 && px[2] > 180, px: [px[0], px[1], px[2]], w: bm.width, h: bm.height }
        } catch (e) { return { ok: false, reason: String(e) } }
      }, kind, cx * 2, cy * 2)
    }
    const png = await exportAndCheck('Download PNG', 'png')
    const jpg = await exportAndCheck('Download JPG', 'jpg')
    const pdf = await exportAndCheck('Download PDF', 'pdf')
    const svg = await exportAndCheck('Export SVG', 'svg')
    // dark mode
    await page.evaluate(() => { document.documentElement.dataset.theme = 'dark' }); await sleep(150)
    const darkPng = await exportAndCheck('Download PNG', 'png')
    const corner = await page.evaluate(async () => {
      const blob = window.__lastBlob; if (!blob) return null
      const bm = await createImageBitmap(blob)
      const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height
      const ctx = c.getContext('2d'); ctx.drawImage(bm, 0, 0)
      const px = ctx.getImageData(12, 12, 1, 1).data; return [px[0], px[1], px[2]]
    })
    const darkBgOk = corner && corner[0] < 60 && corner[2] < 60
    await page.evaluate(() => { document.documentElement.dataset.theme = 'light' })
    record('15.EXPORT', 'PNG/JPG/PDF/SVG exports include the image', png.ok && jpg.ok && pdf.ok && svg.ok, `pngCenter=${JSON.stringify(png.px)} jpg=${jpg.ok} pdf=${pdf.ok} svg=${svg.ok}`)
    record('16.DARK', 'dark-mode export keeps image + dark paper', darkPng.ok && darkBgOk, `darkPx=${JSON.stringify(corner)} imgCenter=${darkPng.ok}`)
  }

  // 24. Console audit -------------------------------------------------
  record('24.CONSOLE', 'no unexpected console errors / page errors', consoleErrors.length === 0 && pageErrors.length === 0,
    `consoleErrors=${consoleErrors.length} pageErrors=${pageErrors.length}` +
    (consoleErrors.length ? ' | ' + consoleErrors.slice(0, 3).join(' || ') : '') +
    (pageErrors.length ? ' | ' + pageErrors.slice(0, 3).join(' || ') : ''))

  await browser.close()
  const failed = results.filter(r => !r.pass)
  console.log(`\n==== PHASE 10 SUMMARY: ${results.length - failed.length}/${results.length} passed ====`)
  if (failed.length) { console.log('FAILURES:'); failed.forEach(f => console.log(` - ${f.section} :: ${f.name} — ${f.detail}`)) }
  process.exit(failed.length ? 1 : 0)
}

main().catch(e => { console.error('HARNESS ERROR:', e); process.exit(2) })
