import { useEffect, useRef, useState } from 'react'

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function SaveAsModal({ initialName, onClose, onSave }) {
  const [name, setName] = useState(`${initialName || 'Untitled board'} copy`)
  const [error, setError] = useState('')
  const cardRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
    const onKeyDown = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab') return
      const focusables = Array.from(cardRef.current?.querySelectorAll('button, input') || []).filter(element => !element.disabled)
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const submit = event => {
    event.preventDefault()
    const clean = name.trim()
    if (!clean) { setError('Enter a name for this saved copy.'); inputRef.current?.focus(); return }
    if (onSave(clean)) onClose()
    else setError('The copy could not be saved. Please try again.')
  }

  return <div className="save-as-modal" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <form className="save-as-card" role="dialog" aria-modal="true" aria-labelledby="save-as-title" ref={cardRef} onSubmit={submit}>
      <button type="button" className="save-as-close" title="Close" aria-label="Close Save as dialog" onClick={onClose}><CloseIcon /></button>
      <h2 id="save-as-title">Save as</h2>
      <p>Create a separate saved copy of the current board.</p>
      <label className="save-as-field"><span>Board name</span><input ref={inputRef} value={name} maxLength={80} onChange={event => { setName(event.target.value); setError('') }} aria-invalid={Boolean(error)} /></label>
      {error && <span className="save-as-error" role="alert">{error}</span>}
      <div className="save-as-actions"><button type="button" className="save-as-cancel" onClick={onClose}>Cancel</button><button type="submit" className="save-as-submit">Save</button></div>
    </form>
  </div>
}
