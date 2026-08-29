// Centralized theme-aware color adaptation for canvas content.
//
// The user's authored color is always preserved as-is in the stored shape
// data (shape.stroke / shape.fill). What changes is only the *display* color,
// which is derived on the fly from the original color + the active theme.
// Because the derivation is a pure function of (originalColor, theme), the
// stored color never drifts: switching light -> dark -> light always returns
// to the exact original color.
//
// Strategy:
//   - light theme: only colors that are too light (near-white) for the light
//     canvas are darkened, keeping their hue/saturation.
//   - dark theme: only colors that are too dark (near-black) for the dark
//     canvas are lightened, keeping their hue/saturation.
//   - mid-tone, readable colors are left untouched, preserving the user's
//     color identity (e.g. a green stays a green, just adjusted for contrast).

const DARK_MIN_LUM = 0.32
const DARK_TARGET_LUM = 0.5
const LIGHT_MAX_LUM = 0.78
const LIGHT_TARGET_LUM = 0.16

function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value
}

function parseHex(color) {
  if (typeof color !== 'string') return null
  let hex = color.trim().toLowerCase()
  if (hex[0] !== '#') return null
  hex = hex.slice(1)
  if (hex.length === 3) {
    return [
      parseInt(hex[0] + hex[0], 16),
      parseInt(hex[1] + hex[1], 16),
      parseInt(hex[2] + hex[2], 16),
    ]
  }
  if (hex.length === 6) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ]
  }
  // 4/8 digit (alpha) and anything else: leave untouched so we never corrupt
  // a color we don't fully understand.
  return null
}

function toHex([r, g, b]) {
  const h = n => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  return `#${h(r)}${h(g)}${h(b)}`
}

function srgbToLinear(channel) {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function relativeLuminance([r, g, b]) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

function rgbToHsl([r, g, b]) {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  let h = 0
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }
  const l = (max + min) / 2
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  return [h, s, l]
}

function hslToRgb([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const hp = (((h % 360) + 360) % 360) / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let r = 0
  let g = 0
  let b = 0
  if (hp < 1) [r, g, b] = [c, x, 0]
  else if (hp < 2) [r, g, b] = [x, c, 0]
  else if (hp < 3) [r, g, b] = [0, c, x]
  else if (hp < 4) [r, g, b] = [0, x, c]
  else if (hp < 5) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const m = l - c / 2
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255]
}

// Nudge the lightness of a color (preserving hue + saturation) until it reaches
// the requested relative luminance, or until it hits the black/white bound.
function adjustLuminance(rgb, targetLum) {
  const [h, s, l] = rgbToHsl(rgb)
  const current = relativeLuminance(rgb)
  if (Math.abs(current - targetLum) < 0.01) return rgb
  const step = targetLum > current ? 0.02 : -0.02
  let lightness = l
  let best = rgb
  for (let i = 0; i < 60; i++) {
    const candidate = hslToRgb([h, s, clamp(lightness + step, 0, 1)])
    const lum = relativeLuminance(candidate)
    best = candidate
    if ((step > 0 && lum >= targetLum) || (step < 0 && lum <= targetLum)) return candidate
    lightness += step
    if (lightness <= 0 || lightness >= 1) return best
  }
  return best
}

// Returns the display color for a stored shape color under the given theme.
// `theme` is 'light' | 'dark'. Pass the *original* authored color; the result
// is what should be painted on the canvas / exported file.
export function getThemeAwareColor(color, theme) {
  if (!color || color === 'transparent') return color
  const rgb = parseHex(color)
  if (!rgb) return color // unsupported format: keep as-is
  const lum = relativeLuminance(rgb)
  if (theme === 'dark') {
    if (lum < DARK_MIN_LUM) return toHex(adjustLuminance(rgb, DARK_TARGET_LUM))
    return color
  }
  // light theme
  if (lum > LIGHT_MAX_LUM) return toHex(adjustLuminance(rgb, LIGHT_TARGET_LUM))
  return color
}

// Reads the currently active theme from the document. Used by the export path,
// which snapshots the live DOM/stage and so needs the active theme on demand.
export function getCurrentTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export const THEME_PAPER = {
  light: { background: '#f8fafc', grid: '#cbd5e1' },
  dark: { background: '#121418', grid: 'rgba(255, 255, 255, 0.10)' },
}
