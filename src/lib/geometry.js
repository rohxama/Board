const isPointShape = type => ['arrow', 'line', 'pen'].includes(type)
export const SHAPE_TYPES = new Set(['rectangle', 'ellipse', 'diamond', 'arrow', 'line', 'pen', 'text', 'image'])

export const normalizeBox = box => {
  if (!Number.isFinite(box.width) || !Number.isFinite(box.height)) return box
  return {
    x: Math.min(box.x, box.x + box.width),
    y: Math.min(box.y, box.y + box.height),
    width: Math.abs(box.width),
    height: Math.abs(box.height),
  }
}

const BINDING_DISTANCE = 24
const bindableShape = shape => shape && ['rectangle', 'ellipse', 'diamond'].includes(shape.type)
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

function closestSegmentPoint(point, start, end) {
  const dx = end.x - start.x, dy = end.y - start.y
  const lengthSquared = dx * dx + dy * dy
  const t = lengthSquared ? clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared, 0, 1) : 0
  return { x: start.x + dx * t, y: start.y + dy * t }
}

function closestBoundaryPoint(shape, point) {
  if (shape.type === 'rectangle') {
    const left = shape.x, right = shape.x + shape.width, top = shape.y, bottom = shape.y + shape.height
    const inside = point.x >= left && point.x <= right && point.y >= top && point.y <= bottom
    if (inside) {
      const distances = [
        { d: point.x - left, p: { x: left, y: point.y } },
        { d: right - point.x, p: { x: right, y: point.y } },
        { d: point.y - top, p: { x: point.x, y: top } },
        { d: bottom - point.y, p: { x: point.x, y: bottom } },
      ]
      return distances.reduce((best, item) => item.d < best.d ? item : best)
    }
    const p = { x: clamp(point.x, left, right), y: clamp(point.y, top, bottom) }
    return { d: distance(point, p), p }
  }
  if (shape.type === 'ellipse') {
    const cx = shape.x + shape.width / 2, cy = shape.y + shape.height / 2
    const rx = Math.max(shape.width / 2, 1), ry = Math.max(shape.height / 2, 1)
    const dx = (point.x - cx) / rx, dy = (point.y - cy) / ry, length = Math.hypot(dx, dy)
    const p = length < 1e-6 ? { x: cx, y: cy - ry } : { x: cx + dx / length * rx, y: cy + dy / length * ry }
    return { d: distance(point, p), p }
  }
  if (shape.type === 'diamond') {
    const points = [
      { x: shape.x + shape.width / 2, y: shape.y },
      { x: shape.x + shape.width, y: shape.y + shape.height / 2 },
      { x: shape.x + shape.width / 2, y: shape.y + shape.height },
      { x: shape.x, y: shape.y + shape.height / 2 },
    ]
    let best = { d: Infinity, p: points[0] }
    for (let i = 0; i < points.length; i++) {
      const p = closestSegmentPoint(point, points[i], points[(i + 1) % points.length])
      const candidate = { d: distance(point, p), p }
      if (candidate.d < best.d) best = candidate
    }
    return best
  }
  return null
}

function bindingFor(value) {
  return value && typeof value === 'object' && typeof value.shapeId === 'string' && value.shapeId ? { shapeId: value.shapeId } : null
}

export function bindArrowEndpoints(arrow, shapes, threshold = BINDING_DISTANCE) {
  if (!arrow || arrow.type !== 'arrow' || !Array.isArray(arrow.points) || arrow.points.length < 4) return arrow
  const candidates = shapes.filter(bindableShape)
  const next = { ...arrow, points: arrow.points.slice() }
  for (const [index, key] of [[0, 'startBinding'], [2, 'endBinding']]) {
    const endpoint = { x: arrow.x + arrow.points[index], y: arrow.y + arrow.points[index + 1] }
    let best = null
    for (const shape of candidates) {
      const boundary = closestBoundaryPoint(shape, endpoint)
      if (boundary && boundary.d <= threshold && (!best || boundary.d < best.boundary.d)) best = { shape, boundary }
    }
    if (best) {
      next.points[index] = best.boundary.p.x - arrow.x
      next.points[index + 1] = best.boundary.p.y - arrow.y
      next[key] = { shapeId: best.shape.id }
    } else delete next[key]
  }
  return next
}

export function updateBoundArrows(shapes) {
  const shapeMap = new Map(shapes.map(shape => [shape.id, shape]))
  return shapes.map(arrow => {
    if (!arrow || arrow.type !== 'arrow') return arrow
    const next = { ...arrow, points: arrow.points.slice() }
    let changed = false
    for (const [index, key] of [[0, 'startBinding'], [2, 'endBinding']]) {
      const binding = bindingFor(arrow[key])
      const target = binding && shapeMap.get(binding.shapeId)
      if (!target || !bindableShape(target)) {
        if (arrow[key]) { delete next[key]; changed = true }
        continue
      }
      const otherIndex = index === 0 ? 2 : 0
      const other = { x: arrow.x + arrow.points[otherIndex], y: arrow.y + arrow.points[otherIndex + 1] }
      const boundary = closestBoundaryPoint(target, other)
      if (!boundary) continue
      const x = boundary.p.x - arrow.x, y = boundary.p.y - arrow.y
      if (next.points[index] !== x || next.points[index + 1] !== y) { next.points[index] = x; next.points[index + 1] = y; changed = true }
      if (!next[key] || next[key].shapeId !== binding.shapeId) { next[key] = binding; changed = true }
    }
    return changed ? next : arrow
  })
}

export const sanitizeShape = shape => {
  if (!shape || typeof shape !== 'object' || Array.isArray(shape)) throw new Error('Invalid shape')
  const finite = (value, fallback = 0) => Number.isFinite(value) ? value : fallback
  const color = value => value === 'transparent' || (typeof value === 'string' && /^#[0-9a-f]{3,8}$/i.test(value)) ? value : null
  const base = {
    id: String(shape.id || ''), type: shape.type, x: finite(shape.x), y: finite(shape.y),
    rotation: finite(shape.rotation), stroke: color(shape.stroke) || '#1e293b',
    strokeWidth: Math.min(16, Math.max(1, finite(shape.strokeWidth, 2))),
    dash: ['solid', 'dashed', 'dotted'].includes(shape.dash) ? shape.dash : 'solid',
    fill: color(shape.fill) || 'transparent',
    opacity: Math.min(1, Math.max(0, finite(shape.opacity, 1))), locked: Boolean(shape.locked),
  }
  if (isPointShape(shape.type)) {
    if (!Array.isArray(shape.points) || shape.points.length < 4 || shape.points.length > 100000 || shape.points.length % 2) throw new Error('Invalid point shape')
    const points = shape.points.map(value => { if (!Number.isFinite(value) || Math.abs(value) > 1e6) throw new Error('Invalid point value'); return value })
    const result = { ...base, points }
    if (shape.type === 'arrow') {
      const startBinding = bindingFor(shape.startBinding)
      const endBinding = bindingFor(shape.endBinding)
      if (startBinding) result.startBinding = startBinding
      if (endBinding) result.endBinding = endBinding
    }
    return result
  }
  if (!['rectangle', 'ellipse', 'diamond', 'text', 'image'].includes(shape.type)) throw new Error('Unsupported shape type')
  if (!Number.isFinite(shape.width) || shape.width <= 0 || shape.width > 1e6) throw new Error('Invalid shape dimensions')
  if (shape.type !== 'text' && (!Number.isFinite(shape.height) || shape.height <= 0 || shape.height > 1e6)) throw new Error('Invalid shape dimensions')
  const result = { ...base, ...normalizeBox({ x: base.x, y: base.y, width: shape.width, height: shape.type === 'text' && !Number.isFinite(shape.height) ? 0 : shape.height }) }
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
