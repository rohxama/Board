import { useState, useEffect } from 'react'

const REFRESH_FLAG_KEY = 'diagram-board-refresh-flag'

/**
 * Detects whether the current page load is a refresh/reload.
 *
 * Uses sessionStorage: on mount, if the flag already exists from a previous
 * load, this is a refresh. Then we set the flag so the NEXT load (if any)
 * will also be detected as a refresh.
 *
 * Returns false on first visit (no flag exists yet).
 * Returns true on the first refresh and every subsequent refresh.
 */
export function usePageRefresh() {
  const [isPageRefresh, setIsPageRefresh] = useState(() => {
    try {
      return sessionStorage.getItem(REFRESH_FLAG_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(REFRESH_FLAG_KEY, '1')
    } catch {
      // Storage unavailable
    }
  }, [])

  return isPageRefresh
}
