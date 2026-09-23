export const MIN_SCALE = 0.25
export const MAX_SCALE = 3

export const clampScale = scale => Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale))

// Zoom so the world point `point` (in stage/container coords) stays fixed on
// screen while the scale changes. x/y are the viewport offset in screen px.
export function zoomAtPoint(point, view, nextScale) {
  return {
    scale: nextScale,
    x: point.x - (point.x - view.x) * nextScale / view.scale,
    y: point.y - (point.y - view.y) * nextScale / view.scale,
  }
}

/** Zoom keeping the visual centre of the viewport fixed. */
export function centeredZoom(view, nextScale) {
  return zoomAtPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, view, nextScale)
}

/** Compute a view that fits all shapes inside the viewport with padding. */
export function fitViewToContent(shapes, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight) {
  const list = shapes || []
  if (list.length === 0) return null
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  list.forEach(s => {
    const w = s.width || 0, h = s.height || 0
    if (s.x < minX) minX = s.x; if (s.y < minY) minY = s.y
    if (s.x + w > maxX) maxX = s.x + w; if (s.y + h > maxY) maxY = s.y + h
  })
  const padding = 40
  const contentW = maxX - minX + padding * 2, contentH = maxY - minY + padding * 2
  const scale = clampScale(Math.min(viewportWidth / contentW, viewportHeight / contentH))
  return { scale, x: viewportWidth / 2 - (minX + (maxX - minX) / 2) * scale, y: viewportHeight / 2 - (minY + (maxY - minY) / 2) * scale }
}