import { useEffect, useState } from 'react'

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
  const [asset, setAsset] = useState(null)
  useEffect(() => {
    if (!src) { setAsset(null); return undefined }
    const record = recordFor(src)
    if (record.loaded) { setAsset(record.image); return undefined }
    if (record.failed) { setAsset(null); return undefined }
    const listener = image => setAsset(image)
    record.listeners.add(listener)
    return () => record.listeners.delete(listener)
  }, [src])
  return asset
}
