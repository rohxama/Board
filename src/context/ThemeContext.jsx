import { createContext, useContext, useEffect, useState } from 'react'

// Single source of truth for the active theme. Previously `darkMode` lived as
// local state inside the toolbar, so the canvas renderer could not see it.
// Centralizing it here lets the canvas, the toolbar, and the exporter all read
// the same theme without prop-drilling or re-coloring stored shapes.
const ThemeContext = createContext(null)

function readInitialDark() {
  if (typeof document === 'undefined') return false
  try {
    if (document.documentElement.dataset.theme === 'dark') return true
    return localStorage.getItem('diagram-board-theme') === 'dark'
  } catch {
    return false
  }
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(readInitialDark)

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light'
    document.documentElement.dataset.theme = theme
    // Keep the <html> background in sync so overscroll / non-board areas match.
    document.documentElement.style.background = darkMode ? '#121418' : ''
    try {
      localStorage.setItem('diagram-board-theme', theme)
    } catch {
      /* storage may be unavailable (private mode); theme still applies in-session */
    }
  }, [darkMode])

  const value = {
    darkMode,
    theme: darkMode ? 'dark' : 'light',
    setDarkMode,
    setTheme: next => setDarkMode(next === 'dark'),
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) return { darkMode: false, theme: 'light', setDarkMode: () => {}, setTheme: () => {} }
  return ctx
}
