import { useEffect, useState } from 'react'

const LOAD_TIMEOUT_MS = 12000
const cache = new Map()

function recordFor(src) {
  let record = cache.get(src)
  if (record) return record
  const image = new Image()
  record = { image, loaded: false, failed: false, listeners: new Set() }
  image.decoding = 'async'
  image.onload = () => {
    record.loaded = true
    record.listeners.forEach(listener => listener(image))
    record.listeners.clear()
  }
  image.onerror = () => {
    record.failed = true
    record.listeners.forEach(listener => listener(null))
    record.listeners.clear()
  }
  image.src = src
  cache.set(src, record)
  return record
}

export function useImageAsset(src) {
  const [state, setState] = useState({ image: null, failed: false })
  useEffect(() => {
    if (!src) { setState(prev => (prev.image === null && prev.failed ? prev : { image: null, failed: true })); return undefined }
    const record = recordFor(src)
    const commit = (image, failed) => setState(prev => (prev.image === image && prev.failed === failed ? prev : { image, failed }))
    if (record.loaded) { commit(record.image, false); return undefined }
    if (record.failed) { commit(null, true); return undefined }
    const listener = image => commit(image, !image)
    record.listeners.add(listener)
    const timeout = setTimeout(() => {
      commit(null, true)
      record.failed = true
      record.listeners.delete(listener)
    }, LOAD_TIMEOUT_MS)
    return () => { record.listeners.delete(listener); clearTimeout(timeout) }
  }, [src])
  return state
}
