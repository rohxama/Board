import { useRef } from 'react'

const BOARD_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
)

const CLOCK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const SPARKLE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
    <path d="m4.93 4.93 2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
  </svg>
)

const INFO_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
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
        <div className="modal-icon-wrapper">
          <div className="modal-icon">{BOARD_ICON}</div>
          <div className="modal-icon-badge">{CLOCK_ICON}</div>
        </div>
        <h2 className="modal-title" id="previous-board-title">Welcome back!</h2>
        <p className="modal-copy" id="previous-board-copy">We found a board from your last session. What would you like to do?</p>
        <div className="modal-actions">
          <button type="button" className="modal-restore" onClick={onRestore} autoFocus>
            <span className="modal-btn-icon">{CLOCK_ICON}</span>
            Continue Last Board
          </button>
          <button type="button" className="modal-fresh" onClick={onFresh}>
            <span className="modal-btn-icon">{SPARKLE_ICON}</span>
            Start New Board
          </button>
        </div>
        <p className="modal-footer">
          <span className="modal-footer-icon">{INFO_ICON}</span>
          Your boards are saved locally on this device.
        </p>
      </div>
    </div>
  )
}