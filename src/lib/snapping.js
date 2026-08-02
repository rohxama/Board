export const snapToGrid = (x, y, gridSize = 10) => ({ x: Math.round(x / gridSize) * gridSize, y: Math.round(y / gridSize) * gridSize })
export function getSnapGuides(bounds, others, threshold = 6) {
  const guides = []; let snapped = {}
  const axes = [['x', 'width', 'vertical'], ['y', 'height', 'horizontal']]
  axes.forEach(([axis, size, orientation]) => {
    const values = [bounds[axis], bounds[axis] + bounds[size] / 2, bounds[axis] + bounds[size]]
    others.forEach(other => [other[axis], other[axis] + other[size] / 2, other[axis] + other[size]].forEach(value => values.forEach(current => {
      if (Math.abs(current - value) <= threshold) { snapped[axis] = (snapped[axis] ?? bounds[axis]) + value - current; guides.push({ orientation, value }) }
    })))
  })
  return { guides, snapped }
}
