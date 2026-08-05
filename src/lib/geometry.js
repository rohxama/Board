const isPointShape = type => ['arrow', 'line', 'pen'].includes(type)
export const SHAPE_TYPES = new Set(['rectangle', 'ellipse', 'arrow', 'line', 'pen', 'text', 'image'])

export const normalizeBox = box => {
  if (!Number.isFinite(box.width) || !Number.isFinite(box.height)) return box
  return {
    x: Math.min(box.x, box.x + box.width),
    y: Math.min(box.y, box.y + box.height),
    width: Math.abs(box.width),
    height: Math.abs(box.height),
  }
}

export const sanitizeShape = shape => {
  if (!shape || typeof shape !== 'object' || Array.isArray(shape)) throw new Error('Invalid shape')
  const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback
  const base = {
    id: String(shape.id || ''), type: shape.type, x: finite(shape.x), y: finite(shape.y),
    rotation: finite(shape.rotation), stroke: typeof shape.stroke === 'string' ? shape.stroke : '#1e293b',
    strokeWidth: Math.min(16, Math.max(1, finite(shape.strokeWidth, 2))),
    dash: ['solid', 'dashed', 'dotted'].includes(shape.dash) ? shape.dash : 'solid',
    fill: shape.fill === 'transparent' || typeof shape.fill === 'string' ? (shape.fill || 'transparent') : 'transparent',
    opacity: Math.min(1, Math.max(0, finite(shape.opacity, 1))), locked: Boolean(shape.locked),
  }
  if (isPointShape(shape.type)) {
    if (!Array.isArray(shape.points) || shape.points.length < 4 || shape.points.length > 100000 || shape.points.length % 2) throw new Error('Invalid point shape')
    const points = shape.points.map(value => { if (!Number.isFinite(value) || Math.abs(value) > 1e6) throw new Error('Invalid point value'); return value })
    return { ...base, points }
  }
  if (!['rectangle', 'ellipse', 'text', 'image'].includes(shape.type)) throw new Error('Unsupported shape type')
  if (!Number.isFinite(shape.width) || !Number.isFinite(shape.height) || shape.width <= 0 || shape.height <= 0 || shape.width > 1e6 || shape.height > 1e6) throw new Error('Invalid shape dimensions')
  const result = { ...base, ...normalizeBox({ x: base.x, y: base.y, width: shape.width, height: shape.height }) }
  if (shape.type === 'rectangle') result.cornerRadius = Math.min(1e6, Math.max(0, finite(shape.cornerRadius, 4)))
  if (shape.type === 'text') {
    if (typeof shape.text !== 'string' || shape.text.length > 100000) throw new Error('Invalid text shape')
    result.text = shape.text; result.fontSize = Math.min(256, Math.max(8, finite(shape.fontSize, 20)))
  }
  if (shape.type === 'image') {
    if (typeof shape.src !== 'string' || shape.src.length > 25 * 1024 * 1024 || !/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(shape.src)) throw new Error('Images must be embedded PNG, JPEG, or WEBP data')
    result.src = shape.src; result.flipX = Boolean(shape.flipX); result.flipY = Boolean(shape.flipY)
  }
  return result
}
