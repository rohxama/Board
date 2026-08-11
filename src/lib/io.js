const download = (blob, filename) => { const url = URL.createObjectURL(blob); const link = Object.assign(document.createElement('a'), { href: url, download: filename }); link.style.display = 'none'; document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000) }
const sanitize = name => name.replace(/[/\\?%*:|"<>]/g, '_')
import { sanitizeShape } from './geometry'
import { newId } from './idGenerator'
const MAX_IMPORT_BYTES = 25 * 1024 * 1024
const MAX_IMPORT_SHAPES = 10000
export const exportJSON = (shapes, fileName = 'diagram') => download(new Blob([JSON.stringify({ version: 1, shapes }, null, 2)], { type: 'application/json' }), sanitize(fileName) + '.json')
export async function importJSON(file) {
  if (!file || typeof file.text !== 'function') throw new Error('Choose a diagram file first.')
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
export async function exportPNG(stage, fileName = 'diagram') {
  if (!stage) return
  const overlay = stage.findOne('.overlay')
  if (overlay) { overlay.hide(); stage.draw() }
  const restore = () => { if (overlay) { overlay.show(); stage.draw() } }
  try {
    const url = stage.toDataURL({ pixelRatio: 2 })
    if (!url) throw new Error('The canvas could not be exported (an image may still be loading).')
    const paperUrl = await withPaper(url)
    // Convert the data URL to a Blob directly. Using fetch() here would be routed
    // through the page CSP's connect-src (which omits "data:"), silently failing.
    download(dataUrlToBlob(paperUrl), sanitize(fileName) + '.png')
  } catch (error) {
    console.error('PNG export failed:', error)
  } finally {
    restore()
  }
}

async function withPaper(dataUrl) {
  const src = await loadImage(dataUrl)
  const ratio = 2
  const canvas = document.createElement('canvas')
  canvas.width = src.width
  canvas.height = src.height
  const context = canvas.getContext('2d')
  // Paper fill.
  context.fillStyle = EXPORT_BACKGROUND
  context.fillRect(0, 0, canvas.width, canvas.height)
  // Dot grid (same look as .canvas-host: 20px cells, 1px dots centered in each cell).
  const step = EXPORT_GRID_SIZE * ratio
  context.fillStyle = EXPORT_GRID_COLOR
  for (let x = step / 2; x < canvas.width; x += step) {
    for (let y = step / 2; y < canvas.height; y += step) {
      context.beginPath()
      context.arc(x, y, ratio, 0, Math.PI * 2)
      context.fill()
    }
  }
  // Shapes over the paper.
  context.drawImage(src, 0, 0)
  return canvas.toDataURL('image/png')
}
