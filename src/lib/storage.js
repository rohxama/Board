import { getStorage } from './browser'
const STORAGE_KEY = 'diagram-board-v1'
const MAX_STORAGE_STRIP_IMAGES = 2 * 1024 * 1024

export function loadDiagram() {
  try {
    const storage = getStorage()
    if (!storage) return null
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw)
    if (!value || typeof value !== 'object' || !Array.isArray(value.shapes)) return null
    return { shapes: value.shapes, fileName: typeof value.fileName === 'string' ? value.fileName : undefined, savedAt: Number.isFinite(value.savedAt) ? value.savedAt : undefined }
  } catch (_e) {
    return null
  }
}

export function saveDiagram(shapes, fileName) {
  if (!Array.isArray(shapes)) return false
  const savedAt = Date.now()
  const announceSaved = () => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('diagram:saved', { detail: { savedAt } })) }
  const build = items => JSON.stringify({ shapes: items, fileName, savedAt })
  try {
    window.localStorage.setItem(STORAGE_KEY, build(shapes))
    announceSaved()
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
        const storage = getStorage()
    if (!storage) return false
            storage.setItem(STORAGE_KEY, payload)
        announceSaved()
        console.warn('Board was too large for full save; some embedded images were omitted. Vector shapes were preserved.')
        return true
      } catch (_e) { /* keep dropping */ }
    }
    return false
  }
}

export function clearDiagram() {
  try {
    const storage = getStorage()
    if (!storage) return false
    storage.removeItem(STORAGE_KEY)
    return true
  } catch (_e) {
    return false
  }
}

const TRASH_KEY = 'diagram-board-trash-v1'

export function moveDiagramToTrash(shapes, fileName) {
  try {
    const storage = getStorage()
    if (!storage || !Array.isArray(shapes)) return false
    storage.setItem(TRASH_KEY, JSON.stringify({ shapes, fileName, deletedAt: Date.now() }))
    return clearDiagram()
  } catch (_e) {
    return false
  }
}
