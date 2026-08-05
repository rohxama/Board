export const IMAGE_ACCEPT = 'image/png,image/jpeg,image/svg+xml,image/webp,.png,.jpg,.jpeg,.svg,.webp'
export const MAX_IMAGE_SIZE = 20 * 1024 * 1024
export const INITIAL_IMAGE_WIDTH = 300
export const MAX_IMAGE_DIMENSION = 2048
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

export async function readImageFile(file) {
  if (!file) throw new Error('Choose an image file first.')
  if (!isSupportedImage(file)) throw new Error('Use a PNG, JPG, SVG, or WEBP image.')
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Images must be 20 MB or smaller.')

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await loadElement(objectUrl)
    const naturalWidth = image.naturalWidth || 1
    const naturalHeight = image.naturalHeight || 1
    // Downscale very large images so decoding, history size and Konva drawing stay
    // within memory limits on all devices (the "image never appears" failure mode).
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(naturalWidth, naturalHeight))
    const width = Math.max(1, Math.round(naturalWidth * scale))
    const height = Math.max(1, Math.round(naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Image processing is not supported in this browser.')
    ctx.drawImage(image, 0, 0, width, height)
    // Rasterize SVG (and any format) to a same-origin bitmap so rendering and
    // Konva toDataURL export are consistent, and external-resource SVGs can never
    // silently draw blank. JPEG output for photos to keep payloads small.
    const format = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png'
    const src = canvas.toDataURL(format, format === 'image/jpeg' ? IMAGE_QUALITY : undefined)
    return { src, width, height }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
