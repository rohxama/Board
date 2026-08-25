import { useEffect, useRef, useState } from 'react'

export default function FeedbackModal({ onClose }) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    textareaRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = async () => {
    const text = message.trim()
    if (!text) return
    setStatus('submitting')
    setErrorMsg('')
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.05) reject(new Error('Network error'))
          else resolve()
        }, 1200)
      })
      window.location.hash = '#/thank-you'
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="feedback-dialog-backdrop" onPointerDown={onClose}>
      <div className="feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="feedback-title" onPointerDown={e => e.stopPropagation()}>
        <h2 id="feedback-title">Send Feedback</h2>
        <p className="feedback-desc">We&rsquo;d love to hear your thoughts. Your feedback helps us improve.</p>
        <textarea
          ref={textareaRef}
          className="feedback-textarea"
          placeholder="Tell us what you think..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
          disabled={status === 'submitting'}
        />
        {status === 'error' && <p className="feedback-error">{errorMsg}</p>}
        <div className="feedback-actions">
          <button type="button" className="feedback-cancel" onClick={onClose} disabled={status === 'submitting'}>Cancel</button>
          <button type="button" className="feedback-submit" onClick={handleSubmit} disabled={!message.trim() || status === 'submitting'}>
            {status === 'submitting' ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}
