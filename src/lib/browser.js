const globalObject = typeof globalThis !== 'undefined' ? globalThis : {}

export const hasPointerEvents = typeof globalObject.PointerEvent === 'function'
export const hasTouchEvents = typeof globalObject.ontouchstart !== 'undefined' ||
  (typeof navigator !== 'undefined' && Number(navigator.maxTouchPoints || 0) > 0)

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

export function canUseCanvas() {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas && typeof canvas.getContext === 'function' && canvas.getContext('2d'))
  } catch (_error) {
    return false
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

export function canUseClipboardWrite() {
  return typeof navigator !== 'undefined' &&
    Boolean(navigator.clipboard && typeof navigator.clipboard.writeText === 'function')
}

export async function writeTextToClipboard(text) {
  if (canUseClipboardWrite()) {
    try {
      await navigator.clipboard.writeText(String(text))
      return true
    } catch (_error) {
      // Continue to the legacy textarea fallback below.
    }
  }
  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') return false
  try {
    const textarea = document.createElement('textarea')
    textarea.value = String(text)
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand('copy')
    textarea.remove()
    return copied
  } catch (_error) {
    return false
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

export function isPrimaryModifier(event) {
  return Boolean(event && (event.metaKey || event.ctrlKey))
}

export function readFileAsText(file) {
  if (!file) return Promise.reject(new Error('Choose a diagram file first.'))
  if (typeof file.text === 'function') return file.text()
  if (typeof FileReader === 'function') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = () => reject(new Error('The diagram file could not be read.'))
      reader.readAsText(file)
    })
  }
  return Promise.reject(new Error('This browser cannot read diagram files.'))
}
