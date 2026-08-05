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
  try { value = JSON.parse(await file.text()) } catch { throw new Error('The diagram file is not valid JSON.') }
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
export function exportPNG(stage, fileName = 'diagram') {
  if (!stage) return
  const overlay = stage.findOne('.overlay')
  if (overlay) { overlay.hide(); stage.draw() }
  try {
    const url = stage.toDataURL({ pixelRatio: 2 })
    if (!url) throw new Error('The canvas could not be exported (an image may still be loading).')
    fetch(url).then(r => r.blob()).then(blob => download(blob, sanitize(fileName) + '.png')).catch(error => { console.error('PNG export failed:', error) })
  } catch (error) {
    console.error('PNG export failed:', error)
  } finally {
    if (overlay) { overlay.show(); stage.draw() }
  }
}
