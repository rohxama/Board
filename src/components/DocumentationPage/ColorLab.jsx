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
      <rect x="0" y="0" width="680" height="120" rx="12" fill={C.surface} stroke={C.border} strokeWidth="0.8" />
      {Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 34 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={16 + col * 20} cy={16 + row * 20} r="0.6" fill={C.muted} opacity="0.12" />
        ))
      )}

      {/* A realistic canvas composition — styled shapes on a board */}
      <rect x="30" y="20" width="80" height="55" rx="4" fill="rgba(59,130,246,0.08)" stroke={C.blue} strokeWidth="1" />
      <text x="70" y="52" textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="system-ui" fill={C.blue}>Card</text>

      <circle cx="180" cy="48" r="28" fill="rgba(34,197,94,0.06)" stroke={C.green} strokeWidth="1" />
      <text x="180" y="51" textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="system-ui" fill={C.green}>Status</text>

      <rect x="240" y="24" width="70" height="48" rx="6" fill="rgba(239,68,68,0.06)" stroke={C.red} strokeWidth="1" />
      <text x="275" y="52" textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="system-ui" fill={C.red}>Alert</text>

      <ellipse cx="400" cy="48" rx="38" ry="26" fill="rgba(234,179,8,0.06)" stroke={C.yellow} strokeWidth="1" />
      <text x="400" y="51" textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="system-ui" fill={C.yellow}>Note</text>

      <path d="M480 30 L560 48 L480 66" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      <line x1="480" y1="85" x2="570" y2="85" stroke={C.blue} strokeWidth="1.5" strokeLinecap="round" />

      {/* Selection handles on the red rect */}
      <rect x="236" y="20" width="6" height="6" rx="1.5" fill={C.red} />
      <rect x="306" y="20" width="6" height="6" rx="1.5" fill={C.red} />
      <rect x="236" y="66" width="6" height="6" rx="1.5" fill={C.red} />
      <rect x="306" y="66" width="6" height="6" rx="1.5" fill={C.red} />
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
      <text x="0" y="14" fontSize="9" fontWeight="600" letterSpacing="0.06em" fill={C.muted} textTransform="uppercase" fontFamily="system-ui, sans-serif">SHAPE → FILL</text>

      {/* No Fill */}
      <g transform="translate(0, 28)">
        <text x="40" y="0" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>No Fill</text>
        <rect x="4" y="8" width="72" height="52" rx="4" fill="none" stroke={C.blue} strokeWidth="1" />
        <text x="40" y="78" textAnchor="middle" fontSize="8" fill={C.muted}>transparent</text>
      </g>

      <path d="M100 60 L120 60" stroke={C.accent} strokeWidth="1" strokeLinecap="round" />
      <path d="M116 56 L122 60 L116 64" fill="none" stroke={C.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

      {/* Red Fill */}
      <g transform="translate(130, 28)">
        <text x="40" y="0" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Red Fill</text>
        <rect x="4" y="8" width="72" height="52" rx="4" fill="rgba(239,68,68,0.1)" stroke={C.red} strokeWidth="1" />
        <text x="40" y="78" textAnchor="middle" fontSize="8" fill={C.muted}>#ef4444</text>
      </g>

      <path d="M230 60 L250 60" stroke={C.accent} strokeWidth="1" strokeLinecap="round" />
      <path d="M246 56 L252 60 L246 64" fill="none" stroke={C.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

      {/* Green Fill */}
      <g transform="translate(260, 28)">
        <text x="40" y="0" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Green Fill</text>
        <rect x="4" y="8" width="72" height="52" rx="4" fill="rgba(34,197,94,0.08)" stroke={C.green} strokeWidth="1" />
        <text x="40" y="78" textAnchor="middle" fontSize="8" fill={C.muted}>#22c55e</text>
      </g>

      <path d="M360 60 L380 60" stroke={C.accent} strokeWidth="1" strokeLinecap="round" />
      <path d="M376 56 L382 60 L376 64" fill="none" stroke={C.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

      {/* Blue Fill */}
      <g transform="translate(390, 28)">
        <text x="40" y="0" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Blue Fill</text>
        <rect x="4" y="8" width="72" height="52" rx="4" fill="rgba(59,130,246,0.08)" stroke={C.blue} strokeWidth="1" />
        <text x="40" y="78" textAnchor="middle" fontSize="8" fill={C.muted}>#3b82f6</text>
      </g>

      <text x="0" y="120" fontSize="8" fontWeight="600" letterSpacing="0.05em" fill={C.muted} fontFamily="system-ui, sans-serif">FILL APPLIES TO: RECTANGLE · ELLIPSE · DIAMOND</text>
      <rect x="0" y="130" width="44" height="24" rx="3" fill="rgba(234,179,8,0.08)" stroke={C.yellow} strokeWidth="0.8" />
      <ellipse x="56" y="130" cx="78" cy="142" rx="22" ry="12" fill="rgba(139,92,246,0.06)" stroke="#8b5cf6" strokeWidth="0.8" />
      <path d="M120 130 L142 142 L120 154 L98 142 Z" fill="rgba(249,115,22,0.06)" stroke={C.orange} strokeWidth="0.8" />
    </svg>
  )
}

/* ─── Stroke Width Demo ────────────────────────────────────────── */
export function StrokeWidthDemo() {
  return (
    <svg viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="9" fontWeight="600" letterSpacing="0.06em" fill={C.muted} fontFamily="system-ui, sans-serif">STROKE WIDTH</text>

      <g transform="translate(0, 28)">
        <rect width="100" height="60" rx="4" fill="none" stroke={C.blue} strokeWidth="1" />
        <text x="50" y="80" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Thin</text>
        <text x="50" y="92" textAnchor="middle" fontSize="7" fill={C.muted}>1px</text>
      </g>

      <g transform="translate(140, 28)">
        <rect width="100" height="60" rx="4" fill="none" stroke={C.green} strokeWidth="2" />
        <text x="50" y="80" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Medium</text>
        <text x="50" y="92" textAnchor="middle" fontSize="7" fill={C.muted}>2px</text>
      </g>

      <g transform="translate(280, 28)">
        <rect width="100" height="60" rx="4" fill="none" stroke={C.red} strokeWidth="4" />
        <text x="50" y="80" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Thick</text>
        <text x="50" y="92" textAnchor="middle" fontSize="7" fill={C.muted}>4px</text>
      </g>

      <g transform="translate(420, 28)">
        <rect x="15" y="0" width="70" height="60" rx="4" fill="none" stroke={C.muted} strokeWidth="0.8" opacity="0.2" />
        <rect x="15" y="0" width="70" height="60" rx="4" fill="none" stroke={C.blue} strokeWidth="1" />
        <rect x="15" y="0" width="70" height="60" rx="4" fill="none" stroke={C.green} strokeWidth="2" />
        <rect x="15" y="0" width="70" height="60" rx="4" fill="none" stroke={C.red} strokeWidth="4" />
        <text x="50" y="80" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Stacked</text>
      </g>
    </svg>
  )
}

/* ─── Stroke Style Demo ────────────────────────────────────────── */
export function StrokeStyleDemo() {
  return (
    <svg viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="9" fontWeight="600" letterSpacing="0.06em" fill={C.muted} fontFamily="system-ui, sans-serif">STROKE STYLE</text>

      <g transform="translate(0, 28)">
        <rect width="100" height="60" rx="4" fill="none" stroke={C.blue} strokeWidth="1" />
        <text x="50" y="80" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Solid</text>
      </g>

      <g transform="translate(140, 28)">
        <rect width="100" height="60" rx="4" fill="none" stroke={C.orange} strokeWidth="1" strokeDasharray="10 6" />
        <text x="50" y="80" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Dashed</text>
      </g>

      <g transform="translate(280, 28)">
        <rect width="100" height="60" rx="4" fill="none" stroke={C.green} strokeWidth="1" strokeDasharray="2 6" />
        <text x="50" y="80" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Dotted</text>
      </g>

      <g transform="translate(420, 28)">
        <text x="45" y="-4" textAnchor="middle" fontSize="7" fill={C.muted}>On Lines</text>
        <line x1="5" y1="20" x2="85" y2="20" stroke={C.blue} strokeWidth="1" strokeLinecap="round" />
        <line x1="5" y1="38" x2="85" y2="38" stroke={C.orange} strokeWidth="1" strokeDasharray="10 6" strokeLinecap="round" />
        <line x1="5" y1="56" x2="85" y2="56" stroke={C.green} strokeWidth="1" strokeDasharray="2 6" strokeLinecap="round" />
        <text x="45" y="80" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Lines</text>
      </g>

      <g transform="translate(0, 110)">
        <text x="0" y="0" fontSize="7" fill={C.muted}>Solid: continuous line</text>
        <text x="160" y="0" fontSize="7" fill={C.muted}>Dashed: 10px dash, 6px gap</text>
        <text x="340" y="0" fontSize="7" fill={C.muted}>Dotted: 2px dash, 6px gap</text>
      </g>
    </svg>
  )
}

/* ─── Opacity Demo ─────────────────────────────────────────────── */
export function OpacityDemo() {
  return (
    <svg viewBox="0 0 520 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="9" fontWeight="600" letterSpacing="0.06em" fill={C.muted} fontFamily="system-ui, sans-serif">OPACITY</text>

      <defs>
        <pattern id="checker" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#e2e8f0" />
          <rect width="4" height="4" fill="#cbd5e1" />
          <rect x="4" y="4" width="4" height="4" fill="#cbd5e1" />
        </pattern>
      </defs>

      <g transform="translate(0, 28)">
        <rect width="72" height="52" rx="4" fill="url(#checker)" />
        <rect width="72" height="52" rx="4" fill={C.green} opacity="1" />
        <text x="36" y="72" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>100%</text>
        <text x="36" y="84" textAnchor="middle" fontSize="7" fill={C.muted}>opaque</text>
      </g>

      <g transform="translate(100, 28)">
        <rect width="72" height="52" rx="4" fill="url(#checker)" />
        <rect width="72" height="52" rx="4" fill={C.green} opacity="0.75" />
        <text x="36" y="72" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>75%</text>
      </g>

      <g transform="translate(200, 28)">
        <rect width="72" height="52" rx="4" fill="url(#checker)" />
        <rect width="72" height="52" rx="4" fill={C.green} opacity="0.5" />
        <text x="36" y="72" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>50%</text>
      </g>

      <g transform="translate(300, 28)">
        <rect width="72" height="52" rx="4" fill="url(#checker)" />
        <rect width="72" height="52" rx="4" fill={C.green} opacity="0.25" />
        <text x="36" y="72" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>25%</text>
      </g>
    </svg>
  )
}

/* ─── Corner Style Demo ────────────────────────────────────────── */
export function CornerStyleDemo() {
  return (
    <svg viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="9" fontWeight="600" letterSpacing="0.06em" fill={C.muted} fontFamily="system-ui, sans-serif">CORNER STYLE — RECTANGLES ONLY</text>

      <g transform="translate(0, 28)">
        <rect width="100" height="64" rx="0" fill="rgba(59,130,246,0.06)" stroke={C.blue} strokeWidth="1" />
        <text x="50" y="84" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Sharp</text>
        <text x="50" y="96" textAnchor="middle" fontSize="7" fill={C.muted}>radius: 0</text>
      </g>

      <path d="M120 60 L140 60" stroke={C.accent} strokeWidth="1" strokeLinecap="round" />
      <path d="M136 56 L142 60 L136 64" fill="none" stroke={C.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

      <g transform="translate(150, 28)">
        <rect width="100" height="64" rx="12" fill="rgba(34,197,94,0.06)" stroke={C.green} strokeWidth="1" />
        <text x="50" y="84" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Rounded</text>
        <text x="50" y="96" textAnchor="middle" fontSize="7" fill={C.muted}>radius: 8</text>
      </g>

      <g transform="translate(320, 28)">
        <text x="50" y="-4" textAnchor="middle" fontSize="7" fill={C.muted}>Both styles</text>
        <rect x="10" y="4" width="80" height="56" rx="0" fill="none" stroke={C.blue} strokeWidth="0.8" opacity="0.3" />
        <rect x="10" y="4" width="80" height="56" rx="12" fill="none" stroke={C.green} strokeWidth="0.8" opacity="0.3" />
        <path d="M10 16 Q10 4 22 4" fill="none" stroke={C.green} strokeWidth="0.8" strokeDasharray="3 2" />
        <text x="50" y="84" textAnchor="middle" fontSize="8" fontWeight="500" fill={C.muted}>Overlay</text>
      </g>

      <text x="0" y="116" fontSize="8" fill={C.muted}>Corner style only applies to rectangles. Ellipses and diamonds are always smooth.</text>
    </svg>
  )
}

/* ─── Combined Styles Demo ─────────────────────────────────────── */
export function CombinedStylesDemo() {
  return (
    <svg viewBox="0 0 520 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="9" fontWeight="600" letterSpacing="0.06em" fill={C.muted} fontFamily="system-ui, sans-serif">COMBINED STYLES — PUTTING IT ALL TOGETHER</text>

      <g transform="translate(0, 30)">
        <g>
          <rect width="72" height="52" rx="4" fill="none" stroke={C.muted} strokeWidth="0.8" />
          <text x="36" y="72" textAnchor="middle" fontSize="7" fontWeight="500" fill={C.muted}>Empty</text>
        </g>

        <path d="M82 30 L94 30" stroke={C.border} strokeWidth="0.8" strokeLinecap="round" />

        <g transform="translate(100, 0)">
          <rect width="72" height="52" rx="4" fill="rgba(239,68,68,0.1)" />
          <text x="36" y="72" textAnchor="middle" fontSize="7" fontWeight="500" fill={C.muted}>Fill Only</text>
        </g>

        <path d="M182 30 L194 30" stroke={C.border} strokeWidth="0.8" strokeLinecap="round" />

        <g transform="translate(200, 0)">
          <rect width="72" height="52" rx="4" fill="none" stroke={C.blue} strokeWidth="1" />
          <text x="36" y="72" textAnchor="middle" fontSize="7" fontWeight="500" fill={C.muted}>Stroke Only</text>
        </g>

        <path d="M282 30 L294 30" stroke={C.border} strokeWidth="0.8" strokeLinecap="round" />

        <g transform="translate(300, 0)">
          <rect width="72" height="52" rx="4" fill="rgba(34,197,94,0.08)" stroke={C.green} strokeWidth="1" />
          <text x="36" y="72" textAnchor="middle" fontSize="7" fontWeight="500" fill={C.muted}>Fill + Stroke</text>
        </g>
      </g>

      {/* Row 2: Realistic canvas examples */}
      <g transform="translate(0, 116)">
        <text x="0" y="0" fontSize="7" fontWeight="600" letterSpacing="0.05em" fill={C.muted} fontFamily="system-ui, sans-serif">STYLE PRESETS</text>

        {/* Business card style */}
        <g transform="translate(0, 10)">
          <rect width="100" height="48" rx="6" fill={C.surface} stroke={C.border} strokeWidth="0.8" />
          <rect x="8" y="8" width="36" height="16" rx="2" fill="rgba(59,130,246,0.08)" stroke={C.blue} strokeWidth="0.8" />
          <rect x="8" y="30" width="60" height="3" rx="1.5" fill={C.muted} opacity="0.15" />
          <rect x="8" y="37" width="40" height="2.5" rx="1.25" fill={C.muted} opacity="0.1" />
          <text x="50" y="68" textAnchor="middle" fontSize="7" fontWeight="500" fill={C.muted}>Clean</text>
        </g>

        {/* Bold accent */}
        <g transform="translate(120, 10)">
          <rect width="100" height="48" rx="3" fill="rgba(239,68,68,0.05)" stroke={C.red} strokeWidth="2" />
          <rect x="12" y="12" width="40" height="24" rx="2" fill={C.red} opacity="0.1" />
          <rect x="60" y="12" width="28" height="3" rx="1.5" fill={C.muted} opacity="0.15" />
          <rect x="60" y="20" width="20" height="2.5" rx="1.25" fill={C.muted} opacity="0.1" />
          <text x="50" y="68" textAnchor="middle" fontSize="7" fontWeight="500" fill={C.muted}>Bold</text>
        </g>

        {/* Dashed note */}
        <g transform="translate(240, 10)">
          <rect width="100" height="48" rx="4" fill="rgba(234,179,8,0.05)" stroke={C.yellow} strokeWidth="0.8" strokeDasharray="6 4" />
          <rect x="12" y="10" width="50" height="4" rx="2" fill={C.yellow} opacity="0.2" />
          <rect x="12" y="18" width="70" height="2.5" rx="1.25" fill={C.muted} opacity="0.12" />
          <rect x="12" y="25" width="60" height="2.5" rx="1.25" fill={C.muted} opacity="0.1" />
          <text x="50" y="68" textAnchor="middle" fontSize="7" fontWeight="500" fill={C.muted}>Note</text>
        </g>

        {/* Rounded soft */}
        <g transform="translate(360, 10)">
          <rect width="100" height="48" rx="12" fill="rgba(139,92,246,0.05)" stroke="#8b5cf6" strokeWidth="0.8" />
          <rect x="12" y="10" width="36" height="28" rx="4" fill="rgba(139,92,246,0.08)" />
          <rect x="54" y="14" width="32" height="3" rx="1.5" fill={C.muted} opacity="0.15" />
          <rect x="54" y="22" width="24" height="2.5" rx="1.25" fill={C.muted} opacity="0.1" />
          <text x="50" y="68" textAnchor="middle" fontSize="7" fontWeight="500" fill={C.muted}>Soft</text>
        </g>
      </g>
    </svg>
  )
}

/* ─── Font Size Demo ───────────────────────────────────────────── */
export function FontSizeDemo() {
  return (
    <svg viewBox="0 0 520 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-colorlab-demo" aria-hidden="true">
      <text x="0" y="14" fontSize="9" fontWeight="600" letterSpacing="0.06em" fill={C.muted} fontFamily="system-ui, sans-serif">FONT SIZE — TEXT OBJECTS</text>

      <g transform="translate(0, 32)">
        <text x="0" y="10" fontSize="12" fill={C.text} fontFamily="system-ui, sans-serif">12px — Small</text>
        <text x="120" y="10" fontSize="16" fill={C.text} fontFamily="system-ui, sans-serif">16px — Body</text>
        <text x="260" y="10" fontSize="24" fill={C.text} fontFamily="system-ui, sans-serif">24px — Heading</text>
        <text x="420" y="10" fontSize="32" fill={C.text} fontFamily="system-ui, sans-serif">32px</text>
      </g>

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
            <rect width={size * 1.8} height={size} rx="2" fill={C.accentSoft} />
            <text x={size * 0.9} y={size * 0.7} textAnchor="middle" fontSize={Math.min(size, 10)} fontWeight="500" fill={C.accent}>{size}</text>
          </g>
        ))}
      </g>

      <text x="0" y="112" fontSize="8" fill={C.muted}>Available: 12 · 14 · 16 · 18 · 20 · 24 · 28 · 32 · 36 · 48 px</text>
    </svg>
  )
}
