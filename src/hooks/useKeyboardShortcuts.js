import { useEffect } from 'react'
import { toolShortcuts } from '../lib/shortcuts'
import { getEventKey } from '../lib/browser'
export function useKeyboardShortcuts({ enabled = true, dispatch, undo, redo, remove, nudge, duplicate, copy, paste, selectAll, deselect, openImage, zoomIn, zoomOut, zoomToFit, resetZoom, finishText }) {
  useEffect(() => {
    if (!enabled) return
    const keydown = event => {
      const key = getEventKey(event)
    const tag = event.target.tagName; const type = event.target.type; if ((tag === 'INPUT' && type !== 'file') || tag === 'TEXTAREA' || event.target.isContentEditable) return
    const mod = event.ctrlKey || event.metaKey
    if (event.shiftKey && key === '1' && !mod) { event.preventDefault(); zoomToFit(); return }
    if (mod && (key === '=' || key === '+')) { event.preventDefault(); zoomIn(); return }
    if (mod && key === '-') { event.preventDefault(); zoomOut(); return }
    if (mod && key === '0') { event.preventDefault(); resetZoom(); return }
    if (mod && key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); return }
    if (mod && key.toLowerCase() === 'y') { event.preventDefault(); redo(); return }
    if (mod && key.toLowerCase() === 'd') { event.preventDefault(); duplicate(); return }
    if (mod && key.toLowerCase() === 'c') { event.preventDefault(); copy(); return }
    if (mod && key.toLowerCase() === 'v') { event.preventDefault(); paste(); return }
    if (mod && key.toLowerCase() === 'a') { event.preventDefault(); selectAll(); return }
    if (key === 'Delete' || key === 'Backspace') { remove(); return }
    if (key === 'Escape') { if (finishText) finishText(); else deselect(); return }
    if (mod && key === 'Enter') { if (finishText) { event.preventDefault(); finishText(); return } }
    if (key.startsWith('Arrow')) { event.preventDefault(); const step = event.shiftKey ? 10 : 1; const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[key]; if (move) nudge(...move); return }
    if (!mod && key === '9') { event.preventDefault(); openImage(); return }
    const tool = toolShortcuts[key.toLowerCase()]; if (tool) dispatch({ type: 'SET_TOOL', tool })
  }; window.addEventListener('keydown', keydown); return () => window.removeEventListener('keydown', keydown) }, [enabled, dispatch, undo, redo, remove, nudge, duplicate, copy, paste, selectAll, deselect, openImage, zoomIn, zoomOut, zoomToFit, resetZoom, finishText])
}
