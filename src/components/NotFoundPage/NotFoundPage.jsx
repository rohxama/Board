/* 404 page shown for the temporary placeholder routes (Home → '#/home',
   Learn → '#/docs') until the real pages exist. When building the real
   Home / Documentation pages, swap the route rendering in App.jsx. */
export default function NotFoundPage({ message = "Oops! The page you're looking for can't be found. It might have been moved or the URL could be incorrect." }) {
  return (
    <div className="not-found-page">
      <div className="not-found-tag not-found-tag-top" aria-hidden="true">404</div>
      <h1 className="not-found-hero" aria-label="404 — page not found">
        <span className="not-found-digit" aria-hidden="true">4</span>
        <span className="not-found-face" aria-hidden="true">
          <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
            <g stroke="#101010" strokeWidth="7.5" strokeLinecap="round" fill="none">
              <path d="M23 28 L39 44" />
              <path d="M39 28 L23 44" />
              <path d="M61 28 L77 44" />
              <path d="M77 28 L61 44" />
              <circle cx="50" cy="64" r="6.5" strokeWidth="6.5" />
            </g>
          </svg>
        </span>
        <span className="not-found-digit" aria-hidden="true">4</span>
      </h1>
      <p className="not-found-message">{message}</p>
      <div className="not-found-tag not-found-tag-bottom" aria-hidden="true">404</div>
      <div className="not-found-bottom-line" aria-hidden="true" />
    </div>
  )
}
