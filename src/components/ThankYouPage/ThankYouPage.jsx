/* Thank You page — shown at '#/thank-you'. Same design system as the 404 page:
   white background, bright green smiley circle, dark hero text, gray message,
   small green heart at the bottom. */
export default function ThankYouPage() {
  return (
    <div className="thank-you-page">
      <div className="thank-you-tag thank-you-tag-top" aria-hidden="true">Thank You</div>
      <h1 className="thank-you-hero" aria-label="Thank you">
        <span className="thank-you-word" aria-hidden="true">THANK</span>
        <span className="thank-you-face" aria-hidden="true">
          <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
            <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none">
              <path d="M28 36 Q38 24 48 36" />
              <path d="M52 36 Q62 24 72 36" />
              <path d="M33 52 Q50 68 67 52" />
            </g>
          </svg>
        </span>
        <span className="thank-you-word" aria-hidden="true">YOU</span>
      </h1>
      <p className="thank-you-message">
        Your action was completed successfully.<br />
        We appreciate your time and trust.
      </p>
      <div className="thank-you-heart" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}
