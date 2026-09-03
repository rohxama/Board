/* Section transition components — chapter openers for major doc sections.
   Each break: small label + large heading + description + SVG illustration. */

const A = {
  green: '#2f855a',
  greenLight: '#52bd6b',
  blue: '#4585d1',
  blueLight: '#6ba3e8',
  orange: '#d4943a',
  orangeLight: '#e8b06a',
  red: '#dc4545',
  yellow: '#eab308',
  purple: '#8b5cf6',
  purpleLight: '#a78bfa',
  text: 'var(--text)',
  muted: 'var(--text-muted)',
  border: 'var(--border)',
  surface: 'var(--surface-solid)',
  accent: 'var(--accent)',
  accentSoft: 'var(--accent-soft)',
}

function SectionBreak({ label, heading, description, illustration, accent = 'green' }) {
  const accentVar = `var(--accent-${accent})`
  return (
    <div className={`doc-section-break doc-section-break--${accent}`} role="presentation">
      <div className="doc-section-break-content">
        <span className="doc-section-break-label" style={{ color: accentVar }}>{label}</span>
        <h2 className="doc-section-break-heading">{heading}</h2>
        {description && <p className="doc-section-break-desc">{description}</p>}
      </div>
      {illustration && (
        <div className="doc-section-break-visual">
          {illustration}
        </div>
      )}
      <div className="doc-section-break-line" style={{ background: accentVar }} />
    </div>
  )
}

/* ─── Tools: Explore the toolbox ──────────────────────────────────── */
function ToolsBreakIllustration() {
  return (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-section-break-svg" aria-hidden="true">
      {/* Tool icons floating */}
      <rect x="4" y="8" width="28" height="28" rx="6" fill={A.accentSoft} stroke={A.green} strokeWidth="1.5" />
      <path d="M14 18 L18 26 L20 23 L24 25 L14 18Z" fill={A.green} />

      <rect x="38" y="4" width="28" height="28" rx="6" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="1.5" />
      <rect x="44" y="10" width="16" height="12" rx="2" stroke={A.blue} strokeWidth="1.5" fill="none" />

      <rect x="72" y="8" width="28" height="28" rx="6" fill="rgba(212,148,58,0.1)" stroke={A.orange} strokeWidth="1.5" />
      <circle cx="86" cy="22" r="7" stroke={A.orange} strokeWidth="1.5" fill="none" />

      <rect x="106" y="14" width="10" height="10" rx="2" fill={A.purple} opacity="0.5" />

      {/* Connecting dotted line */}
      <path d="M18 40 L32 40 L48 40 L62 40 L78 40 L92 40" stroke={A.muted} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
    </svg>
  )
}

/* ─── Zoom: Navigate the canvas ───────────────────────────────────── */
function ZoomBreakIllustration() {
  return (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-section-break-svg" aria-hidden="true">
      {/* Magnifying glass */}
      <circle cx="40" cy="24" r="16" stroke={A.blue} strokeWidth="2" fill="rgba(69,133,209,0.06)" />
      <circle cx="40" cy="24" r="10" stroke={A.blue} strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.4" />
      <line x1="52" y1="36" x2="64" y2="48" stroke={A.blue} strokeWidth="2.5" strokeLinecap="round" />

      {/* Plus / minus indicators */}
      <path d="M36 24 L44 24" stroke={A.green} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 20 L40 28" stroke={A.green} strokeWidth="1.5" strokeLinecap="round" />

      {/* Canvas shapes in view */}
      <rect x="72" y="12" width="24" height="16" rx="3" fill="rgba(212,148,58,0.1)" stroke={A.orange} strokeWidth="1" />
      <circle cx="110" cy="22" r="8" fill="rgba(139,92,246,0.08)" stroke={A.purple} strokeWidth="1" />

      {/* Zoom percentage */}
      <rect x="78" y="36" width="28" height="10" rx="3" fill={A.accentSoft} />
      <text x="92" y="44" textAnchor="middle" fontSize="7" fontWeight="700" fill={A.green}>150%</text>
    </svg>
  )
}

/* ─── Styling: Shape your vision ──────────────────────────────────── */
function StylingBreakIllustration() {
  return (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-section-break-svg" aria-hidden="true">
      {/* Color swatches */}
      <circle cx="16" cy="16" r="8" fill={A.green} />
      <circle cx="36" cy="16" r="8" fill={A.blue} />
      <circle cx="56" cy="16" r="8" fill={A.orange} />
      <circle cx="76" cy="16" r="8" fill={A.purple} />
      {/* Selected ring */}
      <circle cx="36" cy="16" r="11" stroke={A.blue} strokeWidth="2" fill="none" />

      {/* Styled shape below */}
      <rect x="12" y="32" width="36" height="20" rx="4" fill="rgba(69,133,209,0.15)" stroke={A.blue} strokeWidth="2" strokeDasharray="6 3" />

      {/* Opacity slider */}
      <rect x="58" y="40" width="40" height="4" rx="2" fill={A.muted} opacity="0.15" />
      <rect x="58" y="40" width="24" height="4" rx="2" fill={A.accent} />
      <circle cx="82" cy="42" r="4" fill={A.surface} stroke={A.accent} strokeWidth="1.5" />

      {/* Corner radius indicator */}
      <rect x="58" y="32" width="12" height="12" rx="3" fill="none" stroke={A.orange} strokeWidth="1.5" />
    </svg>
  )
}

/* ─── Export: Share your work ──────────────────────────────────────── */
function ExportBreakIllustration() {
  return (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-section-break-svg" aria-hidden="true">
      {/* Board representation */}
      <rect x="4" y="8" width="44" height="32" rx="4" fill={A.accentSoft} stroke={A.green} strokeWidth="1.5" />
      <rect x="10" y="14" width="14" height="10" rx="2" fill="rgba(69,133,209,0.15)" stroke={A.blue} strokeWidth="1" />
      <circle cx="38" cy="19" r="6" fill="rgba(212,148,58,0.12)" stroke={A.orange} strokeWidth="1" />

      {/* Arrow */}
      <path d="M54 24 L66 24" stroke={A.accent} strokeWidth="2" strokeLinecap="round" />
      <path d="M63 21 L68 24 L63 27" fill="none" stroke={A.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Format cards */}
      <rect x="74" y="6" width="18" height="14" rx="3" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <text x="83" y="16" textAnchor="middle" fontSize="6" fontWeight="700" fill={A.green}>PNG</text>

      <rect x="96" y="6" width="18" height="14" rx="3" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <text x="105" y="16" textAnchor="middle" fontSize="6" fontWeight="700" fill={A.orange}>PDF</text>

      <rect x="74" y="24" width="18" height="14" rx="3" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <text x="83" y="34" textAnchor="middle" fontSize="6" fontWeight="700" fill={A.blue}>SVG</text>

      <rect x="96" y="24" width="18" height="14" rx="3" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <text x="105" y="34" textAnchor="middle" fontSize="6" fontWeight="700" fill={A.purple}>JSON</text>
    </svg>
  )
}

/* ─── Shortcuts: Speed up workflow ────────────────────────────────── */
function ShortcutsBreakIllustration() {
  return (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-section-break-svg" aria-hidden="true">
      {/* Keyboard keys */}
      <rect x="8" y="10" width="22" height="18" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
      <text x="19" y="23" textAnchor="middle" fontSize="9" fontWeight="700" fill={A.muted}>V</text>

      <rect x="36" y="10" width="22" height="18" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
      <text x="47" y="23" textAnchor="middle" fontSize="9" fontWeight="700" fill={A.muted}>R</text>

      <rect x="64" y="10" width="22" height="18" rx="4" fill={A.accentSoft} stroke={A.accent} strokeWidth="1.5" />
      <text x="75" y="23" textAnchor="middle" fontSize="9" fontWeight="700" fill={A.accent}>⌘</text>

      <rect x="92" y="10" width="22" height="18" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
      <text x="103" y="23" textAnchor="middle" fontSize="9" fontWeight="700" fill={A.muted}>Z</text>

      {/* Plus signs between keys */}
      <text x="33" y="22" textAnchor="middle" fontSize="8" fill={A.muted} opacity="0.5">+</text>
      <text x="61" y="22" textAnchor="middle" fontSize="8" fill={A.muted} opacity="0.5">+</text>
      <text x="89" y="22" textAnchor="middle" fontSize="8" fill={A.muted} opacity="0.5">+</text>

      {/* Speed lines */}
      <path d="M8 40 L28 40" stroke={A.accent} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M16 44 L36 44" stroke={A.accent} strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
      <path d="M24 48 L44 48" stroke={A.accent} strokeWidth="0.6" strokeLinecap="round" opacity="0.15" />
    </svg>
  )
}

export {
  SectionBreak,
  ToolsBreakIllustration,
  ZoomBreakIllustration,
  StylingBreakIllustration,
  ExportBreakIllustration,
  ShortcutsBreakIllustration,
}
