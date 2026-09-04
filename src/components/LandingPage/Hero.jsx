export default function Hero() {
  return (
    <section className="lp-hero lp-bg-lavender">
      <div className="lp-hero__inner">
        <div className="lp-hero__content">
          <h1 className="lp-hero__title">Your ideas<br />deserve a<br />canvas.</h1>
          <p className="lp-hero__copy">
            Kanvas is an infinite online whiteboard for thinking, sketching, planning and creating — individually or together in real time.
          </p>
          <div className="lp-hero__ctas">
            <a href="#/board" className="lp-btn lp-btn-primary">Start creating free</a>
            <a href="#/board" className="lp-btn lp-btn-secondary">Explore the canvas</a>
          </div>
          <div className="lp-hero__social-proof">
            <div className="lp-hero__avatars">
              <span className="lp-hero__avatar" style={{ background: '#F3A9B9' }}>A</span>
              <span className="lp-hero__avatar" style={{ background: '#CDB6E8' }}>M</span>
              <span className="lp-hero__avatar" style={{ background: '#BBDDBF' }}>J</span>
              <span className="lp-hero__avatar" style={{ background: '#F7DF78' }}>K</span>
            </div>
            <span className="lp-hero__social-text">Loved by creators and teams around the world</span>
          </div>
        </div>

        <div className="lp-hero__visual">
          <div className="lp-hero__mockup">
            <div className="lp-mockup__toolbar">
              <div className="lp-mockup__tool-btn lp-mockup__tool-btn--active">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L6 12L8 8L12 6L2 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="lp-mockup__tool-btn">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>
              </div>
              <div className="lp-mockup__tool-btn">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/></svg>
              </div>
              <div className="lp-mockup__tool-btn">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M7 2V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div className="lp-mockup__tool-btn">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L7 3L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            <div className="lp-mockup__canvas">
              {/* Sticky notes */}
              <div className="lp-mockup__sticky lp-mockup__sticky--yellow" style={{ top: '12%', left: '8%' }}>
                <span>User<br/>research</span>
              </div>
              <div className="lp-mockup__sticky lp-mockup__sticky--pink" style={{ top: '8%', right: '15%' }}>
                <span>Brand<br/>exploration</span>
              </div>
              <div className="lp-mockup__sticky lp-mockup__sticky--green" style={{ bottom: '25%', left: '15%' }}>
                <span>Key<br/>features</span>
              </div>
              <div className="lp-mockup__sticky lp-mockup__sticky--blue" style={{ bottom: '12%', right: '20%' }}>
                <span>Design<br/>system</span>
              </div>

              {/* Title */}
              <div className="lp-mockup__title" style={{ top: '5%', left: '35%' }}>
                Project Brainstorm
              </div>

              {/* Arrow */}
              <svg className="lp-mockup__arrow" style={{ top: '30%', left: '25%' }} width="80" height="40" viewBox="0 0 80 40">
                <path d="M5 35 Q40 5 75 20" stroke="#171717" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M68 14 L75 20 L68 26" stroke="#171717" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Shape */}
              <div className="lp-mockup__shape" style={{ top: '45%', left: '40%' }}>
                <svg width="60" height="40" viewBox="0 0 60 40">
                  <rect x="2" y="2" width="56" height="36" rx="8" stroke="#171717" strokeWidth="2" fill="rgba(235,201,232,0.4)"/>
                </svg>
              </div>

              {/* Image placeholder */}
              <div className="lp-mockup__image" style={{ top: '35%', right: '10%' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect x="2" y="2" width="44" height="44" rx="6" stroke="#171717" strokeWidth="1.5" fill="rgba(232,241,232,0.5)"/>
                  <circle cx="16" cy="16" r="5" stroke="#171717" strokeWidth="1.5"/>
                  <path d="M2 36L14 24L26 36L34 28L46 36" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Zoom controls */}
              <div className="lp-mockup__zoom">
                <span>−</span>
                <span className="lp-mockup__zoom-value">100%</span>
                <span>+</span>
              </div>

              {/* Share button */}
              <div className="lp-mockup__share">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 1L11 4L8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 4H5C3 4 1 5.5 1 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Share</span>
              </div>
            </div>
          </div>

          {/* Floating labels */}
          <div className="lp-hero__label lp-hero__label--top-right">
            <span className="lp-hero__label-icon">✨</span>
            Real-time collaboration
          </div>
          <div className="lp-hero__label lp-hero__label--bottom-left">
            <span className="lp-hero__label-icon">∞</span>
            Infinite canvas
          </div>
          <div className="lp-hero__label lp-hero__label--bottom-right">
            <span className="lp-hero__label-icon">↗</span>
            Export anywhere
          </div>
          <div className="lp-hero__label lp-hero__label--mid-left">
            <span className="lp-hero__label-icon">✧</span>
            No clutter
          </div>
        </div>
      </div>
    </section>
  )
}
