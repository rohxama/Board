export function removeEventListenerIfPresent(target, type, handler, options) {
  if (!target || typeof target.removeEventListener !== 'function') return

  const current = target.__pendingEventListeners || {}
  const key = `${type}:${String(options ?? '')}`

  if (current[key]?.has(handler)) {
    target.removeEventListener(type, handler, options)
    current[key].delete(handler)
    if (current[key].size === 0) delete current[key]
  } else {
    target.removeEventListener(type, handler, options)
  }

  target.__pendingEventListeners = current
}

export function addEventListenerOnce(target, type, handler, options) {
  if (!target || typeof target.addEventListener !== 'function') return () => {}

  removeEventListenerIfPresent(target, type, handler, options)

  target.addEventListener(type, handler, options)

  const current = target.__pendingEventListeners || {}
  const key = `${type}:${String(options ?? '')}`
  if (!current[key]) current[key] = new Set()
  current[key].add(handler)
  target.__pendingEventListeners = current

  return () => {
    removeEventListenerIfPresent(target, type, handler, options)
  }
}
