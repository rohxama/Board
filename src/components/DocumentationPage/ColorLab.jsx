/* Color Lab — rich visual playground for the Styling section.
   All illustrations use actual Kanvas styling capabilities. */

/* Actual Kanvas palette */
const C = {
  black: '#111111',
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
  blue: '#3b82f6',
  surface: 'var(--surface-solid)',
  muted: 'var(--text-muted)',
  border: 'var(--border)',
  accent: 'var(--accent)',
  accentSoft: 'var(--accent-soft)',
  text: 'var(--text)',
}

/* ─── Section header illustration ──────────────────────────────── */
export function ColorLabHero() {
  return (
    <svg viewBox="0 0 680 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-hero" aria-hidden="true">
      {/* Canvas background with dot grid */}
      <rect x="0" y="0" width="680" height="120" rx="12" fill={C.surface} stroke={C.border} strokeWidth="1" />
      {Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 34 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={16 + col * 20} cy={16 + row * 20} r="0.8" fill={C.muted} opacity="0.15" />
        ))
      )}

      {/* Scattered shapes — a mini whiteboard composition */}
      {/* Blue rectangle */}
      <rect x="30" y="20" width="80" height="55" rx="6" fill="rgba(59,130,246,0.12)" stroke={C.blue} strokeWidth="2" />
      {/* Green circle */}
      <circle cx="180" cy="48" r="30" fill="rgba(34,197,94,0.1)" stroke={C.green} strokeWidth="2" />
      {/* Orange diamond */}
      <path d="M290 18 L320 48 L290 78 L260 48 Z" fill="rgba(249,115,22,0.1)" stroke={C.orange} strokeWidth="2" />
      {/* Red rectangle with rounded corners */}
      <rect x="360" y="24" width="70" height="50" rx="12" fill="rgba(239,68,68,0.1)" stroke={C.red} strokeWidth="2" />
      {/* Yellow ellipse */}
      <ellipse cx="500" cy="48" rx="40" ry="28" fill="rgba(234,179,8,0.1)" stroke={C.yellow} strokeWidth="2" />
      {/* Purple arrow */}
      <path d="M570 30 L640 48 L570 66" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Blue line */}
      <line x1="570" y1="85" x2="650" y2="85" stroke={C.blue} strokeWidth="2" strokeLinecap="round" />

      {/* Small cursor */}
      <path d="M620 100 L626 112 L630 106 L638 108 L620 100Z" fill={C.text} stroke={C.surface} strokeWidth="1" />

      {/* Selection handles on the orange diamond */}
      <rect x="286" y="14" width="8" height="8" rx="2" fill={C.orange} />
      <rect x="316" y="14" width="8" height="8" rx="2" fill={C.orange} />
      <rect x="286" y="74" width="8" height="8" rx="2" fill={C.orange} />
      <rect x="316" y="74" width="8" height="8" rx="2" fill={C.orange} />
    </svg>
  )
}

/* ─── Color Swatches ───────────────────────────────────────────── */
export function SwatchDisplay() {
  const swatches = [
    { color: C.black, label: 'Black' },
    { color: C.red, label: 'Red' },
    { color: C.orange, label: 'Orange' },
    { color: C.yellow, label: 'Yellow' },
    { color: C.green, label: 'Green' },
    { color: C.blue, label: 'Blue' },
  ]

  return (
    <svg viewBox="0 0 380 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-swatch-row" aria-hidden="true">
      {swatches.map((s, i) => (
        <g key={s.color} transform={`translate(${12 + i * 60}, 8)`}>
          <rect width="52" height="52" rx="10" fill={s.color} />
          {/* Shine highlight */}
          <rect x="4" y="4" width="20" height="10" rx="5" fill="white" opacity="0.15" />
          <text x="26" y="72" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>{s.label}</text>
        </g>
      ))}
    </svg>
  )
}

/* ─── Fill Demo ────────────────────────────────────────────────── */
export function FillDemo() {
  return (
    <svg viewBox="0 0 520 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      {/* Label */}
      <text x="0" y="14" fontSize="10" fontWeight="700" letterSpacing="0.08em" fill={C.muted} textTransform="uppercase" fontFamily="system-ui, sans-serif">SHAPE → FILL</text>

      {/* No Fill */}
      <g transform="translate(0, 28)">
        <text x="40" y="0" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>No Fill</text>
        <rect x="4" y="8" width="72" height="52" rx="6" fill="none" stroke={C.blue} strokeWidth="2" />
        <text x="40" y="78" textAnchor="middle" fontSize="9" fill={C.muted}>transparent</text>
      </g>

      {/* Arrow */}
      <path d="M100 60 L120 60" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M116 56 L122 60 L116 64" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Red Fill */}
      <g transform="translate(130, 28)">
        <text x="40" y="0" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Red Fill</text>
        <rect x="4" y="8" width="72" height="52" rx="6" fill="rgba(239,68,68,0.2)" stroke={C.red} strokeWidth="2" />
        <text x="40" y="78" textAnchor="middle" fontSize="9" fill={C.muted}>#ef4444</text>
      </g>

      {/* Arrow */}
      <path d="M230 60 L250 60" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M246 56 L252 60 L246 64" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Green Fill */}
      <g transform="translate(260, 28)">
        <text x="40" y="0" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Green Fill</text>
        <rect x="4" y="8" width="72" height="52" rx="6" fill="rgba(34,197,94,0.15)" stroke={C.green} strokeWidth="2" />
        <text x="40" y="78" textAnchor="middle" fontSize="9" fill={C.muted}>#22c55e</text>
      </g>

      {/* Arrow */}
      <path d="M360 60 L380 60" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M376 56 L382 60 L376 64" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Blue Fill */}
      <g transform="translate(390, 28)">
        <text x="40" y="0" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Blue Fill</text>
        <rect x="4" y="8" width="72" height="52" rx="6" fill="rgba(59,130,246,0.12)" stroke={C.blue} strokeWidth="2" />
        <text x="40" y="78" textAnchor="middle" fontSize="9" fill={C.muted}>#3b82f6</text>
      </g>

      {/* Shapes below — different fill types */}
      <text x="0" y="120" fontSize="10" fontWeight="700" letterSpacing="0.08em" fill={C.muted} fontFamily="system-ui, sans-serif">FILL APPLIES TO: RECTANGLE · ELLIPSE · DIAMOND</text>
      <rect x="0" y="130" width="44" height="24" rx="4" fill="rgba(234,179,8,0.15)" stroke={C.yellow} strokeWidth="1.5" />
      <ellipse x="56" y="130" cx="78" cy="142" rx="22" ry="12" fill="rgba(139,92,246,0.12)" stroke="#8b5cf6" strokeWidth="1.5" />
      <path d="M120 130 L142 142 L120 154 L98 142 Z" fill="rgba(249,115,22,0.12)" stroke={C.orange} strokeWidth="1.5" />
    </svg>
  )
}

/* ─── Stroke Width Demo ────────────────────────────────────────── */
export function StrokeWidthDemo() {
  return (
    <svg viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="10" fontWeight="700" letterSpacing="0.08em" fill={C.muted} fontFamily="system-ui, sans-serif">STROKE WIDTH</text>

      {/* Thin — 1px */}
      <g transform="translate(0, 28)">
        <rect width="100" height="60" rx="6" fill="none" stroke={C.blue} strokeWidth="1" />
        <text x="50" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Thin</text>
        <text x="50" y="92" textAnchor="middle" fontSize="8" fill={C.muted}>1px</text>
      </g>

      {/* Medium — 3px */}
      <g transform="translate(140, 28)">
        <rect width="100" height="60" rx="6" fill="none" stroke={C.green} strokeWidth="3" />
        <text x="50" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Medium</text>
        <text x="50" y="92" textAnchor="middle" fontSize="8" fill={C.muted}>3px</text>
      </g>

      {/* Thick — 6px */}
      <g transform="translate(280, 28)">
        <rect width="100" height="60" rx="6" fill="none" stroke={C.red} strokeWidth="6" />
        <text x="50" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Thick</text>
        <text x="50" y="92" textAnchor="middle" fontSize="8" fill={C.muted}>6px</text>
      </g>

      {/* Comparison — all three on one shape */}
      <g transform="translate(420, 28)">
        <rect x="15" y="0" width="70" height="60" rx="6" fill="none" stroke={C.muted} strokeWidth="1" opacity="0.3" />
        <rect x="15" y="0" width="70" height="60" rx="6" fill="none" stroke={C.blue} strokeWidth="1" />
        <rect x="15" y="0" width="70" height="60" rx="6" fill="none" stroke={C.green} strokeWidth="3" />
        <rect x="15" y="0" width="70" height="60" rx="6" fill="none" stroke={C.red} strokeWidth="6" />
        <text x="50" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Stacked</text>
      </g>

      {/* Visual scale bar */}
      <g transform="translate(0, 112)">
        <line x1="0" y1="0" x2="520" y2="0" stroke={C.border} strokeWidth="0.5" />
        <rect x="0" y="4" width="80" height="2" rx="1" fill={C.blue} />
        <text x="40" y="18" textAnchor="middle" fontSize="8" fill={C.muted}>Thin</text>
        <rect x="120" y="2" width="80" height="4" rx="2" fill={C.green} />
        <text x="160" y="18" textAnchor="middle" fontSize="8" fill={C.muted}>Medium</text>
        <rect x="240" y="0" width="80" height="8" rx="4" fill={C.red} />
        <text x="280" y="18" textAnchor="middle" fontSize="8" fill={C.muted}>Thick</text>
      </g>
    </svg>
  )
}

/* ─── Stroke Style Demo ────────────────────────────────────────── */
export function StrokeStyleDemo() {
  return (
    <svg viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="10" fontWeight="700" letterSpacing="0.08em" fill={C.muted} fontFamily="system-ui, sans-serif">STROKE STYLE</text>

      {/* Solid */}
      <g transform="translate(0, 28)">
        <rect width="100" height="60" rx="6" fill="none" stroke={C.blue} strokeWidth="2" />
        <text x="50" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Solid</text>
      </g>

      {/* Dashed */}
      <g transform="translate(140, 28)">
        <rect width="100" height="60" rx="6" fill="none" stroke={C.orange} strokeWidth="2" strokeDasharray="10 6" />
        <text x="50" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Dashed</text>
      </g>

      {/* Dotted */}
      <g transform="translate(280, 28)">
        <rect width="100" height="60" rx="6" fill="none" stroke={C.green} strokeWidth="2" strokeDasharray="2 6" />
        <text x="50" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Dotted</text>
      </g>

      {/* Mixed example — same shape, different styles */}
      <g transform="translate(420, 28)">
        <text x="45" y="-4" textAnchor="middle" fontSize="8" fill={C.muted}>On Lines</text>
        <line x1="5" y1="20" x2="85" y2="20" stroke={C.blue} strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="38" x2="85" y2="38" stroke={C.orange} strokeWidth="2" strokeDasharray="10 6" strokeLinecap="round" />
        <line x1="5" y1="56" x2="85" y2="56" stroke={C.green} strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
        <text x="45" y="80" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Lines</text>
      </g>

      {/* Pattern reference */}
      <g transform="translate(0, 110)">
        <text x="0" y="0" fontSize="8" fill={C.muted}>Solid: continuous line</text>
        <text x="160" y="0" fontSize="8" fill={C.muted}>Dashed: 10px dash, 6px gap</text>
        <text x="340" y="0" fontSize="8" fill={C.muted}>Dotted: 2px dash, 6px gap</text>
      </g>
    </svg>
  )
}

/* ─── Opacity Demo ─────────────────────────────────────────────── */
export function OpacityDemo() {
  return (
    <svg viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="10" fontWeight="700" letterSpacing="0.08em" fill={C.muted} fontFamily="system-ui, sans-serif">OPACITY</text>

      {/* Checkerboard background to show transparency */}
      <defs>
        <pattern id="checker" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#e2e8f0" />
          <rect width="4" height="4" fill="#cbd5e1" />
          <rect x="4" y="4" width="4" height="4" fill="#cbd5e1" />
        </pattern>
      </defs>

      {/* 100% */}
      <g transform="translate(0, 28)">
        <rect width="72" height="52" rx="6" fill="url(#checker)" />
        <rect width="72" height="52" rx="6" fill={C.green} opacity="1" />
        <text x="36" y="72" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>100%</text>
        <text x="36" y="84" textAnchor="middle" fontSize="8" fill={C.muted}>opaque</text>
      </g>

      {/* 75% */}
      <g transform="translate(100, 28)">
        <rect width="72" height="52" rx="6" fill="url(#checker)" />
        <rect width="72" height="52" rx="6" fill={C.green} opacity="0.75" />
        <text x="36" y="72" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>75%</text>
      </g>

      {/* 50% */}
      <g transform="translate(200, 28)">
        <rect width="72" height="52" rx="6" fill="url(#checker)" />
        <rect width="72" height="52" rx="6" fill={C.green} opacity="0.5" />
        <text x="36" y="72" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>50%</text>
      </g>

      {/* 25% */}
      <g transform="translate(300, 28)">
        <rect width="72" height="52" rx="6" fill="url(#checker)" />
        <rect width="72" height="52" rx="6" fill={C.green} opacity="0.25" />
        <text x="36" y="72" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>25%</text>
      </g>

      {/* Slider representation */}
      <g transform="translate(0, 106)">
        <rect x="0" y="0" width="380" height="6" rx="3" fill={C.border} />
        <rect x="0" y="0" width="380" height="6" rx="3" fill={C.green} opacity="0.5" />
        <circle cx="0" cy="3" r="7" fill={C.surface} stroke={C.accent} strokeWidth="2" />
        <circle cx="95" cy="3" r="7" fill={C.surface} stroke={C.accent} strokeWidth="2" />
        <circle cx="190" cy="3" r="7" fill={C.accent} />
        <circle cx="285" cy="3" r="7" fill={C.surface} stroke={C.accent} strokeWidth="2" />
        <circle cx="380" cy="3" r="7" fill={C.surface} stroke={C.accent} strokeWidth="2" />
        <text x="0" y="20" fontSize="8" fill={C.muted}>0%</text>
        <text x="190" y="20" textAnchor="middle" fontSize="8" fill={C.muted}>50%</text>
        <text x="380" y="20" textAnchor="end" fontSize="8" fill={C.muted}>100%</text>
      </g>
    </svg>
  )
}

/* ─── Corner Style Demo ────────────────────────────────────────── */
export function CornerStyleDemo() {
  return (
    <svg viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="10" fontWeight="700" letterSpacing="0.08em" fill={C.muted} fontFamily="system-ui, sans-serif">CORNER STYLE — RECTANGLES ONLY</text>

      {/* Sharp corners */}
      <g transform="translate(0, 28)">
        <rect width="100" height="64" rx="0" fill="rgba(59,130,246,0.1)" stroke={C.blue} strokeWidth="2" />
        <text x="50" y="84" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Sharp</text>
        <text x="50" y="96" textAnchor="middle" fontSize="8" fill={C.muted}>radius: 0</text>
      </g>

      {/* Arrow */}
      <path d="M120 60 L140 60" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M136 56 L142 60 L136 64" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Rounded corners */}
      <g transform="translate(150, 28)">
        <rect width="100" height="64" rx="12" fill="rgba(34,197,94,0.1)" stroke={C.green} strokeWidth="2" />
        <text x="50" y="84" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Rounded</text>
        <text x="50" y="96" textAnchor="middle" fontSize="8" fill={C.muted}>radius: 8</text>
      </g>

      {/* Comparison overlay */}
      <g transform="translate(320, 28)">
        <text x="50" y="-4" textAnchor="middle" fontSize="8" fill={C.muted}>Both styles</text>
        <rect x="10" y="4" width="80" height="56" rx="0" fill="none" stroke={C.blue} strokeWidth="1.5" opacity="0.4" />
        <rect x="10" y="4" width="80" height="56" rx="12" fill="none" stroke={C.green} strokeWidth="1.5" opacity="0.4" />
        {/* Corner radius indicator */}
        <path d="M10 16 Q10 4 22 4" fill="none" stroke={C.green} strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="50" y="84" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Overlay</text>
      </g>

      {/* Note */}
      <text x="0" y="116" fontSize="9" fill={C.muted}>Corner style only applies to rectangles. Ellipses and diamonds are always smooth.</text>
    </svg>
  )
}

/* ─── Combined Styles Demo ─────────────────────────────────────── */
export function CombinedStylesDemo() {
  return (
    <svg viewBox="0 0 520 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="10" fontWeight="700" letterSpacing="0.08em" fill={C.muted} fontFamily="system-ui, sans-serif">COMBINED STYLES — PUTTING IT ALL TOGETHER</text>

      {/* Row 1: Fill + Stroke combinations */}
      <g transform="translate(0, 30)">
        {/* Empty */}
        <g>
          <rect width="72" height="52" rx="6" fill="none" stroke={C.muted} strokeWidth="1.5" />
          <text x="36" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.muted}>Empty</text>
        </g>

        <path d="M82 30 L94 30" stroke={C.border} strokeWidth="1" strokeLinecap="round" />

        {/* Fill only */}
        <g transform="translate(100, 0)">
          <rect width="72" height="52" rx="6" fill="rgba(239,68,68,0.2)" />
          <text x="36" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.muted}>Fill Only</text>
        </g>

        <path d="M182 30 L194 30" stroke={C.border} strokeWidth="1" strokeLinecap="round" />

        {/* Stroke only */}
        <g transform="translate(200, 0)">
          <rect width="72" height="52" rx="6" fill="none" stroke={C.blue} strokeWidth="2" />
          <text x="36" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.muted}>Stroke Only</text>
        </g>

        <path d="M282 30 L294 30" stroke={C.border} strokeWidth="1" strokeLinecap="round" />

        {/* Fill + Stroke */}
        <g transform="translate(300, 0)">
          <rect width="72" height="52" rx="6" fill="rgba(34,197,94,0.15)" stroke={C.green} strokeWidth="2" />
          <text x="36" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.muted}>Fill + Stroke</text>
        </g>
      </g>

      {/* Row 2: Styled shapes — real examples */}
      <g transform="translate(0, 116)">
        <text x="0" y="0" fontSize="8" fontWeight="700" letterSpacing="0.06em" fill={C.muted} fontFamily="system-ui, sans-serif">STYLE PRESETS</text>

        {/* Business card style */}
        <g transform="translate(0, 10)">
          <rect width="100" height="56" rx="8" fill={C.surface} stroke={C.border} strokeWidth="1" />
          <rect x="8" y="8" width="36" height="20" rx="3" fill="rgba(59,130,246,0.12)" stroke={C.blue} strokeWidth="1.5" />
          <rect x="8" y="34" width="60" height="4" rx="2" fill={C.muted} opacity="0.2" />
          <rect x="8" y="42" width="40" height="3" rx="1.5" fill={C.muted} opacity="0.12" />
          <text x="50" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.muted}>Clean</text>
        </g>

        {/* Bold accent */}
        <g transform="translate(120, 10)">
          <rect width="100" height="56" rx="4" fill="rgba(239,68,68,0.08)" stroke={C.red} strokeWidth="3" />
          <rect x="12" y="14" width="40" height="28" rx="3" fill={C.red} opacity="0.15" />
          <rect x="60" y="14" width="28" height="4" rx="2" fill={C.muted} opacity="0.2" />
          <rect x="60" y="24" width="20" height="3" rx="1.5" fill={C.muted} opacity="0.12" />
          <text x="50" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.muted}>Bold</text>
        </g>

        {/* Dashed note */}
        <g transform="translate(240, 10)">
          <rect width="100" height="56" rx="6" fill="rgba(234,179,8,0.08)" stroke={C.yellow} strokeWidth="1.5" strokeDasharray="6 4" />
          <rect x="12" y="12" width="50" height="5" rx="2.5" fill={C.yellow} opacity="0.3" />
          <rect x="12" y="22" width="70" height="3" rx="1.5" fill={C.muted} opacity="0.15" />
          <rect x="12" y="30" width="60" height="3" rx="1.5" fill={C.muted} opacity="0.12" />
          <text x="50" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.muted}>Note</text>
        </g>

        {/* Rounded soft */}
        <g transform="translate(360, 10)">
          <rect width="100" height="56" rx="14" fill="rgba(139,92,246,0.08)" stroke="#8b5cf6" strokeWidth="1.5" />
          <circle cx="28" cy="28" r="14" fill="rgba(139,92,246,0.15)" />
          <rect x="50" y="18" width="36" height="4" rx="2" fill={C.muted} opacity="0.2" />
          <rect x="50" y="28" width="28" height="3" rx="1.5" fill={C.muted} opacity="0.12" />
          <text x="50" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill={C.muted}>Soft</text>
        </g>
      </g>
    </svg>
  )
}

/* ─── Font Size Demo ───────────────────────────────────────────── */
export function FontSizeDemo() {
  return (
    <svg viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="10" fontWeight="700" letterSpacing="0.08em" fill={C.muted} fontFamily="system-ui, sans-serif">FONT SIZE — TEXT OBJECTS</text>

      {/* Size examples */}
      <g transform="translate(0, 32)">
        <text x="0" y="10" fontSize="12" fill={C.text} fontFamily="system-ui, sans-serif">12px — Small</text>
        <text x="120" y="10" fontSize="16" fill={C.text} fontFamily="system-ui, sans-serif">16px — Body</text>
        <text x="260" y="10" fontSize="24" fill={C.text} fontFamily="system-ui, sans-serif">24px — Heading</text>
        <text x="420" y="10" fontSize="32" fill={C.text} fontFamily="system-ui, sans-serif">32px</text>
      </g>

      {/* Size scale */}
      <g transform="translate(0, 64)">
        {[
          { size: 12, x: 0 },
          { size: 14, x: 50 },
          { size: 16, x: 105 },
          { size: 18, x: 165 },
          { size: 20, x: 230 },
          { size: 24, x: 300 },
          { size: 28, x: 378 },
          { size: 32, x: 462 },
        ].map(({ size, x }) => (
          <g key={size} transform={`translate(${x}, 0)`}>
            <rect width={size * 1.8} height={size} rx="3" fill={C.accentSoft} />
            <text x={size * 0.9} y={size * 0.7} textAnchor="middle" fontSize={Math.min(size, 11)} fontWeight="600" fill={C.accent}>{size}</text>
          </g>
        ))}
      </g>

      {/* Available sizes */}
      <text x="0" y="112" fontSize="9" fill={C.muted}>Available: 12 · 14 · 16 · 18 · 20 · 24 · 28 · 32 · 36 · 48 px</text>
    </svg>
  )
}
