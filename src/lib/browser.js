const globalObject = typeof globalThis !== 'undefined' ? globalThis : {}

export const hasPointerEvents = typeof globalObject.PointerEvent === 'function'

export function getStorage() {
  if (typeof window === 'undefined') return null
  try {
    const storage = window.localStorage
    const probe = '__diagram_storage_probe__'
    storage.setItem(probe, '1')
    storage.removeItem(probe)
    return storage
  } catch (_error) {
    return null
  }
}

export function getCanvas2DContext(canvas) {
  if (!canvas || typeof canvas.getContext !== 'function') return null
  try {
    return canvas.getContext('2d')
  } catch (_error) {
    return null
  }
}

export function getEventKey(event) {
  if (event && typeof event.key === 'string' && event.key !== 'Unidentified') return event.key
  const keyCodes = {
    8: 'Backspace', 9: 'Tab', 13: 'Enter', 27: 'Escape', 32: ' ',
    37: 'ArrowLeft', 38: 'ArrowUp', 39: 'ArrowRight', 40: 'ArrowDown',
    46: 'Delete', 65: 'a', 67: 'c', 86: 'v', 88: 'x', 89: 'y', 90: 'z',
  }
  return keyCodes[event?.which || event?.keyCode] || ''
}
