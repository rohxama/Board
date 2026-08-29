const download = (blob, filename) => { const url = URL.createObjectURL(blob); const link = Object.assign(document.createElement('a'), { href: url, download: filename }); link.style.display = 'none'; document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000) }
const sanitize = name => name.replace(/[/\\?%*:|"<>]/g, '_')
import { sanitizeShape } from './geometry'
import { newId } from './idGenerator'
import { getCanvas2DContext, readFileAsText } from './browser'
import { getThemeAwareColor, getCurrentTheme, THEME_PAPER } from './themeColors'
const MAX_IMPORT_BYTES = 25 * 1024 * 1024
const MAX_IMPORT_SHAPES = 10000
export const exportJSON = (shapes, fileName = 'diagram') => download(new Blob([JSON.stringify({ version: 1, shapes }, null, 2)], { type: 'application/json' }), sanitize(fileName) + '.json')
export async function importJSON(file) {
  if (!file) throw new Error('Choose a diagram file first.')
  if (Number.isFinite(file.size) && file.size > MAX_IMPORT_BYTES) throw new Error('Diagram files must be 25 MB or smaller.')
  let value
  try { value = JSON.parse(await file.text()) } catch (_e) { throw new Error('The diagram file is not valid JSON.') }
  if (!value || value.version !== 1 || !Array.isArray(value.shapes) || value.shapes.length > MAX_IMPORT_SHAPES) throw new Error('Unsupported or oversized diagram file')
  const ids = new Set()
  return value.shapes.map(shape => {
    const clean = sanitizeShape(shape)
    if (!/^[a-z0-9_][a-z0-9_\-]{0,127}$/i.test(clean.id) || ids.has(clean.id)) throw new Error('Diagram contains invalid or duplicate shape IDs')
    ids.add(clean.id)
    // Remap to a fresh unique id so a crafted file cannot collide with
    // ids this board will generate in the future.
    return { ...clean, id: newId() }
  })
}
const dataUrlToBlob = dataUrl => {
  const comma = dataUrl.indexOf(',')
  const header = dataUrl.slice(0, comma)
  const mime = (/^data:([^;]+);/.exec(header) || [])[1] || 'image/png'
  const binary = atob(dataUrl.slice(comma + 1))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}
export const EXPORT_BACKGROUND = '#f8fafc'
export const EXPORT_GRID_COLOR = '#cbd5e1'
export const EXPORT_GRID_SIZE = 20

// Resolve the active-theme paper colors for an export so the exported file
// matches what the user sees on the board (dark mode exports dark, etc.).
function paperTheme() {
  return THEME_PAPER[getCurrentTheme()] || THEME_PAPER.light
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

// Draw the editor's paper background (the CSS on .canvas-host that the user sees
// behind the shapes) so an exported PNG is a faithful WYSIWYG capture.
// Returns the composed canvas so every image-based export (PNG, JPG, PDF,
// clipboard, print) reuses the same capture path.
async function renderBoardCanvas(stage) {
  if (!stage) return null
  const overlay = stage.findOne('.overlay')
  if (overlay) { overlay.hide(); stage.draw() }
  try {
    const url = stage.toDataURL({ pixelRatio: 2 })
    if (!url) throw new Error('The canvas could not be exported (an image may still be loading).')
    return await withPaper(url)
  } catch (error) {
    console.error('Board render failed:', error)
    return null
  } finally {
    if (overlay) { overlay.show(); stage.draw() }
  }
}

export async function exportPNG(stage, fileName = 'diagram') {
  const canvas = await renderBoardCanvas(stage)
  if (!canvas) return
  download(dataUrlToBlob(canvas.toDataURL('image/png')), sanitize(fileName) + '.png')
}

export async function exportJPG(stage, fileName = 'diagram') {
  const canvas = await renderBoardCanvas(stage)
  if (!canvas) return
  download(dataUrlToBlob(canvas.toDataURL('image/jpeg', 0.92)), sanitize(fileName) + '.jpg')
}

async function withPaper(dataUrl) {
  const src = await loadImage(dataUrl)
  const ratio = 2
  const canvas = document.createElement('canvas')
  canvas.width = src.width
  canvas.height = src.height
  const context = getCanvas2DContext(canvas)
  if (!context) throw new Error('Canvas export is not supported by this browser.')
  const { background, grid } = paperTheme()
  // Paper fill.
  context.fillStyle = background
  context.fillRect(0, 0, canvas.width, canvas.height)
  // Dot grid (same look as .canvas-host: 20px cells, 1px dots centered in each cell).
  const step = EXPORT_GRID_SIZE * ratio
  context.fillStyle = grid
  for (let x = step / 2; x < canvas.width; x += step) {
    for (let y = step / 2; y < canvas.height; y += step) {
      context.beginPath()
      context.arc(x, y, ratio, 0, Math.PI * 2)
      context.fill()
    }
  }
  // Shapes over the paper.
  context.drawImage(src, 0, 0)
  return canvas
}

// Minimal single-page PDF with the rendered board embedded as a JPEG image.
// Written by hand (no dependency) so "Download as PDF" produces a real file.
export async function exportPDF(stage, fileName = 'diagram') {
  const canvas = await renderBoardCanvas(stage)
  if (!canvas) return
  const jpegBytes = new Uint8Array(await dataUrlToBlob(canvas.toDataURL('image/jpeg', 0.9)).arrayBuffer())
  const width = Math.round(canvas.width), height = Math.round(canvas.height)
  const content = `q ${width} 0 0 ${height} 0 0 cm /Img1 Do Q`
  const objects = [
    { id: 1, body: '<< /Type /Catalog /Pages 2 0 R >>' },
    { id: 2, body: '<< /Type /Pages /Kids [3 0 R] /Count 1 >>' },
    { id: 3, body: `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << /XObject << /Img1 4 0 R >> >> /Contents 5 0 R >>` },
    { id: 4, image: true, body: `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>` },
    { id: 5, body: `<< /Length ${content.length} >>` },
  ]
  const encoder = new TextEncoder()
  const chunks = []
  const offsets = new Array(objects.length + 1).fill(0)
  let cursor = 0
  const emit = bytes => { chunks.push(bytes); cursor += bytes.length }
  emit(encoder.encode('%PDF-1.4\n'))
  emit(new Uint8Array([0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A]))
  for (const object of objects) {
    offsets[object.id] = cursor
    emit(encoder.encode(`${object.id} 0 obj\n${object.body}\n`))
    if (object.image) {
      emit(encoder.encode('stream\n'))
      emit(jpegBytes)
      emit(encoder.encode('\nendstream\n'))
    }
    emit(encoder.encode('endobj\n'))
  }
  const xrefOffset = cursor
  let xref = 'xref\n0 6\n0000000000 65535 f \n'
  for (let i = 1; i <= 5; i++) xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  emit(encoder.encode(`${xref}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`))
  download(new Blob(chunks, { type: 'application/pdf' }), sanitize(fileName) + '.pdf')
}

// Copy the rendered board to the system clipboard as a PNG image. Returns
// false when the browser does not support image clipboard writes.
export async function copyBoardAsImage(stage) {
  const canvas = await renderBoardCanvas(stage)
  if (!canvas) return false
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
  if (!blob) return false
  try {
    if (navigator.clipboard?.write && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      return true
    }
  } catch (_e) { /* clipboard image path unavailable */ }
  return false
}

// Open the browser print dialog with the board rendered full-page.
export async function printBoard(stage, fileName = 'diagram') {
  const canvas = await renderBoardCanvas(stage)
  if (!canvas) return
  const url = canvas.toDataURL('image/png')
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${svgEscape(fileName)}</title><style>@page{margin:0}html,body{margin:0;padding:0;background:#fff}img{display:block;width:100%;height:auto}</style></head><body><img alt="" src="${url}"></body></html>`)
  win.document.close()
  win.focus()
  let printed = false
  const doPrint = () => { if (!printed) { printed = true; win.print() } }
  const poll = () => { if (win.document.images[0]?.complete && win.document.images[0].naturalWidth) doPrint(); else window.setTimeout(poll, 150) }
  window.setTimeout(poll, 100)
}

const svgNumber = value => Number.isFinite(value) ? Number(value.toFixed(3)) : 0
const svgEscape = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
const svgPaint = value => value === 'transparent' || !value ? 'none' : svgEscape(value)
const svgDash = dash => dash === 'dashed' ? '10 6' : dash === 'dotted' ? '2 6' : ''
const svgPoints = points => { const values = Array.isArray(points) ? points : []; const result = []; for (let i = 0; i + 1 < values.length; i += 2) result.push(`${svgNumber(values[i])},${svgNumber(values[i + 1])}`); return result.join(' ') }

function svgBounds(shape) {
  if (Array.isArray(shape.points) && shape.points.length >= 2) {
    const xs = [], ys = []
    for (let i = 0; i + 1 < shape.points.length; i += 2) { xs.push(shape.x + shape.points[i]); ys.push(shape.y + shape.points[i + 1]) }
    return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) }
  }
  return { minX: shape.x, minY: shape.y, maxX: shape.x + (shape.width || 0), maxY: shape.y + (shape.height || 0) }
}

function svgGroupTransform(shape) {
  const rotation = svgNumber(shape.rotation || 0)
  if (!rotation) return ''
  const bounds = svgBounds(shape)
  const cx = (bounds.minX + bounds.maxX) / 2, cy = (bounds.minY + bounds.maxY) / 2
  return ` transform="rotate(${rotation} ${svgNumber(cx)} ${svgNumber(cy)})"`
}

function svgShape(shape) {
  const theme = getCurrentTheme()
  const stroke = svgPaint(getThemeAwareColor(shape.stroke, theme))
  const fill = svgPaint(getThemeAwareColor(shape.fill, theme))
  const strokeWidth = svgNumber(shape.strokeWidth || 1)
  const dash = svgDash(shape.dash)
  const common = `stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${svgNumber(shape.opacity ?? 1)}"${dash ? ` stroke-dasharray="${dash}"` : ''}`
  const x = svgNumber(shape.x), y = svgNumber(shape.y), width = svgNumber(shape.width), height = svgNumber(shape.height)
  const group = `<g${svgGroupTransform(shape)}>`
  if (shape.type === 'rectangle') return `${group}<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${svgNumber(shape.cornerRadius || 0)}" fill="${fill}" ${common}/></g>`
  if (shape.type === 'ellipse') return `${group}<ellipse cx="${svgNumber(shape.x + shape.width / 2)}" cy="${svgNumber(shape.y + shape.height / 2)}" rx="${svgNumber(shape.width / 2)}" ry="${svgNumber(shape.height / 2)}" fill="${fill}" ${common}/></g>`
  if (shape.type === 'diamond') return `${group}<polygon points="${svgPoints([shape.width / 2, 0, shape.width, shape.height / 2, shape.width / 2, shape.height, 0, shape.height / 2].map((value, index) => value + (index % 2 ? shape.y : shape.x)))}" fill="${fill}" ${common}/></g>`
  if (shape.type === 'line') return `${group}<line x1="${x + svgNumber(shape.points?.[0])}" y1="${y + svgNumber(shape.points?.[1])}" x2="${x + svgNumber(shape.points?.[2])}" y2="${y + svgNumber(shape.points?.[3])}" fill="none" ${common}/></g>`
  if (shape.type === 'arrow') return `${group}<line x1="${x + svgNumber(shape.points?.[0])}" y1="${y + svgNumber(shape.points?.[1])}" x2="${x + svgNumber(shape.points?.[2])}" y2="${y + svgNumber(shape.points?.[3])}" fill="none" marker-end="url(#diagram-arrow)" ${common}/></g>`
  if (shape.type === 'pen') return `${group}<polyline points="${svgPoints(shape.points?.map((value, index) => value + (index % 2 ? shape.y : shape.x)))}" fill="none" ${common}/></g>`
  if (shape.type === 'text') {
    const fontSize = svgNumber(shape.fontSize || 20), lineHeight = fontSize * 1.25
    const lines = String(shape.text || '').split('\n')
    const tspans = lines.map((line, index) => `<tspan x="${x}" dy="${index ? lineHeight : 0}">${svgEscape(line)}</tspan>`).join('')
    return `${group}<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${fontSize}" fill="${stroke}" opacity="${svgNumber(shape.opacity ?? 1)}" dominant-baseline="hanging">${tspans}</text></g>`
  }
  if (shape.type === 'image' && typeof shape.src === 'string') {
    const flipX = shape.flipX ? -1 : 1, flipY = shape.flipY ? -1 : 1
    const transform = flipX < 0 || flipY < 0 ? ` transform="translate(${shape.flipX ? 2 * x + width : 0} ${shape.flipY ? 2 * y + height : 0}) scale(${flipX} ${flipY})"` : ''
    return `${group}<image href="${svgEscape(shape.src)}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="none" opacity="${svgNumber(shape.opacity ?? 1)}"${transform}/></g>`
  }
  return ''
}

export const exportSVG = (shapes, fileName = 'diagram') => {
  const items = Array.isArray(shapes) ? shapes.filter(Boolean) : []
  const bounds = items.reduce((result, shape) => { const box = svgBounds(shape); return { minX: Math.min(result.minX, box.minX), minY: Math.min(result.minY, box.minY), maxX: Math.max(result.maxX, box.maxX), maxY: Math.max(result.maxY, box.maxY) } }, { minX: 0, minY: 0, maxX: 1, maxY: 1 })
  const padding = 40, viewX = bounds.minX - padding, viewY = bounds.minY - padding, viewWidth = Math.max(1, bounds.maxX - bounds.minX + padding * 2), viewHeight = Math.max(1, bounds.maxY - bounds.minY + padding * 2)
  const { background, grid } = paperTheme()
  const gridId = 'diagram-grid', arrowId = 'diagram-arrow'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${svgNumber(viewX)} ${svgNumber(viewY)} ${svgNumber(viewWidth)} ${svgNumber(viewHeight)}" width="${svgNumber(viewWidth)}" height="${svgNumber(viewHeight)}"><defs><pattern id="${gridId}" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="${svgEscape(grid)}"/></pattern><marker id="${arrowId}" markerWidth="10" markerHeight="10" refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,3.5 L0,7 z" fill="context-stroke"/></marker></defs><rect x="${svgNumber(viewX)}" y="${svgNumber(viewY)}" width="${svgNumber(viewWidth)}" height="${svgNumber(viewHeight)}" fill="${svgEscape(background)}"/><rect x="${svgNumber(viewX)}" y="${svgNumber(viewY)}" width="${svgNumber(viewWidth)}" height="${svgNumber(viewHeight)}" fill="url(#${gridId})"/>${items.map(svgShape).join('')}</svg>`
  download(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), sanitize(fileName) + '.svg')
}
