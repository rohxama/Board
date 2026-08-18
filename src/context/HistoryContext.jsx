import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import { createInitialHistoryState, historyReducer } from './historyState'

const HistoryContext = createContext(null)

export function HistoryProvider({ children }) {
  const [state, dispatch] = useReducer(historyReducer, undefined, createInitialHistoryState)

  const commit = useCallback(shapes => dispatch({ type: 'COMMIT', shapes }), [])
  const replace = useCallback(shapes => dispatch({ type: 'REPLACE', shapes }), [])
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])

  const value = useMemo(() => ({
    ...state,
    canUndo: state.undoStack.length > 0,
    canRedo: state.redoStack.length > 0,
    commit,
    replace,
    undo,
    redo,
  }), [state, commit, replace, undo, redo])

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
}

export function useHistory() {
  const value = useContext(HistoryContext)
  if (!value) throw new Error('useHistory must be used inside HistoryProvider')
  return value
}
