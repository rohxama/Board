export const IMAGE_ACCEPT = 'image/png,image/jpeg,image/svg+xml,image/webp,.png,.jpg,.jpeg,.svg,.webp'
export const MAX_IMAGE_SIZE = 20 * 1024 * 1024
export const INITIAL_IMAGE_WIDTH = 300

const supportedExtensions = /\.(png|jpe?g|svg|webp)$/i
const supportedTypes = new Set(['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'])

export function isSupportedImage(file) {
  return supportedTypes.has(file.type) || supportedExtensions.test(file.name)
}

export async function readImageFile(file) {
  if (!file) throw new Error('Choose an image file first.')
  if (!isSupportedImage(file)) throw new Error('Use a PNG, JPG, SVG, or WEBP image.')
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Images must be 20 MB or smaller.')

  const src = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('The image could not be read.'))
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
  const dimensions = await new Promise((resolve, reject) => {
    const image = new Image()
    image.onerror = () => reject(new Error('The selected file is not a valid image.'))
    image.onload = () => resolve({ width: image.naturalWidth || 1, height: image.naturalHeight || 1 })
    image.src = src
  })
  return { src, ...dimensions }
}
