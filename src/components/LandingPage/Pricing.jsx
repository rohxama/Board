export default function Pricing() {
  return (
    <section className="lp-pricing lp-bg-cream" id="pricing">
      <div className="lp-section">
        <h2 className="lp-section-title">Simple, transparent pricing</h2>
        <p className="lp-section-subtitle">Start free. Upgrade when you're ready.</p>
        <div className="lp-pricing__grid">
          <div className="lp-pricing__card">
            <div className="lp-pricing__badge">Free</div>
            <p className="lp-pricing__desc">Everything you need to get started with visual thinking.</p>
            <ul className="lp-pricing__list">
              <li>Unlimited boards</li>
              <li>Core tools</li>
              <li>Export to PNG</li>
              <li>Up to 3 collaborators</li>
            </ul>
            <a href="#/board" className="lp-btn lp-btn-primary lp-pricing__cta">Start for free</a>
          </div>
          <div className="lp-pricing__card lp-pricing__card--pro">
            <div className="lp-pricing__badge lp-pricing__badge--pro">Pro</div>
            <span className="lp-pricing__coming-soon">Coming soon</span>
            <p className="lp-pricing__desc">More power, more control for growing teams.</p>
            <ul className="lp-pricing__list">
              <li>Everything in Free</li>
              <li>More export options</li>
              <li>Team features</li>
              <li>Priority support</li>
              <li>Advanced capabilities</li>
            </ul>
            <button className="lp-btn lp-btn-secondary lp-pricing__cta" disabled>Join the waitlist</button>
          </div>
        </div>
      </div>
    </section>
  )
}
