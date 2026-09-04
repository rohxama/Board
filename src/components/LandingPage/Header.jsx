import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Product', href: '#features' },
  { label: 'Features', href: '#features' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#footer', hasChevron: true },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const el = document.querySelector('.landing-page')
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 20)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`lp-header ${scrolled ? 'lp-header--scrolled' : ''}`} role="banner">
      <div className="lp-header__inner">
        <a href="#/" className="lp-header__logo" aria-label="Kanvas home">
          <span className="lp-header__logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="7" fill="#171717"/>
              <path d="M8 20V8l6 6 6-6v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="lp-header__wordmark">Kanvas</span>
        </a>

        <nav className="lp-header__nav" aria-label="Main navigation">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className="lp-header__nav-link">
              {link.label}
              {link.hasChevron && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="lp-header__chevron">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </a>
          ))}
        </nav>

        <div className="lp-header__actions">
          <a href="#/board" className="lp-header__login">Log in</a>
          <a href="#/board" className="lp-btn lp-btn-primary lp-header__cta">Start creating</a>
        </div>

        <button
          className="lp-header__hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="lp-header__mobile-menu" role="navigation" aria-label="Mobile navigation">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className="lp-header__mobile-link" onClick={() => setMobileOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="lp-header__mobile-actions">
            <a href="#/board" className="lp-header__mobile-link">Log in</a>
            <a href="#/board" className="lp-btn lp-btn-primary" style={{ width: '100%', textAlign: 'center' }}>Start creating</a>
          </div>
        </div>
      )}
    </header>
  )
}
