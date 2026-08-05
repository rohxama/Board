const isPointShape = type => ['arrow', 'line', 'pen'].includes(type)

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
  if (!shape || typeof shape !== 'object') return shape
  if (isPointShape(shape.type)) {
    return { ...shape, points: (shape.points || []).map(n => (Number.isFinite(n) ? n : 0)) }
  }
  if (Number.isFinite(shape.width) && Number.isFinite(shape.height)) {
    return { ...shape, ...normalizeBox({ x: shape.x, y: shape.y, width: shape.width, height: shape.height }) }
  }
  return { ...shape }
}
