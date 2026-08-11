const STORAGE_KEY = 'diagram-board-v1'
const MAX_STORAGE_STRIP_IMAGES = 2 * 1024 * 1024

export function loadDiagram() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw)
    if (!value || typeof value !== 'object' || !Array.isArray(value.shapes)) return null
    return { shapes: value.shapes, fileName: typeof value.fileName === 'string' ? value.fileName : undefined }
  } catch (_e) {
    return null
  }
}

export function saveDiagram(shapes, fileName) {
  if (!Array.isArray(shapes)) return false
  const build = items => JSON.stringify({ shapes: items, fileName, savedAt: Date.now() })
  try {
    window.localStorage.setItem(STORAGE_KEY, build(shapes))
    return true
  } catch (error) {
    if (!error || (error.name !== 'QuotaExceededError' && error.code !== 22)) return false
    // Storage full: drop image payloads one at a time (largest first) until the
    // remaining board fits, so text and vector work always survive a reload and
    // smaller images are kept whenever possible.
    const items = shapes.map(shape => ({ ...shape }))
    const drop = () => {
      let worst = -1; let worstIndex = -1
      for (let i = 0; i < items.length; i++) {
        const size = items[i].type === 'image' && typeof items[i].src === 'string' ? items[i].src.length : 0
        if (size > worst) { worst = size; worstIndex = i }
      }
      if (worstIndex === -1) return false
      items[worstIndex] = { ...items[worstIndex], src: undefined }
      return true
    }
    while (drop()) {
      try {
        const payload = build(items)
        if (payload.length > MAX_STORAGE_STRIP_IMAGES) continue
        window.localStorage.setItem(STORAGE_KEY, payload)
        console.warn('Board was too large for full save; some embedded images were omitted. Vector shapes were preserved.')
        return true
      } catch (_e) { /* keep dropping */ }
    }
    return false
  }
}

export function clearDiagram() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (_e) {
    return false
  }
}
