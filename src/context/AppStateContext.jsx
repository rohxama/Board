import { createContext, useContext, useReducer } from 'react'
const AppStateContext = createContext(null)
const initialState = { activeTool: 'select', activeStyle: { stroke: '#1e293b', strokeWidth: 2, dash: 'solid', fill: 'transparent', opacity: 1, cornerRadius: 8, fontSize: 20 }, selectedShapeIds: [], fileName: 'Untitled board' }
function reducer(state, action) {
  switch (action.type) {
    case 'SET_TOOL': return { ...state, activeTool: action.tool, selectedShapeIds: action.tool === 'select' || action.tool === 'pan' ? state.selectedShapeIds : [] }
    case 'SET_STYLE': return { ...state, activeStyle: { ...state.activeStyle, ...action.style } }
    case 'SET_SELECTION': return { ...state, selectedShapeIds: action.ids }
    case 'SET_FILENAME': return { ...state, fileName: action.fileName }
    default: return state
  }
}
export function AppStateProvider({ children }) { const [state, dispatch] = useReducer(reducer, initialState); return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider> }
export function useAppState() { const value = useContext(AppStateContext); if (!value) throw new Error('useAppState must be used inside AppStateProvider'); return value }
