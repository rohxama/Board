import { useState, useCallback } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | duplicate
  const [submittedEmails, setSubmittedEmails] = useState(new Set())

  const handleSubmit = useCallback(e => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!EMAIL_RE.test(trimmed)) { setStatus('error'); return }
    if (submittedEmails.has(trimmed)) { setStatus('duplicate'); return }
    setStatus('submitting')
    // Simulate backend call — replace with real API endpoint later.
    setTimeout(() => {
      setSubmittedEmails(prev => new Set([...prev, trimmed]))
      setStatus('success')
    }, 800)
  }, [email, submittedEmails])

  const inputClass = status === 'error' || status === 'duplicate' ? ' waitlist-input--error' : ''

  return (
    <div className="waitlist-page">
      <div className="waitlist-tag" aria-hidden="true">Coming Soon</div>

      <h1 className="waitlist-hero" aria-label="Wait list">
        <span className="waitlist-word" aria-hidden="true">WAIT</span>
        <span className="waitlist-clock" aria-hidden="true">
          <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
            <g stroke="#101010" strokeWidth="6" strokeLinecap="round" fill="none">
              <circle cx="50" cy="50" r="38" strokeWidth="5" />
              <path d="M50 30 V50 L64 58" strokeWidth="5.5" />
            </g>
          </svg>
        </span>
        <span className="waitlist-word" aria-hidden="true">LIST</span>
      </h1>

      <p className="waitlist-message">
        Something awesome is on the way!<br />
        Join the waitlist and get early access when we launch.
      </p>

      {status === 'success' ? (
        <div className="waitlist-success" role="status">
          <svg viewBox="0 0 24 24" className="waitlist-success-icon" aria-hidden="true">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#52bd6b" />
          </svg>
          <span>You&apos;re on the list! We&apos;ll be in touch.</span>
        </div>
      ) : (
        <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
          <div className="waitlist-input-wrap">
            <svg className="waitlist-input-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" />
            </svg>
            <input
              type="email"
              className={`waitlist-input${inputClass}`}
              placeholder="Enter your email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (status === 'error' || status === 'duplicate') setStatus('idle') }}
              aria-label="Email address"
              disabled={status === 'submitting'}
            />
          </div>
          <button
            type="submit"
            className="waitlist-btn"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Joining...' : 'Join Waitlist'}
          </button>
        </form>
      )}

      {status === 'error' && <p className="waitlist-hint waitlist-hint--error" role="alert">Please enter a valid email address.</p>}
      {status === 'duplicate' && <p className="waitlist-hint waitlist-hint--error" role="alert">This email is already on the list.</p>}

      {status !== 'success' && (
        <p className="waitlist-privacy">No spam. We respect your inbox.</p>
      )}

      <div className="waitlist-heart" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="#52bd6b" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}
