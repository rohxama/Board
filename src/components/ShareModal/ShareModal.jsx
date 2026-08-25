import { useEffect, useRef, useState } from 'react'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

const CloseIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" {...stroke} /></svg>
const MailIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" {...stroke} /><path d="m3.2 7 8.8 5.6L20.8 7" {...stroke} /></svg>
const UsersIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5H6.5A3.5 3.5 0 0 0 3 17.5V19" {...stroke} /><circle cx="7" cy="8" r="3" {...stroke} /><circle cx="17" cy="8" r="2.4" {...stroke} /><path d="M21 19v-1.5a3 3 0 0 0-2-2.8" {...stroke} /></svg>
const LinkIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 14.5 14.5 9.5M13.5 6l1.2-1.2a3.9 3.9 0 0 1 5.5 5.5L19 11.5" {...stroke} /><path d="M10.5 18l-1.2 1.2a3.9 3.9 0 0 1-5.5-5.5L5 12.5" {...stroke} /></svg>
const CheckIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7" {...stroke} strokeWidth="2.2" /></svg>

const SOCIALS = [
  { id: 'whatsapp', label: 'Share on WhatsApp', color: '#25D366', svg: () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg> },
  { id: 'facebook', label: 'Share on Facebook', color: '#1877F2', svg: () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.971h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073" /></svg> },
  { id: 'x', label: 'Share on X', color: '#111111', svg: () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
  { id: 'linkedin', label: 'Share on LinkedIn', color: '#0A66C2', svg: () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
  { id: 'email', label: 'Share via Gmail', color: '#EA4335', svg: () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg> },
]

const PLACEHOLDER_PEOPLE = [
  { name: 'John Doe', email: 'john@example.com', permission: 'edit' },
  { name: 'Sarah Khan', email: 'sarah@example.com', permission: 'view' },
]

const AVATAR_COLORS = ['#2f855a', '#52bd6b', '#e8813a']
const nameFromEmail = email => email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase()) || 'New member'
const slugify = value => (value || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled'

const PenIcon = () => <svg className="share-opt-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4-1 10-10-3-3L5 16l-1 4Z" {...stroke} /><path d="m13 8 3 3" {...stroke} /></svg>
const EyeIcon = () => <svg className="share-opt-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" {...stroke} /><circle cx="12" cy="12" r="3" {...stroke} /></svg>

const PERMISSIONS = [
  { value: 'edit', label: 'Can edit', icon: <PenIcon /> },
  { value: 'view', label: 'Can view', icon: <EyeIcon /> },
]

function PermissionSelect({ value, onChange, ariaLabel, compact = false }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointer = event => { if (!rootRef.current?.contains(event.target)) setOpen(false) }
    const onKey = event => {
      if (event.key !== 'Escape') return
      event.stopImmediatePropagation()
      setOpen(false)
      rootRef.current?.querySelector('.share-select-trigger')?.focus()
    }
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey, true)
    }
  }, [open])

  const current = PERMISSIONS.find(item => item.value === value) || PERMISSIONS[0]

  return (
    <span className={`share-select ${compact ? 'compact' : ''}`} ref={rootRef}>
      <button type="button" className="share-select-trigger" aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel} onClick={() => setOpen(open => !open)}>
        {current.icon}
        <span>{current.label}</span>
        <svg className="share-select-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div className="share-select-menu" role="listbox" aria-label={ariaLabel}>
          {PERMISSIONS.map(option => (
            <button type="button" role="option" aria-selected={option.value === value} key={option.value} className={option.value === value ? 'selected' : ''} onClick={() => { onChange(option.value); setOpen(false) }}>
              {option.icon}
              <span>{option.label}</span>
              {option.value === value && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
    </span>
  )
}

export default function ShareModal({ fileName, onClose }) {
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState('edit')
  const [people, setPeople] = useState(() => PLACEHOLDER_PEOPLE.map(person => ({ ...person })))
  const [invited, setInvited] = useState('')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState('')
  const cardRef = useRef(null)
  const emailRef = useRef(null)
  const copyTimer = useRef(0)
  const inviteTimer = useRef(0)
  const toastTimer = useRef(0)

  const shareUrl = `https://diagramboard.app/board/${slugify(fileName)}`

  useEffect(() => {
    emailRef.current?.focus()
    return () => {
      document.querySelector('.header-invite')?.focus()
      window.clearTimeout(copyTimer.current)
      window.clearTimeout(inviteTimer.current)
      window.clearTimeout(toastTimer.current)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab') return
      const focusables = Array.from(cardRef.current?.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])') || []).filter(element => !element.disabled)
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const showToast = message => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2400)
  }

  const sendInvite = () => {
    const clean = email.trim()
    if (!clean) { emailRef.current?.focus(); return }
    setPeople(current => [...current, { name: nameFromEmail(clean), email: clean, permission }])
    setEmail('')
    setInvited('Invitation ready')
    window.clearTimeout(inviteTimer.current)
    inviteTimer.current = window.setTimeout(() => setInvited(''), 2600)
  }

  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const input = cardRef.current?.querySelector('.share-link-input')
        input?.select()
        input?.setSelectionRange(0, 999999)
        document.execCommand('copy')
      }
      setCopied(true)
      showToast('Link copied to clipboard')
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch (_e) {
      showToast('Clipboard access unavailable')
    }
  }

  return (
    <div className="share-modal" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <div className="share-card" role="dialog" aria-modal="true" aria-labelledby="share-title" aria-describedby="share-copy" ref={cardRef}>
        <button type="button" className="share-close" title="Close" aria-label="Close share dialog" onClick={onClose}><CloseIcon /></button>
        <div className="share-head">
          <h2 id="share-title">Share this board</h2>
          <p id="share-copy">Invite people to collaborate on this board.</p>
          <p className="share-board-name">{fileName}</p>
        </div>

        <section className="share-section" aria-label="Invite people">
          <h3 className="share-section-label"><MailIcon />Invite people</h3>
          <div className="share-invite-row">
            <input ref={emailRef} type="email" className="share-email-input" placeholder="Enter email address" aria-label="Email address" value={email} onChange={event => setEmail(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') sendInvite() }} />
            <PermissionSelect value={permission} onChange={setPermission} ariaLabel="Permission" />
            <button type="button" className="share-send" onClick={sendInvite}>Send invite</button>
          </div>
          {invited && <p className="share-send-success"><CheckIcon />{invited}</p>}
        </section>

        <section className="share-section" aria-label="People with access">
          <h3 className="share-section-label"><UsersIcon />People with access</h3>
          <div className="share-people">
            {people.map(person => (
              <div className="share-person" key={person.email}>
                <span className="share-avatar" style={{ background: AVATAR_COLORS[Math.abs([...person.name].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % AVATAR_COLORS.length] }}>{person.name.slice(0, 1).toUpperCase()}</span>
                <span className="share-person-info">
                  <span className="share-person-name">{person.name}</span>
                  <span className="share-person-email">{person.email}</span>
                </span>
                <PermissionSelect compact value={person.permission} onChange={value => setPeople(current => current.map(item => item.email === person.email ? { ...item, permission: value } : item))} ariaLabel={`Permission for ${person.name}`} />
              </div>
            ))}
          </div>
        </section>

        <div className="share-divider" />

        <section className="share-section" aria-label="Share link">
          <h3 className="share-section-label"><LinkIcon />Share link</h3>
          <div className="share-link-row">
            <input className="share-link-input" readOnly value={shareUrl} aria-label="Board link" onFocus={event => event.target.select()} />
            <button type="button" className={`share-copy ${copied ? 'copied' : ''}`} onClick={copyLink} aria-live="polite">{copied ? 'Copied!' : 'Copy link'}</button>
          </div>
        </section>

        <section className="share-section share-social-section" aria-label="Share with">
          <h3 className="share-section-label"><MailIcon />Share with</h3>
          <div className="share-social">
            {SOCIALS.map(({ id, label, color, svg: Social }) => (
              <button type="button" key={id} style={{ '--sc': color }} title={label} aria-label={label} onClick={() => showToast('Social sharing will be available soon.')}><Social /></button>
            ))}
          </div>
        </section>
      </div>
      {toast && <div className="share-toast" role="status"><CheckIcon />{toast}</div>}
    </div>
  )
}