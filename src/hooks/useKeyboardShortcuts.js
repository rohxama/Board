import { useEffect } from 'react'
import { toolShortcuts } from '../lib/shortcuts'
export function useKeyboardShortcuts({ enabled = true, dispatch, undo, redo, remove, nudge, duplicate, copy, paste, selectAll, deselect }) {
  useEffect(() => {
    if (!enabled) return
    const keydown = event => {
    const tag = event.target.tagName; if (tag === 'INPUT' || tag === 'TEXTAREA') return
    const mod = event.ctrlKey || event.metaKey
    if (mod && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); return }
    if (mod && event.key.toLowerCase() === 'd') { event.preventDefault(); duplicate(); return }
    if (mod && event.key.toLowerCase() === 'c') { event.preventDefault(); copy(); return }
    if (mod && event.key.toLowerCase() === 'v') { event.preventDefault(); paste(); return }
    if (mod && event.key.toLowerCase() === 'a') { event.preventDefault(); selectAll(); return }
    if (event.key === 'Delete' || event.key === 'Backspace') { remove(); return }
    if (event.key === 'Escape') { deselect(); return }
    if (event.key.startsWith('Arrow')) { event.preventDefault(); const step = event.shiftKey ? 10 : 1; const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key]; if (move) nudge(...move); return }
    const tool = toolShortcuts[event.key.toLowerCase()]; if (tool) dispatch({ type: 'SET_TOOL', tool })
  }; window.addEventListener('keydown', keydown); return () => window.removeEventListener('keydown', keydown) }, [enabled, dispatch, undo, redo, remove, nudge, duplicate, copy, paste, selectAll, deselect])
}
