import { useRef } from 'react'

const BOARD_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
)

const CLOCK_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const SPARKLE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
  </svg>
)

const INFO_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
        <div className="modal-icon-area">
          <span className="modal-dot modal-dot-blue" />
          <span className="modal-dot modal-dot-red" />
          <span className="modal-dot modal-dot-green" />
          <div className="modal-icon-circle">
            <div className="modal-icon">{BOARD_ICON}</div>
          </div>
          <div className="modal-icon-badge">{CLOCK_ICON}</div>
        </div>
        <h2 className="modal-title" id="previous-board-title">Welcome back!</h2>
        <p className="modal-copy" id="previous-board-copy">We found a board from your last session.<br />What would you like to do?</p>
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