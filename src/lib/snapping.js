export const snapToGrid = (x, y, gridSize = 10) => ({ x: Math.round(x / gridSize) * gridSize, y: Math.round(y / gridSize) * gridSize })
export function getSnapGuides(bounds, others, threshold = 6) {
  const guides = []; const snapped = {}
  const axes = [['x', 'width', 'vertical'], ['y', 'height', 'horizontal']]
  axes.forEach(([axis, size, orientation]) => {
    const lines = [
      { value: bounds[axis], offset: 0 },
      { value: bounds[axis] + bounds[size] / 2, offset: bounds[size] / 2 },
      { value: bounds[axis] + bounds[size], offset: bounds[size] },
    ]
    let best = null, bestDelta = Infinity
    others.forEach(other => {
      [other[axis], other[axis] + other[size] / 2, other[axis] + other[size]].forEach(value => {
        lines.forEach(line => {
          const delta = Math.abs(line.value - value)
          if (delta <= threshold && delta < bestDelta) { bestDelta = delta; best = { value, offset: line.offset } }
        })
      })
    })
    if (best) { snapped[axis] = best.value - best.offset; guides.push({ orientation, value: best.value }) }
  })
  return { guides, snapped }
}
