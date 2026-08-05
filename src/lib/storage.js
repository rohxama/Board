const STORAGE_KEY = 'diagram-board-v1'
const MAX_STORAGE_STRIP_IMAGES = 2 * 1024 * 1024

export function loadDiagram() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw)
    if (!value || typeof value !== 'object' || !Array.isArray(value.shapes)) return null
    return { shapes: value.shapes, fileName: typeof value.fileName === 'string' ? value.fileName : undefined }
  } catch {
    return null
  }
}

export function saveDiagram(shapes, fileName) {
  if (!Array.isArray(shapes)) return false
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ shapes, fileName, savedAt: Date.now() }))
    return true
  } catch (error) {
    if (error && (error.name === 'QuotaExceededError' || error.code === 22)) {
      try {
        // Storage full: drop image data (their base64 payloads dominate the size)
        // so text and vector work still survives a reload.
        const stripped = shapes.map(shape => shape && shape.type === 'image' ? { ...shape, src: undefined } : shape)
        const payload = JSON.stringify({ shapes: stripped, fileName, savedAt: Date.now() })
        if (payload.length > MAX_STORAGE_STRIP_IMAGES) return false
        window.localStorage.setItem(STORAGE_KEY, payload)
        console.warn('Board was too large for full save; embedded images were omitted. Vector shapes were preserved.')
        return true
      } catch {
        return false
      }
    }
    return false
  }
}

export function clearDiagram() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
