const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Use Cases', href: '#use-cases' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Changelog', href: '#/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#/' },
      { label: 'Careers', href: '#/' },
      { label: 'Blog', href: '#/' },
      { label: 'Contact', href: '#/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '#/' },
      { label: 'Tutorials', href: '#/' },
      { label: 'Community', href: '#/' },
      { label: 'Documentation', href: '#/docs' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#/' },
      { label: 'Terms of Service', href: '#/' },
      { label: 'Cookie Policy', href: '#/' },
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
              The infinite whiteboard for thinking, creating and planning visually.
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
