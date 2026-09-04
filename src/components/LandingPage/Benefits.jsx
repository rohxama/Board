const benefits = [
  {
    title: 'Clean & simple',
    desc: 'A clutter-free interface that helps you focus.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="10" cy="10" r="7"/>
        <path d="M10 6V10L13 13"/>
      </svg>
    ),
  },
  {
    title: 'Blazing fast',
    desc: 'Built for smooth visual work.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2L4 12H10L8 18L16 8H10L12 2"/>
      </svg>
    ),
  },
  {
    title: 'Works anywhere',
    desc: 'Your workspace is ready when inspiration hits.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="10" cy="10" r="7"/>
        <path d="M3 10H17"/>
        <path d="M10 3C12 6 12 14 10 17"/>
        <path d="M10 3C8 6 8 14 10 17"/>
      </svg>
    ),
  },
  {
    title: 'Privacy first',
    desc: 'Your ideas should remain yours.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="9" width="12" height="9" rx="2"/>
        <path d="M7 9V6C7 4 8.5 2 10 2C11.5 2 13 4 13 6V9"/>
      </svg>
    ),
  },
  {
    title: 'Designed for teams',
    desc: 'Collaborate visually when your workflow requires it.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="7" cy="7" r="3"/>
        <circle cx="14" cy="7" r="3"/>
        <path d="M2 17C2 14 4 12 7 12"/>
        <path d="M18 17C18 14 16 12 13 12"/>
      </svg>
    ),
  },
  {
    title: 'Always improving',
    desc: 'A product that evolves around real user feedback.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2V18"/>
        <path d="M4 6L10 2L16 6"/>
        <path d="M4 14L10 18L16 14"/>
      </svg>
    ),
  },
]

export default function Benefits() {
  return (
    <section className="lp-benefits lp-bg-cream">
      <div className="lp-section">
        <div className="lp-benefits__card">
          <div className="lp-benefits__header">
            <h2 className="lp-benefits__title">Everything you need.<br />Nothing you don't.</h2>
            <p className="lp-benefits__copy">
              Kanvas is fast, simple and delightful to use — so you can focus on your ideas, not the tool.
            </p>
            <a href="#/board" className="lp-btn lp-btn-primary">Start creating free</a>
          </div>
          <div className="lp-benefits__grid">
            {benefits.map(b => (
              <div key={b.title} className="lp-benefits__item">
                <div className="lp-benefits__icon">{b.icon}</div>
                <div>
                  <h4 className="lp-benefits__item-title">{b.title}</h4>
                  <p className="lp-benefits__item-desc">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
