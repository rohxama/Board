const download = (blob, filename) => { const url = URL.createObjectURL(blob); const link = Object.assign(document.createElement('a'), { href: url, download: filename }); link.click(); URL.revokeObjectURL(url) }
const sanitize = name => name.replace(/[/\\?%*:|"<>]/g, '_')
import { sanitizeShape } from './geometry'
export const exportJSON = (shapes, fileName = 'diagram') => download(new Blob([JSON.stringify({ version: 1, shapes }, null, 2)], { type: 'application/json' }), sanitize(fileName) + '.json')
export async function importJSON(file) { const value = JSON.parse(await file.text()); if (value.version !== 1 || !Array.isArray(value.shapes)) throw new Error('Unsupported diagram file'); return value.shapes.map(sanitizeShape) }
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
