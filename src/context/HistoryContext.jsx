import { createContext, useCallback, useContext, useReducer } from 'react'
const HistoryContext = createContext(null)
const initial = { shapes: [], undoStack: [], redoStack: [] }
function reducer(state, action) {
  if (action.type === 'COMMIT') return { shapes: action.shapes, undoStack: [...state.undoStack, state.shapes], redoStack: [] }
  if (action.type === 'UNDO' && state.undoStack.length) { const previous = state.undoStack.at(-1); return { shapes: previous, undoStack: state.undoStack.slice(0, -1), redoStack: [state.shapes, ...state.redoStack] } }
  if (action.type === 'REDO' && state.redoStack.length) { const next = state.redoStack[0]; return { shapes: next, undoStack: [...state.undoStack, state.shapes], redoStack: state.redoStack.slice(1) } }
  return state
}
export function HistoryProvider({ children }) { const [state, dispatch] = useReducer(reducer, initial); const commit = useCallback((shapes) => dispatch({ type: 'COMMIT', shapes }), []); return <HistoryContext.Provider value={{ ...state, commit, undo: () => dispatch({ type: 'UNDO' }), redo: () => dispatch({ type: 'REDO' }) }}>{children}</HistoryContext.Provider> }
export function useHistory() { const value = useContext(HistoryContext); if (!value) throw new Error('useHistory must be used inside HistoryProvider'); return value }
