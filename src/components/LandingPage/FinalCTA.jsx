export default function FinalCTA() {
  return (
    <section className="lp-final-cta lp-bg-lavender">
      <div className="lp-section">
        <div className="lp-final-cta__content">
          <h2 className="lp-final-cta__title">Turn blank space into<br />something brilliant.</h2>
          <p className="lp-final-cta__copy">
            Start with an empty canvas. Leave with an idea worth sharing.
          </p>
          <a href="#/board" className="lp-btn lp-btn-primary">Start creating free</a>
          <div className="lp-final-cta__flow">
            <span className="lp-final-cta__step">Dream</span>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <path d="M2 6H20" stroke="#171717" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round"/>
              <path d="M16 2L22 6L16 10" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="lp-final-cta__step">Plan</span>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <path d="M2 6H20" stroke="#171717" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round"/>
              <path d="M16 2L22 6L16 10" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="lp-final-cta__step">Create</span>
          </div>
        </div>
      </div>
    </section>
  )
}
