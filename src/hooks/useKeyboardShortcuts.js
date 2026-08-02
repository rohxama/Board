import { useEffect } from 'react'
import { toolShortcuts } from '../lib/shortcuts'
export function useKeyboardShortcuts({ dispatch, undo, redo, remove }) {
  useEffect(() => { const keydown = event => {
    const tag = event.target.tagName; if (tag === 'INPUT' || tag === 'TEXTAREA') return
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); return }
    if (event.key === 'Delete' || event.key === 'Backspace') { remove(); return }
    const tool = toolShortcuts[event.key.toLowerCase()]; if (tool) dispatch({ type: 'SET_TOOL', tool })
  }; window.addEventListener('keydown', keydown); return () => window.removeEventListener('keydown', keydown) }, [dispatch, undo, redo, remove])
}
