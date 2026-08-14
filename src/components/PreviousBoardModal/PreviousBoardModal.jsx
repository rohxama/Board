import { useRef } from 'react'

const RESTORE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4v5h5" />
    <path d="M4 9a8.5 8.5 0 1 0 2.4-6.1L4 5.2" />
    <path d="M12 8v4l2.5 2" />
  </svg>
)

export default function PreviousBoardModal({ onRestore, onFresh }) {
  const dialogRef = useRef(null)

  const handleKeyDown = event => {
    if (event.key !== 'Tab') return
    const focusables = dialogRef.current?.querySelectorAll('button')
    if (!focusables || !focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return (
    <div className="previous-board-modal">
      <div className="previous-board-card" role="dialog" aria-modal="true" aria-labelledby="previous-board-title" aria-describedby="previous-board-copy" ref={dialogRef} onKeyDown={handleKeyDown}>
        <div className="modal-icon">{RESTORE_ICON}</div>
        <h2 className="modal-title" id="previous-board-title">Previous Board Found</h2>
        <p className="modal-copy" id="previous-board-copy">Your previous board is saved locally. Would you like to continue where you left off or start with a fresh canvas?</p>
        <div className="modal-actions">
          <button type="button" className="modal-restore" onClick={onRestore} autoFocus>Restore Previous Board</button>
          <button type="button" className="modal-fresh" onClick={onFresh}>Start Fresh</button>
        </div>
      </div>
    </div>
  )
}