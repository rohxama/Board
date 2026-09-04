const annotations = [
  {
    title: 'Toolbar',
    desc: 'All the tools you need, right where you need them.',
    position: 'top-left',
  },
  {
    title: 'Infinite canvas',
    desc: 'Unlimited space for ideas.',
    position: 'bottom-left',
  },
  {
    title: 'Export',
    desc: 'Save or share your finished work.',
    position: 'top-right',
  },
  {
    title: 'Zoom controls',
    desc: 'Quickly zoom in, zoom out, or fit the whole picture.',
    position: 'bottom-right',
  },
]

export default function ProductShowcase() {
  return (
    <section className="lp-showcase lp-bg-cream" id="showcase">
      <div className="lp-section">
        <h2 className="lp-section-title">A closer look at Kanvas</h2>
        <div className="lp-showcase__visual">
          <div className="lp-showcase__mockup">
            <div className="lp-showcase__mockup-toolbar">
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
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L7 3L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            <div className="lp-showcase__canvas">
              <div className="lp-mockup__title" style={{ top: '8%', left: '50%', transform: 'translateX(-50%)' }}>
                User Flow
              </div>
              <div className="lp-mockup__sticky lp-mockup__sticky--yellow" style={{ top: '25%', left: '10%' }}>
                <span>Landing<br/>page</span>
              </div>
              <div className="lp-mockup__sticky lp-mockup__sticky--pink" style={{ top: '25%', left: '35%' }}>
                <span>Sign up</span>
              </div>
              <div className="lp-mockup__sticky lp-mockup__sticky--green" style={{ top: '25%', right: '15%' }}>
                <span>Onboarding</span>
              </div>
              <div className="lp-mockup__sticky lp-mockup__sticky--blue" style={{ bottom: '20%', left: '20%' }}>
                <span>Welcome<br/>email</span>
              </div>
              <div className="lp-mockup__sticky lp-mockup__sticky--yellow" style={{ bottom: '20%', right: '25%' }}>
                <span>Add<br/>Profile</span>
              </div>
              <svg className="lp-mockup__arrow" style={{ top: '38%', left: '22%' }} width="60" height="30" viewBox="0 0 60 30">
                <path d="M5 15 H50" stroke="#171717" strokeWidth="1.5" strokeDasharray="4 3" fill="none" strokeLinecap="round"/>
                <path d="M45 10 L52 15 L45 20" stroke="#171717" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg className="lp-mockup__arrow" style={{ top: '38%', left: '50%' }} width="60" height="30" viewBox="0 0 60 30">
                <path d="M5 15 H50" stroke="#171717" strokeWidth="1.5" strokeDasharray="4 3" fill="none" strokeLinecap="round"/>
                <path d="M45 10 L52 15 L45 20" stroke="#171717" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="lp-mockup__zoom">
                <span>−</span>
                <span className="lp-mockup__zoom-value">75%</span>
                <span>+</span>
              </div>
            </div>
          </div>

          {annotations.map((a, i) => (
            <div key={a.title} className={`lp-showcase__annotation lp-showcase__annotation--${a.position}`}>
              <div className="lp-showcase__annotation-dot" />
              <div className="lp-showcase__annotation-content">
                <h4 className="lp-showcase__annotation-title">{a.title}</h4>
                <p className="lp-showcase__annotation-desc">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
