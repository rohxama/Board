/* Lightweight SVG illustrations for the Kanvas documentation.
   Each illustration is a self-contained SVG that inherits colors
   from the design system where practical. */

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

/* ─── Getting Started ───────────────────────────────────────────── */
export function GettingStartedIllustration() {
  return (
    <svg viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      {/* Canvas background */}
      <rect x="20" y="10" width="360" height="160" rx="12" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Dot grid */}
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 16 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={44 + col * 22} cy={34 + row * 18} r="1" fill={A.muted} opacity="0.3" />
        ))
      )}

      {/* Rectangle shape */}
      <rect x="60" y="40" width="72" height="52" rx="4" fill={A.accentSoft} stroke={A.green} strokeWidth="2" />

      {/* Circle shape */}
      <circle cx="220" cy="68" r="32" fill="rgba(69, 133, 209, 0.1)" stroke={A.blue} strokeWidth="2" />

      {/* Arrow */}
      <path d="M160 100 L280 56" stroke={A.orange} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M272 50 L282 56 L270 62" stroke={A.orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Selection handles on rectangle */}
      <rect x="56" y="36" width="8" height="8" rx="1.5" fill={A.green} />
      <rect x="128" y="36" width="8" height="8" rx="1.5" fill={A.green} />
      <rect x="56" y="88" width="8" height="8" rx="1.5" fill={A.green} />
      <rect x="128" y="88" width="8" height="8" rx="1.5" fill={A.green} />

      {/* Cursor */}
      <path d="M300 120 L308 140 L314 132 L324 136 L300 120Z" fill={A.text} stroke={A.surface} strokeWidth="1.5" />

      {/* Small text lines */}
      <rect x="170" y="120" width="80" height="6" rx="3" fill={A.muted} opacity="0.2" />
      <rect x="170" y="134" width="56" height="6" rx="3" fill={A.muted} opacity="0.15" />
    </svg>
  )
}

/* ─── Tools ──────────────────────────────────────────────────────── */
export function ToolsIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      {/* Tool grid background */}
      <rect x="20" y="10" width="360" height="140" rx="12" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Tool 1: Cursor/Select */}
      <g transform="translate(50, 30)">
        <rect width="68" height="56" rx="8" fill={A.accentSoft} />
        <path d="M24 18 L32 38 L36 30 L46 34 L24 18Z" fill={A.green} />
      </g>

      {/* Tool 2: Pen/Pencil */}
      <g transform="translate(134, 30)">
        <rect width="68" height="56" rx="8" fill="rgba(69, 133, 209, 0.1)" />
        <path d="M20 42 L26 22 L42 14 L48 34 L32 42 Z" stroke={A.blue} strokeWidth="2" fill="none" />
        <path d="M24 20 L28 38" stroke={A.blue} strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Tool 3: Shape */}
      <g transform="translate(218, 30)">
        <rect width="68" height="56" rx="8" fill="rgba(212, 148, 58, 0.1)" />
        <rect x="16" y="14" width="36" height="28" rx="4" stroke={A.orange} strokeWidth="2" fill="none" />
      </g>

      {/* Tool 4: Eraser */}
      <g transform="translate(302, 30)">
        <rect width="68" height="56" rx="8" fill="rgba(220, 69, 69, 0.08)" />
        <rect x="18" y="18" width="32" height="20" rx="4" stroke={A.red} strokeWidth="2" fill="none" />
        <path d="M18 32 L50 32" stroke={A.red} strokeWidth="1.5" strokeDasharray="3 2" />
      </g>

      {/* Keyboard shortcuts */}
      <g transform="translate(50, 100)">
        <rect width="28" height="22" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="14" y="15" textAnchor="middle" fontSize="10" fontWeight="700" fill={A.muted}>V</text>
      </g>
      <g transform="translate(134, 100)">
        <rect width="28" height="22" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="14" y="15" textAnchor="middle" fontSize="10" fontWeight="700" fill={A.muted}>P</text>
      </g>
      <g transform="translate(218, 100)">
        <rect width="28" height="22" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="14" y="15" textAnchor="middle" fontSize="10" fontWeight="700" fill={A.muted}>R</text>
      </g>
      <g transform="translate(302, 100)">
        <rect width="28" height="22" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="14" y="15" textAnchor="middle" fontSize="10" fontWeight="700" fill={A.muted}>E</text>
      </g>

      {/* Dotted connection line */}
      <path d="M84 92 L168 92 L252 92 L336 92" stroke={A.muted} strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
    </svg>
  )
}

/* ─── Styling ────────────────────────────────────────────────────── */
export function StylingIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      {/* Background */}
      <rect x="20" y="10" width="360" height="140" rx="12" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Color swatches row */}
      <circle cx="60" cy="44" r="14" fill={A.green} />
      <circle cx="100" cy="44" r="14" fill={A.blue} />
      <circle cx="140" cy="44" r="14" fill={A.orange} />
      <circle cx="180" cy="44" r="14" fill={A.red} />
      <circle cx="220" cy="44" r="14" fill={A.yellow} />
      <circle cx="260" cy="44" r="14" fill={A.purple} />

      {/* Selected swatch indicator */}
      <circle cx="60" cy="44" r="17" stroke={A.green} strokeWidth="2.5" fill="none" />

      {/* Style panel mockup */}
      <rect x="300" y="20" width="72" height="120" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
      <rect x="310" y="30" width="52" height="8" rx="4" fill={A.muted} opacity="0.2" />
      <rect x="310" y="46" width="52" height="24" rx="4" fill={A.accentSoft} />
      <rect x="310" y="78" width="52" height="8" rx="4" fill={A.muted} opacity="0.2" />
      <rect x="310" y="94" width="52" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />

      {/* Shape with style applied */}
      <rect x="50" y="80" width="100" height="60" rx="6" fill="rgba(69, 133, 209, 0.15)" stroke={A.blue} strokeWidth="3" strokeDasharray="8 4" />

      {/* Opacity slider mockup */}
      <rect x="180" y="90" width="100" height="6" rx="3" fill={A.muted} opacity="0.15" />
      <rect x="180" y="90" width="60" height="6" rx="3" fill={A.accent} />
      <circle cx="240" cy="93" r="6" fill={A.surface} stroke={A.accent} strokeWidth="2" />

      <rect x="180" y="108" width="60" height="6" rx="3" fill={A.muted} opacity="0.15" />
      <rect x="180" y="108" width="36" height="6" rx="3" fill={A.orange} />

      <rect x="180" y="126" width="80" height="6" rx="3" fill={A.muted} opacity="0.15" />
      <rect x="180" y="126" width="48" height="6" rx="3" fill={A.purple} />
    </svg>
  )
}

/* ─── Themes ─────────────────────────────────────────────────────── */
export function ThemesIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      {/* Split background — light and dark */}
      <clipPath id="theme-clip">
        <rect x="20" y="10" width="180" height="140" rx="12" />
      </clipPath>
      <clipPath id="theme-clip-dark">
        <rect x="200" y="10" width="180" height="140" rx="12" />
      </clipPath>

      {/* Light side */}
      <g clipPath="url(#theme-clip)">
        <rect x="20" y="10" width="180" height="140" fill="#f7f8fc" stroke={A.border} strokeWidth="1.5" />
        {/* Sun */}
        <circle cx="110" cy="56" r="18" fill={A.yellow} opacity="0.9" />
        <g stroke={A.yellow} strokeWidth="2" strokeLinecap="round">
          <line x1="110" y1="28" x2="110" y2="22" />
          <line x1="110" y1="90" x2="110" y2="84" />
          <line x1="82" y1="56" x2="76" y2="56" />
          <line x1="138" y1="56" x2="144" y2="56" />
          <line x1="90" y1="36" x2="86" y2="32" />
          <line x1="130" y1="76" x2="134" y2="80" />
          <line x1="90" y1="76" x2="86" y2="80" />
          <line x1="130" y1="36" x2="134" y2="32" />
        </g>
        {/* Light canvas elements */}
        <rect x="40" y="100" width="40" height="28" rx="3" fill="rgba(47, 133, 90, 0.15)" stroke={A.green} strokeWidth="1.5" />
        <circle cx="150" cy="114" r="14" fill="rgba(69, 133, 209, 0.12)" stroke={A.blue} strokeWidth="1.5" />
        <text x="110" y="145" textAnchor="middle" fontSize="10" fontWeight="600" fill={A.muted}>Light</text>
      </g>

      {/* Dark side */}
      <g clipPath="url(#theme-clip-dark)">
        <rect x="200" y="10" width="180" height="140" fill="#181b22" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        {/* Moon */}
        <path d="M290 42 A20 20 0 1 1 278 72 A16 16 0 0 0 290 42Z" fill="#e2e8f0" />
        {/* Dark canvas elements */}
        <rect x="220" y="100" width="40" height="28" rx="3" fill="rgba(82, 189, 107, 0.15)" stroke={A.greenLight} strokeWidth="1.5" />
        <circle cx="330" cy="114" r="14" fill="rgba(107, 163, 232, 0.12)" stroke={A.blueLight} strokeWidth="1.5" />
        <text x="290" y="145" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.5)">Dark</text>
      </g>

      {/* Divider */}
      <line x1="200" y1="18" x2="200" y2="142" stroke={A.border} strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  )
}

/* ─── Export ──────────────────────────────────────────────────────── */
export function ExportIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      {/* Background */}
      <rect x="20" y="10" width="360" height="140" rx="12" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Canvas representation */}
      <rect x="40" y="30" width="120" height="80" rx="6" fill={A.accentSoft} stroke={A.green} strokeWidth="1.5" />
      <rect x="52" y="42" width="40" height="24" rx="3" fill="rgba(69, 133, 209, 0.2)" stroke={A.blue} strokeWidth="1.5" />
      <circle cx="120" cy="54" r="14" fill="rgba(212, 148, 58, 0.15)" stroke={A.orange} strokeWidth="1.5" />
      <path d="M60 82 L100 70" stroke={A.purple} strokeWidth="2" strokeLinecap="round" />

      {/* Export arrow */}
      <path d="M180 70 L220 70" stroke={A.accent} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M214 64 L224 70 L214 76" stroke={A.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Format cards */}
      <g transform="translate(240, 24)">
        <rect width="56" height="36" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="28" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill={A.muted}>PNG</text>
        <rect x="12" y="22" width="32" height="4" rx="2" fill={A.green} opacity="0.4" />
      </g>
      <g transform="translate(310, 24)">
        <rect width="56" height="36" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="28" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill={A.muted}>PDF</text>
        <rect x="12" y="22" width="32" height="4" rx="2" fill={A.red} opacity="0.4" />
      </g>
      <g transform="translate(240, 72)">
        <rect width="56" height="36" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="28" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill={A.muted}>SVG</text>
        <rect x="12" y="22" width="32" height="4" rx="2" fill={A.blue} opacity="0.4" />
      </g>
      <g transform="translate(310, 72)">
        <rect width="56" height="36" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="28" y="16" textAnchor="middle" fontSize="9" fontWeight="700" fill={A.muted}>JSON</text>
        <rect x="12" y="22" width="32" height="4" rx="2" fill={A.purple} opacity="0.4" />
      </g>

      {/* Download indicator */}
      <path d="M338 120 L338 130 M333 126 L338 131 L343 126" stroke={A.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ─── Tips ───────────────────────────────────────────────────────── */
export function TipsIllustration() {
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      {/* Background */}
      <rect x="20" y="10" width="360" height="120" rx="12" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Lightbulb shape — geometric composition */}
      <g transform="translate(80, 24)">
        {/* Bulb */}
        <circle cx="40" cy="32" r="24" fill="rgba(234, 179, 8, 0.12)" stroke={A.yellow} strokeWidth="2" />
        {/* Filament */}
        <path d="M32 32 Q40 20 48 32 Q40 44 32 32Z" fill="none" stroke={A.yellow} strokeWidth="1.5" />
        {/* Base */}
        <rect x="30" y="56" width="20" height="8" rx="2" fill={A.yellow} opacity="0.3" />
        <rect x="32" y="64" width="16" height="4" rx="2" fill={A.yellow} opacity="0.2" />
        {/* Rays */}
        <line x1="40" y1="0" x2="40" y2="-6" stroke={A.yellow} strokeWidth="2" strokeLinecap="round" />
        <line x1="68" y1="32" x2="74" y2="32" stroke={A.yellow} strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="32" x2="6" y2="32" stroke={A.yellow} strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="12" x2="64" y2="8" stroke={A.yellow} strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="12" x2="16" y2="8" stroke={A.yellow} strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Tip cards */}
      <g transform="translate(180, 20)">
        <rect width="180" height="32" rx="6" fill={A.accentSoft} />
        <circle cx="20" cy="16" r="6" fill={A.green} opacity="0.6" />
        <rect x="34" y="12" width="80" height="5" rx="2.5" fill={A.muted} opacity="0.2" />
        <rect x="34" y="21" width="50" height="4" rx="2" fill={A.muted} opacity="0.12" />
      </g>
      <g transform="translate(180, 60)">
        <rect width="180" height="32" rx="6" fill="rgba(69, 133, 209, 0.08)" />
        <circle cx="20" cy="16" r="6" fill={A.blue} opacity="0.6" />
        <rect x="34" y="12" width="70" height="5" rx="2.5" fill={A.muted} opacity="0.2" />
        <rect x="34" y="21" width="60" height="4" rx="2" fill={A.muted} opacity="0.12" />
      </g>
      <g transform="translate(180, 100)">
        <rect width="180" height="24" rx="6" fill="rgba(212, 148, 58, 0.08)" />
        <circle cx="20" cy="12" r="5" fill={A.orange} opacity="0.6" />
        <rect x="34" y="9" width="90" height="4" rx="2" fill={A.muted} opacity="0.2" />
      </g>
    </svg>
  )
}

/* ─── FAQ ────────────────────────────────────────────────────────── */
export function FAQIllustration() {
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      {/* Background */}
      <rect x="20" y="10" width="360" height="120" rx="12" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Question mark — composed of dots */}
      <g transform="translate(60, 24)">
        <circle cx="30" cy="16" r="8" fill={A.accent} opacity="0.8" />
        <circle cx="48" cy="12" r="6" fill={A.blue} opacity="0.6" />
        <circle cx="56" cy="28" r="7" fill={A.orange} opacity="0.6" />
        <circle cx="44" cy="36" r="5" fill={A.purple} opacity="0.5" />
        <circle cx="36" cy="48" r="4" fill={A.green} opacity="0.7" />
        <circle cx="44" cy="60" r="6" fill={A.yellow} opacity="0.6" />
        <circle cx="44" cy="78" r="5" fill={A.accent} opacity="0.5" />
        {/* Connecting lines */}
        <path d="M30 16 Q48 12 56 28 Q44 36 36 48 Q44 60 44 78" stroke={A.muted} strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
      </g>

      {/* Accordion mockup */}
      <g transform="translate(160, 20)">
        {/* Item 1 — open */}
        <rect width="210" height="36" rx="8" fill={A.accentSoft} stroke={A.accent} strokeWidth="1.5" />
        <rect x="14" y="12" width="120" height="5" rx="2.5" fill={A.muted} opacity="0.25" />
        <text x="190" y="22" textAnchor="middle" fontSize="14" fill={A.accent}>−</text>
        <rect x="14" y="24" width="160" height="4" rx="2" fill={A.muted} opacity="0.12" />

        {/* Item 2 — closed */}
        <rect y="44" width="210" height="32" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <rect x="14" y="56" width="100" height="5" rx="2.5" fill={A.muted} opacity="0.2" />
        <text x="190" y="64" textAnchor="middle" fontSize="14" fill={A.muted}>+</text>

        {/* Item 3 — closed */}
        <rect y="82" width="210" height="32" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <rect x="14" y="94" width="130" height="5" rx="2.5" fill={A.muted} opacity="0.2" />
        <text x="190" y="102" textAnchor="middle" fontSize="14" fill={A.muted}>+</text>
      </g>
    </svg>
  )
}
