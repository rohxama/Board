export function friendlyErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const raw = error && typeof error.message === 'string' ? error.message : ''
  if (!raw) return fallback

  const normalized = raw.trim()
  if (!normalized) return fallback

  const low = normalized.toLowerCase()

  if (low.includes('json') || low.includes('unsupported') || low.includes('corrupt') || low.includes('invalid') || low.includes('format')) {
    return 'Import Failed — This file isn’t supported or appears to be corrupted. Try another file.'
  }

  if (low.includes('image') || low.includes('png') || low.includes('jpg') || low.includes('jpeg') || low.includes('webp') || low.includes('svg')) {
    return 'Image upload failed — This file isn’t supported or couldn’t be processed. Try another image.'
  }

  if (low.includes('clipboard') || low.includes('copy')) {
    return 'Copy Failed — This browser can’t copy the image from here. Try Download PNG instead.'
  }

  if (low.includes('export') || low.includes('canvas') || low.includes('browser')) {
    return 'Export Failed — Something went wrong while generating the file. Please try again.'
  }

  return fallback
}
