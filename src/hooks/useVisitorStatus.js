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

// Previous-board detection: a saved board only counts for returning visitors.
// First-time users and returning users with no saved data get no board.
export function usePreviousBoard() {
  const isReturning = useVisitorStatus()
  const savedBoard = useMemo(() => (isReturning ? loadDiagram() : null), [isReturning])
  return { previousBoardAvailable: Boolean(savedBoard && savedBoard.shapes.length), savedBoard }
}