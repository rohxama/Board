export const THEME_STORAGE_KEY = 'diagram-board-theme'
export const DEFAULT_THEME = 'light'

export function readSavedTheme(storage = typeof window !== 'undefined' ? window.localStorage : null) {
  try {
    const value = storage?.getItem(THEME_STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : DEFAULT_THEME
  } catch (_error) {
    return DEFAULT_THEME
  }
}

export function applySavedTheme() {
  const theme = readSavedTheme()
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = theme
  return theme
}
