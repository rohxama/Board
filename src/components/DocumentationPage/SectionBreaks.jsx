/* Section transition components — chapter openers for major doc sections.
   Each illustration depicts a mini canvas snapshot showing realistic content. */

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
      <rect x="4" y="6" width="112" height="44" rx="4" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <rect x="8" y="10" width="18" height="36" rx="3" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <rect x="10" y="12" width="14" height="8" rx="2" fill={A.accentSoft} stroke={A.accent} strokeWidth="0.6" />
      <path d="M14 26 L16 30 L18 27" fill="none" stroke={A.blue} strokeWidth="0.6" strokeLinecap="round" />
      <rect x="10" y="32" width="14" height="8" rx="1.5" fill="none" stroke={A.green} strokeWidth="0.6" />
      <rect x="32" y="12" width="28" height="16" rx="2" fill="rgba(47,133,90,0.06)" stroke={A.green} strokeWidth="0.8" />
      <text x="46" y="23" textAnchor="middle" fontSize="5" fontWeight="500" fontFamily="system-ui" fill={A.green}>Start</text>
      <path d="M64 20 L72 20" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />
      <path d="M70 18 L74 20 L70 22" fill="none" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />
      <circle cx="84" cy="20" r="8" fill="rgba(69,133,209,0.05)" stroke={A.blue} strokeWidth="0.8" />
      <text x="84" y="22" textAnchor="middle" fontSize="5" fontWeight="500" fontFamily="system-ui" fill={A.blue}>Do</text>
      <rect x="32" y="32" width="24" height="14" rx="1" fill="#fefce8" stroke="#eab308" strokeWidth="0.4" />
      <text x="38" y="41" fontSize="4" fontFamily="system-ui" fill="#854d0e">Notes</text>
    </svg>
  )
}

/* ─── Zoom: Navigate the canvas ───────────────────────────────────── */
function ZoomBreakIllustration() {
  return (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-section-break-svg" aria-hidden="true">
      <rect x="4" y="6" width="112" height="44" rx="4" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      {[20,36,52,68,84,100].map(x => (
        <line key={`v${x}`} x1={x} y1="10" x2={x} y2="46" stroke={A.muted} strokeWidth="0.2" opacity="0.15" />
      ))}
      {[16,28,40].map(y => (
        <line key={`h${y}`} x1="8" y1={y} x2="112" y2={y} stroke={A.muted} strokeWidth="0.2" opacity="0.15" />
      ))}
      <rect x="16" y="14" width="40" height="20" rx="2" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="0.8" />
      <text x="36" y="27" textAnchor="middle" fontSize="5" fontWeight="500" fontFamily="system-ui" fill={A.blue}>Design</text>
      <circle cx="82" cy="24" r="12" fill="rgba(212,148,58,0.05)" stroke={A.orange} strokeWidth="0.8" />
      <text x="82" y="27" textAnchor="middle" fontSize="5" fontWeight="500" fontFamily="system-ui" fill={A.orange}>Ship</text>
      <path d="M58 24 L68 24" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />
      <path d="M65 21 L70 24 L65 27" fill="none" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />
      <rect x="86" y="34" width="22" height="8" rx="2" fill={A.accentSoft} />
      <text x="97" y="40" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.accent}>200%</text>
    </svg>
  )
}

/* ─── Styling: Shape your vision ──────────────────────────────────── */
function StylingBreakIllustration() {
  return (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-section-break-svg" aria-hidden="true">
      <rect x="4" y="6" width="112" height="44" rx="4" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <rect x="12" y="12" width="28" height="18" rx="2" fill="rgba(47,133,90,0.08)" stroke={A.green} strokeWidth="0.8" />
      <text x="26" y="24" textAnchor="middle" fontSize="5" fontWeight="500" fontFamily="system-ui" fill={A.green}>Solid</text>
      <rect x="46" y="12" width="28" height="18" rx="2" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="0.8" strokeDasharray="4 2" />
      <text x="60" y="24" textAnchor="middle" fontSize="5" fontWeight="500" fontFamily="system-ui" fill={A.blue}>Dash</text>
      <rect x="80" y="12" width="28" height="18" rx="2" fill="rgba(212,148,58,0.05)" stroke={A.orange} strokeWidth="1.5" />
      <text x="94" y="24" textAnchor="middle" fontSize="5" fontWeight="500" fontFamily="system-ui" fill={A.orange}>Bold</text>
      <rect x="12" y="36" width="36" height="10" rx="2" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="0.6" strokeDasharray="3 2" />
      <rect x="56" y="36" width="24" height="10" rx="1" fill="#fefce8" stroke="#eab308" strokeWidth="0.4" />
      <text x="62" y="44" fontSize="4" fontFamily="system-ui" fill="#854d0e">Note</text>
      <circle cx="96" cy="41" r="6" fill="rgba(139,92,246,0.06)" stroke={A.purple} strokeWidth="0.8" />
    </svg>
  )
}

/* ─── Export: Share your work ──────────────────────────────────────── */
function ExportBreakIllustration() {
  return (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-section-break-svg" aria-hidden="true">
      <rect x="4" y="6" width="44" height="44" rx="3" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <rect x="10" y="12" width="20" height="12" rx="1.5" fill="rgba(47,133,90,0.06)" stroke={A.green} strokeWidth="0.6" />
      <text x="20" y="21" textAnchor="middle" fontSize="4" fontWeight="500" fontFamily="system-ui" fill={A.green}>A</text>
      <path d="M34 18 L42 18" stroke={A.muted} strokeWidth="0.4" strokeLinecap="round" />
      <rect x="10" y="30" width="20" height="12" rx="1.5" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="0.6" />
      <text x="20" y="39" textAnchor="middle" fontSize="4" fontWeight="500" fontFamily="system-ui" fill={A.blue}>B</text>
      <path d="M52 28 L62 28" stroke={A.accent} strokeWidth="1" strokeLinecap="round" />
      <path d="M59 25 L64 28 L59 31" fill="none" stroke={A.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="68" y="8" width="20" height="14" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="78" y="18" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.green}>PNG</text>
      <rect x="92" y="8" width="20" height="14" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="102" y="18" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.orange}>PDF</text>
      <rect x="68" y="26" width="20" height="14" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="78" y="36" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.blue}>SVG</text>
      <rect x="92" y="26" width="20" height="14" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="102" y="36" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.purple}>JSON</text>
    </svg>
  )
}

/* ─── Shortcuts: Speed up workflow ────────────────────────────────── */
function ShortcutsBreakIllustration() {
  return (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-section-break-svg" aria-hidden="true">
      <rect x="4" y="6" width="112" height="44" rx="4" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <rect x="12" y="12" width="32" height="16" rx="2" fill="rgba(47,133,90,0.05)" stroke={A.green} strokeWidth="0.6" />
      <text x="28" y="23" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill={A.green}>Plan</text>
      <circle cx="72" cy="20" r="10" fill="rgba(69,133,209,0.04)" stroke={A.blue} strokeWidth="0.6" />
      <text x="72" y="23" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill={A.blue}>Idea</text>
      <path d="M46 20 L58 20" stroke={A.muted} strokeWidth="0.4" strokeLinecap="round" />
      <rect x="16" y="34" width="14" height="10" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="23" y="42" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.muted}>V</text>
      <rect x="34" y="34" width="14" height="10" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="41" y="42" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.muted}>R</text>
      <rect x="52" y="34" width="14" height="10" rx="2" fill={A.accentSoft} stroke={A.accent} strokeWidth="0.6" />
      <text x="59" y="42" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.accent}>⌘</text>
      <rect x="70" y="34" width="14" height="10" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="77" y="42" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Z</text>
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
