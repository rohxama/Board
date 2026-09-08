import { useEffect, useState } from 'react'
import './OfficelyLanding.css'

const Chip = ({ className, icon, label, person, avatar }) => (
  <div className={`ol-chip ${className || ''}`}>
    <img src={icon} alt="" />
    <span><small>{label}</small><b>{person}</b></span>
    <i className={avatar} aria-hidden="true" />
  </div>
)

const Icon = ({ name }) => <img className="ol-icon" src={`/assets/hero/${name}-icon.svg`} alt="" />

export default function OfficelyLanding() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.title = 'Kanvas — Think freely. Draw without limits.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'A simple whiteboard for ideas, sketches, notes, and everything in between.')
  }, [])

  return (
    <div className="officely-page">
      <main className="ol-hero-canvas" id="top">
        <section className="ol-hero-panel" aria-labelledby="hero-title">
          <header className="ol-header">
            <a className="ol-wordmark" href="#top" aria-label="Kanvas home" style={{ color: 'var(--hero-ink)', fontWeight: 800, fontFamily: "'Factor A', sans-serif", fontSize: 'clamp(24px, 3cqw, 32px)', letterSpacing: '-.06em', lineHeight: 1 }}>Kanvas</a>
            <div className="ol-header-actions">
              <a className="ol-control ol-control--demo" href="mailto:hello@example.com"><Icon name="demo" />Book a demo</a>
              <button className="ol-control ol-control--menu" type="button" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen}><Icon name="menu" />Menu</button>
            </div>
          </header>
          {menuOpen && <nav className="ol-menu-popover" aria-label="Primary navigation"><a href="#features" onClick={() => setMenuOpen(false)}>Features</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#/docs" onClick={() => setMenuOpen(false)}>Documentation</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></nav>}
          <p className="ol-intro">A simple whiteboard for ideas, sketches,<br />notes, and everything in between.</p>
          <h1 id="hero-title" className="ol-headline"><span className="ol-type-focused">THINK</span> <img src="/assets/hero/hero-img1.jpg" alt="" className="ol-headline-portrait" /> <span className="ol-type-focused">FR<span className="ol-glyph-flexible">EE</span>LY</span><br /><span className="ol-type-focused" style={{ marginTop: '0.15em', display: 'inline-block' }}>D<span className="ol-glyph-flexible">R</span>AW LIMITLESS.</span></h1>
          <img className="ol-underline" src="/assets/doodles/hero-double-underline.svg" alt="" aria-hidden="true" />
          <img className="ol-cta-arrow" src="/assets/doodles/hero-cta-arrow.svg" alt="" aria-hidden="true" />
          <a className="ol-slack-cta" href="#/board">START DRAWING</a>
          <p className="ol-intro ol-intro--right">A simple whiteboard for ideas, sketches,<br />notes, and everything in between.</p>
        </section>
      </main>
    </div>
  )
}
