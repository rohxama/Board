export const IMAGE_ACCEPT = 'image/png,image/jpeg,image/svg+xml,image/webp,.png,.jpg,.jpeg,.svg,.webp'
export const INITIAL_IMAGE_WIDTH = 300
export const MAX_IMAGE_DIMENSION = 2048
// A decoded 16 MP RGBA image occupies about 64 MB before canvas/Konva overhead.
export const MAX_IMAGE_PIXELS = 16 * 1024 * 1024
export const MAX_IMAGE_SIZE = 20 * 1024 * 1024
export const IMAGE_QUALITY = 0.92

const supportedExtensions = /\.(png|jpe?g|svg|webp)$/i
const supportedTypes = new Set(['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'])

export function isSupportedImage(file) {
  return supportedTypes.has(file.type) || supportedExtensions.test(file.name)
}

function loadElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The selected file is not a valid image.'))
    image.src = src
  })
}

function yieldToBrowser() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

function dataUrlFromBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('The processed image could not be read.'))
    reader.readAsDataURL(blob)
  })
}

async function decodeOnce(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch (_) {
      // Older browsers and a few SVG variants do not support createImageBitmap.
    }
  }
  const objectUrl = URL.createObjectURL(file)
  try {
    return await loadElement(objectUrl)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function encodeCanvas(source, width, height, type, quality) {
  const canUseOffscreen = typeof OffscreenCanvas !== 'undefined'
  const canvas = canUseOffscreen ? new OffscreenCanvas(width, height) : document.createElement('canvas')
  if (!canUseOffscreen) {
    canvas.width = width
    canvas.height = height
  }
  const ctx = canvas.getContext('2d', { alpha: type !== 'image/jpeg' })
  if (!ctx) throw new Error('Image processing is not supported in this browser.')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'medium'
  // Yield before the one unavoidable canvas draw so input and paint remain responsive.
  await yieldToBrowser()
  ctx.drawImage(source, 0, 0, width, height)
  const blob = canUseOffscreen && typeof canvas.convertToBlob === 'function'
    ? await canvas.convertToBlob({ type, quality })
    : await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Image encoding failed.')), type, quality))
  if (typeof source.close === 'function') source.close()
  return dataUrlFromBlob(blob)
}

export async function readImageFile(file) {
  if (!file) throw new Error('Choose an image file first.')
  if (!isSupportedImage(file)) throw new Error('Use a PNG, JPG, SVG, or WEBP image.')
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Images must be 20 MB or smaller.')

  const source = await decodeOnce(file)
  try {
    const naturalWidth = source.naturalWidth || source.width || 1
    const naturalHeight = source.naturalHeight || source.height || 1
    if (naturalWidth > 8192 || naturalHeight > 8192 || naturalWidth * naturalHeight > MAX_IMAGE_PIXELS) {
      throw new Error('Images must be 8192px per side and 16 megapixels or smaller.')
    }
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(naturalWidth, naturalHeight))
    const width = Math.max(1, Math.round(naturalWidth * scale))
    const height = Math.max(1, Math.round(naturalHeight * scale))
    const type = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png'
    const src = await encodeCanvas(source, width, height, type, type === 'image/jpeg' ? IMAGE_QUALITY : undefined)
    return { src, width, height }
  } catch (error) {
    if (typeof source.close === 'function') source.close()
    throw error
  }
}
