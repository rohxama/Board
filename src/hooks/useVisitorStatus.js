import { useEffect, useMemo, useState } from 'react'
import { loadDiagram } from '../lib/storage'

const VISITOR_KEY = 'whiteboard_has_visited'

function readHasVisited() {
  try {
    return window.localStorage.getItem(VISITOR_KEY) !== null
  } catch (_e) {
    return true
  }
}

// First visit = the key is absent; every later startup (key present) is a
// returning visitor. The key is persisted right after the initial detection.
export function useVisitorStatus() {
  const [isReturning, setIsReturning] = useState(() => readHasVisited())
  useEffect(() => {
    try {
      window.localStorage.setItem(VISITOR_KEY, 'true')
    } catch (_e) { /* storage unavailable; keep in-memory status */ }
  }, [])
  return isReturning
}

// Previous-board detection: only offered after a page refresh when a valid
// saved board exists. The `ready` flag (splash completed) gates detection
// so the popup never appears before the whiteboard is fully initialized.
export function usePreviousBoard(ready) {
  const isReturning = useVisitorStatus()
  const savedBoard = useMemo(() => {
    if (!ready || !isReturning) return null
    return loadDiagram()
  }, [ready, isReturning])
  return { previousBoardAvailable: Boolean(savedBoard && savedBoard.shapes.length), savedBoard }
}