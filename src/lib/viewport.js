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