const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Use Cases', href: '#use-cases' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Open board', href: '#/board' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Documentation', href: '#/docs' },
      { label: 'Keyboard shortcuts', href: '#/docs' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="lp-footer" id="footer">
      <div className="lp-container">
        <div className="lp-footer__inner">
          <div className="lp-footer__brand">
            <a href="#/" className="lp-footer__logo">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="#171717"/>
                <path d="M8 20V8l6 6 6-6v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Kanvas</span>
            </a>
            <p className="lp-footer__tagline">
              A focused whiteboard for turning loose ideas into clear visuals.
            </p>
          </div>
          {footerColumns.map(col => (
            <div key={col.title} className="lp-footer__column">
              <h4 className="lp-footer__column-title">{col.title}</h4>
              <ul className="lp-footer__links">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="lp-footer__link">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="lp-footer__bottom">
          <p className="lp-footer__copyright">© 2026 Kanvas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
