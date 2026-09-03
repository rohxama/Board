/* Lightweight SVG illustrations for the Kanvas documentation.
   Each illustration depicts a realistic canvas composition —
   the kind of thing a real user would build in Kanvas. */

import { ToolbarFrag } from './KanvasUIFragments'

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

/* ─── Getting Started: product planning board ──────────────────── */
export function GettingStartedIllustration() {
  return (
    <svg viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="160" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1" />

      {/* Board title */}
      <text x="40" y="30" fontSize="11" fontWeight="700" fontFamily="system-ui" fill={A.text}>Q3 Product Roadmap</text>

      {/* Swimlane: Now */}
      <rect x="36" y="40" width="100" height="12" rx="2" fill="rgba(47,133,90,0.1)" />
      <text x="42" y="49" fontSize="6" fontWeight="700" fontFamily="system-ui" fill={A.green} letterSpacing="0.06em">NOW</text>

      {/* Sticky notes in Now lane */}
      <rect x="36" y="56" width="44" height="32" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.8" />
      <text x="42" y="68" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#854d0e">Auth flow</text>
      <text x="42" y="78" fontSize="5" fontFamily="system-ui" fill="#854d0e">OAuth + JWT</text>

      <rect x="84" y="56" width="44" height="32" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.8" />
      <text x="90" y="68" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#7c3aed">API v2</text>
      <text x="90" y="78" fontSize="5" fontFamily="system-ui" fill="#7c3aed">REST → GQL</text>

      {/* Swimlane: Next */}
      <rect x="36" y="96" width="100" height="12" rx="2" fill="rgba(69,133,209,0.1)" />
      <text x="42" y="105" fontSize="6" fontWeight="700" fontFamily="system-ui" fill={A.blue} letterSpacing="0.06em">NEXT</text>

      <rect x="36" y="112" width="44" height="32" rx="2" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.8" />
      <text x="42" y="124" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#166534">Dashboard</text>
      <text x="42" y="134" fontSize="5" fontFamily="system-ui" fill="#166534">v2 redesign</text>

      <rect x="84" y="112" width="44" height="32" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="90" y="124" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#92400e">Mobile</text>
      <text x="90" y="134" fontSize="5" fontFamily="system-ui" fill="#92400e">PWA support</text>

      {/* Right side: connected flow */}
      <rect x="160" y="44" width="56" height="28" rx="3" fill="rgba(47,133,90,0.08)" stroke={A.green} strokeWidth="1" />
      <text x="188" y="62" textAnchor="middle" fontSize="6" fontWeight="500" fontFamily="system-ui" fill={A.green}>Research</text>

      <path d="M220 58 L238 58" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M234 55 L240 58 L234 61" fill="none" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />

      <rect x="244" y="44" width="56" height="28" rx="3" fill="rgba(69,133,209,0.08)" stroke={A.blue} strokeWidth="1" />
      <text x="272" y="62" textAnchor="middle" fontSize="6" fontWeight="500" fontFamily="system-ui" fill={A.blue}>Design</text>

      {/* Selection state on Design */}
      <rect x="240" y="40" width="64" height="36" rx="4" fill="none" stroke={A.accent} strokeWidth="1.5" strokeDasharray="4 2" />
      <rect x="236" y="36" width="4" height="4" rx="1" fill={A.accent} />
      <rect x="300" y="36" width="4" height="4" rx="1" fill={A.accent} />
      <rect x="236" y="72" width="4" height="4" rx="1" fill={A.accent} />
      <rect x="300" y="72" width="4" height="4" rx="1" fill={A.accent} />

      <path d="M304 58 L322 58" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M318 55 L324 58 L318 61" fill="none" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />

      <rect x="328" y="44" width="40" height="28" rx="3" fill="rgba(212,148,58,0.06)" stroke={A.orange} strokeWidth="1" />
      <text x="348" y="62" textAnchor="middle" fontSize="6" fontWeight="500" fontFamily="system-ui" fill={A.orange}>Build</text>

      {/* Annotation arrow + note */}
      <path d="M200 100 L260 80" stroke={A.red} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="3 2" />
      <rect x="200" y="100" width="60" height="24" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.6" />
      <text x="206" y="110" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#92400e">Blocker:</text>
      <text x="206" y="118" fontSize="5" fontFamily="system-ui" fill="#92400e">Auth API Keys</text>

      {/* Priority diamond */}
      <path d="M348 96 L358 106 L348 116 L338 106 Z" fill="rgba(220,69,69,0.08)" stroke={A.red} strokeWidth="0.8" />
      <text x="348" y="108" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.red}>P0</text>

      {/* Status indicator */}
      <circle cx="370" cy="106" r="6" fill="rgba(47,133,90,0.1)" stroke={A.green} strokeWidth="0.8" />
      <text x="370" y="108" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.green}>OK</text>
    </svg>
  )
}

/* ─── Tools ──────────────────────────────────────────────────────── */
export function ToolsIllustration() {
  return (
    <div className="doc-illustration doc-illust-tools" role="presentation" aria-hidden="true">
      <ToolbarFrag activeTool="rectangle" />
      <div className="doc-illust-canvas">
        <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <rect x="0" y="0" width="280" height="120" rx="6" fill="rgba(69,133,209,0.02)" stroke={A.border} strokeWidth="0.5" strokeDasharray="4 3" />

          <rect x="16" y="14" width="68" height="28" rx="3" fill="rgba(47,133,90,0.06)" stroke={A.green} strokeWidth="1" />
          <text x="50" y="32" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.green}>Research</text>

          <path d="M90 28 L114 28" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />
          <path d="M110 25 L116 28 L110 31" fill="none" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />

          <rect x="122" y="14" width="68" height="28" rx="3" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="1" />
          <text x="156" y="32" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.blue}>Design</text>

          {/* Selection state on Design box */}
          <rect x="118" y="10" width="76" height="36" rx="4" fill="none" stroke={A.accent} strokeWidth="1.5" strokeDasharray="4 2" />
          <rect x="114" y="6" width="5" height="5" rx="1" fill={A.accent} />
          <rect x="190" y="6" width="5" height="5" rx="1" fill={A.accent} />
          <rect x="114" y="42" width="5" height="5" rx="1" fill={A.accent} />
          <rect x="190" y="42" width="5" height="5" rx="1" fill={A.accent} />

          <path d="M196 28 L220 28" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />
          <path d="M216 25 L222 28 L216 31" fill="none" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />

          <rect x="228" y="14" width="40" height="28" rx="3" fill="rgba(212,148,58,0.06)" stroke={A.orange} strokeWidth="1" />
          <text x="248" y="32" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.orange}>Build</text>

          {/* Sticky note */}
          <rect x="16" y="56" width="80" height="36" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.8" />
          <text x="24" y="70" fontSize="6" fontFamily="system-ui" fill="#854d0e">Notes:</text>
          <text x="24" y="82" fontSize="6" fontFamily="system-ui" fill="#854d0e">- Sprint 1 tasks</text>

          {/* Arrow annotation */}
          <path d="M140 56 L176 44" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />
          <text x="144" y="62" fontSize="6" fontFamily="system-ui" fill={A.muted}>needs review</text>

          {/* Cursor */}
          <path d="M252 70 L252 82 L256 78 L260 84 L262 83 L258 77 L262 75Z" fill={A.text} />
        </svg>
      </div>
    </div>
  )
}

/* ─── Styling: dashboard mockup board ──────────────────────────── */
export function StylingIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="140" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1" />

      <text x="40" y="30" fontSize="10" fontWeight="700" fontFamily="system-ui" fill={A.text}>Dashboard Mockup</text>

      {/* Chart area — bar chart */}
      <rect x="36" y="40" width="120" height="80" rx="4" fill="rgba(69,133,209,0.03)" stroke={A.border} strokeWidth="0.6" />
      <rect x="46" y="72" width="14" height="36" rx="2" fill="rgba(47,133,90,0.2)" stroke={A.green} strokeWidth="0.8" />
      <rect x="66" y="56" width="14" height="52" rx="2" fill="rgba(47,133,90,0.3)" stroke={A.green} strokeWidth="0.8" />
      <rect x="86" y="64" width="14" height="44" rx="2" fill="rgba(47,133,90,0.2)" stroke={A.green} strokeWidth="0.8" />
      <rect x="106" y="48" width="14" height="60" rx="2" fill="rgba(47,133,90,0.4)" stroke={A.green} strokeWidth="0.8" />
      <rect x="126" y="60" width="14" height="48" rx="2" fill="rgba(47,133,90,0.25)" stroke={A.green} strokeWidth="0.8" />
      <text x="96" y="134" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill={A.muted}>Revenue by Month</text>

      {/* Selection state on the chart */}
      <rect x="32" y="36" width="128" height="88" rx="5" fill="none" stroke={A.accent} strokeWidth="1.5" strokeDasharray="4 2" />
      <rect x="28" y="32" width="4" height="4" rx="1" fill={A.accent} />
      <rect x="156" y="32" width="4" height="4" rx="1" fill={A.accent} />
      <rect x="28" y="120" width="4" height="4" rx="1" fill={A.accent} />
      <rect x="156" y="120" width="4" height="4" rx="1" fill={A.accent} />

      {/* Stat cards */}
      <rect x="172" y="40" width="72" height="36" rx="4" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="0.8" />
      <text x="180" y="54" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.blue}>Revenue</text>
      <text x="180" y="66" fontSize="9" fontWeight="700" fontFamily="system-ui" fill={A.text}>$48.2k</text>

      <rect x="252" y="40" width="72" height="36" rx="4" fill="rgba(47,133,90,0.06)" stroke={A.green} strokeWidth="0.8" />
      <text x="260" y="54" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.green}>Users</text>
      <text x="260" y="66" fontSize="9" fontWeight="700" fontFamily="system-ui" fill={A.text}>1,247</text>

      <rect x="332" y="40" width="40" height="36" rx="4" fill="rgba(239,69,69,0.06)" stroke={A.red} strokeWidth="0.8" />
      <text x="340" y="54" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.red}>Churn</text>
      <text x="340" y="66" fontSize="9" fontWeight="700" fontFamily="system-ui" fill={A.text}>2.1%</text>

      {/* Pie chart */}
      <circle cx="208" cy="106" r="22" fill="none" stroke={A.blue} strokeWidth="8" strokeDasharray="22 117" />
      <circle cx="208" cy="106" r="22" fill="none" stroke={A.green} strokeWidth="8" strokeDasharray="35 104" strokeDashoffset="-22" />
      <circle cx="208" cy="106" r="22" fill="none" stroke={A.orange} strokeWidth="8" strokeDasharray="18 121" strokeDashoffset="-57" />
      <circle cx="208" cy="106" r="14" fill={A.surface} />

      {/* Legend */}
      <rect x="240" y="90" width="6" height="6" rx="1" fill={A.blue} />
      <text x="250" y="96" fontSize="5" fontFamily="system-ui" fill={A.muted}>Direct 42%</text>
      <rect x="240" y="100" width="6" height="6" rx="1" fill={A.green} />
      <text x="250" y="106" fontSize="5" fontFamily="system-ui" fill={A.muted}>Organic 33%</text>
      <rect x="240" y="110" width="6" height="6" rx="1" fill={A.orange} />
      <text x="250" y="116" fontSize="5" fontFamily="system-ui" fill={A.muted}>Referral 25%</text>

      {/* Annotation */}
      <path d="M330 86 L350 96" stroke={A.red} strokeWidth="0.6" strokeLinecap="round" strokeDasharray="2 2" />
      <rect x="310" y="86" width="52" height="18" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.5" />
      <text x="316" y="96" fontSize="5" fontWeight="500" fontFamily="system-ui" fill="#92400e">Check this</text>
      <text x="316" y="102" fontSize="5" fontFamily="system-ui" fill="#92400e">with finance</text>

      {/* Trend line */}
      <path d="M280 108 L292 100 L304 106 L316 94 L328 98" stroke={A.purple} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="328" cy="98" r="2.5" fill={A.purple} />
    </svg>
  )
}

/* ─── Themes ─────────────────────────────────────────────────────── */
export function ThemesIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <clipPath id="theme-light">
        <rect x="20" y="10" width="180" height="140" rx="10" />
      </clipPath>
      <clipPath id="theme-dark">
        <rect x="200" y="10" width="180" height="140" rx="10" />
      </clipPath>

      {/* Light side */}
      <g clipPath="url(#theme-light)">
        <rect x="20" y="10" width="180" height="140" fill="#f7f8fc" stroke={A.border} strokeWidth="1" />
        <rect x="36" y="28" width="60" height="28" rx="3" fill="rgba(47,133,90,0.06)" stroke={A.green} strokeWidth="0.8" />
        <text x="66" y="46" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.green}>Task</text>
        <circle cx="150" cy="42" r="14" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="0.8" />
        <text x="150" y="45" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.blue}>Idea</text>
        <path d="M100 52 L130 42" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />
        <path d="M126 39 L132 42 L126 45" fill="none" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />
        <rect x="36" y="72" width="140" height="24" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.6" />
        <text x="46" y="88" fontSize="7" fontFamily="system-ui" fill="#854d0e">Group meeting notes</text>
        <text x="110" y="142" textAnchor="middle" fontSize="9" fontWeight="500" fontFamily="system-ui" fill={A.muted}>Light</text>
      </g>

      {/* Dark side */}
      <g clipPath="url(#theme-dark)">
        <rect x="200" y="10" width="180" height="140" fill="#181b22" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <rect x="216" y="28" width="60" height="28" rx="3" fill="rgba(82,189,107,0.1)" stroke={A.greenLight} strokeWidth="0.8" />
        <text x="246" y="46" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.greenLight}>Task</text>
        <circle cx="330" cy="42" r="14" fill="rgba(107,163,232,0.08)" stroke={A.blueLight} strokeWidth="0.8" />
        <text x="330" y="45" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.blueLight}>Idea</text>
        <path d="M280 52 L310 42" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M306 39 L312 42 L306 45" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" strokeLinecap="round" />
        <rect x="216" y="72" width="140" height="24" rx="2" fill="rgba(234,179,8,0.06)" stroke="rgba(234,179,8,0.3)" strokeWidth="0.6" />
        <text x="226" y="88" fontSize="7" fontFamily="system-ui" fill="rgba(234,179,8,0.7)">Group meeting notes</text>
        <text x="290" y="142" textAnchor="middle" fontSize="9" fontWeight="500" fontFamily="system-ui" fill="rgba(255,255,255,0.4)">Dark</text>
      </g>

      <line x1="200" y1="18" x2="200" y2="142" stroke={A.border} strokeWidth="1" strokeDasharray="4 3" />
    </svg>
  )
}

/* ─── Export ──────────────────────────────────────────────────────── */
export function ExportIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="140" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1" />

      {/* Canvas with flowchart */}
      <rect x="36" y="22" width="140" height="108" rx="6" fill="rgba(69,133,209,0.02)" stroke={A.border} strokeWidth="0.5" />
      <rect x="48" y="34" width="56" height="24" rx="3" fill="rgba(47,133,90,0.06)" stroke={A.green} strokeWidth="0.8" />
      <text x="76" y="50" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.green}>Start</text>
      {/* Selection state on Start rect */}
      <rect x="44" y="30" width="64" height="32" rx="4" fill="none" stroke={A.accent} strokeWidth="1.5" strokeDasharray="4 2" />
      <rect x="40" y="26" width="5" height="5" rx="1" fill={A.accent} />
      <rect x="104" y="26" width="5" height="5" rx="1" fill={A.accent} />
      <rect x="40" y="58" width="5" height="5" rx="1" fill={A.accent} />
      <rect x="104" y="58" width="5" height="5" rx="1" fill={A.accent} />
      <path d="M108 46 L128 46" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />
      <path d="M124 43 L130 46 L124 49" fill="none" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />
      <rect x="136" y="34" width="32" height="24" rx="3" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="0.8" />
      <text x="152" y="50" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.blue}>Do</text>
      <path d="M152 60 L152 74" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />
      <path d="M149 70 L152 76 L155 70" fill="none" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />
      <rect x="124" y="80" width="56" height="24" rx="3" fill="rgba(212,148,58,0.06)" stroke={A.orange} strokeWidth="0.8" />
      <text x="152" y="96" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.orange}>Check</text>

      {/* Arrow to export */}
      <path d="M184 62 L210 62" stroke={A.accent} strokeWidth="1" strokeLinecap="round" />
      <path d="M206 59 L212 62 L206 65" fill="none" stroke={A.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

      {/* Export dialog */}
      <rect x="218" y="22" width="150" height="108" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <rect x="218" y="22" width="150" height="22" rx="6" fill={A.accentSoft} />
      <text x="293" y="37" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.accent}>Export board</text>

      <rect x="230" y="52" width="60" height="24" rx="4" fill={A.accentSoft} stroke={A.accent} strokeWidth="1" />
      <text x="260" y="68" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.accent}>PNG</text>
      <rect x="298" y="52" width="60" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <text x="328" y="68" textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="system-ui" fill={A.muted}>PDF</text>
      <rect x="230" y="84" width="60" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <text x="260" y="100" textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="system-ui" fill={A.muted}>SVG</text>
      <rect x="298" y="84" width="60" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <text x="328" y="100" textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="system-ui" fill={A.muted}>JSON</text>
    </svg>
  )
}

/* ─── Tips: scattered sticky notes board ───────────────────────── */
export function TipsIllustration() {
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="120" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1" />

      <text x="40" y="28" fontSize="10" fontWeight="700" fontFamily="system-ui" fill={A.text}>Sprint Retrospective</text>

      {/* Went well column */}
      <rect x="36" y="36" width="100" height="10" rx="2" fill="rgba(47,133,90,0.12)" />
      <text x="42" y="44" fontSize="5" fontWeight="700" fontFamily="system-ui" fill={A.green} letterSpacing="0.06em">WENT WELL</text>

      <rect x="36" y="50" width="44" height="28" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.8" transform="rotate(-1.5 58 64)" />
      <text x="42" y="60" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#854d0e">Shipped on</text>
      <text x="42" y="68" fontSize="5" fontFamily="system-ui" fill="#854d0e">time!</text>

      <rect x="84" y="52" width="44" height="28" rx="2" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.8" transform="rotate(1 106 66)" />
      <text x="90" y="62" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#166534">Great code</text>
      <text x="90" y="70" fontSize="5" fontFamily="system-ui" fill="#166534">reviews</text>

      <rect x="36" y="82" width="44" height="28" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.8" transform="rotate(0.5 58 96)" />
      <text x="42" y="92" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#7c3aed">Zero P0</text>
      <text x="42" y="100" fontSize="5" fontFamily="system-ui" fill="#7c3aed">bugs</text>

      <rect x="84" y="84" width="44" height="28" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" transform="rotate(-0.8 106 98)" />
      <text x="90" y="94" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#92400e">Team sync</text>
      <text x="90" y="102" fontSize="5" fontFamily="system-ui" fill="#92400e">daily</text>

      {/* To improve column */}
      <rect x="156" y="36" width="100" height="10" rx="2" fill="rgba(220,69,69,0.1)" />
      <text x="162" y="44" fontSize="5" fontWeight="700" fontFamily="system-ui" fill={A.red} letterSpacing="0.06em">TO IMPROVE</text>

      <rect x="156" y="50" width="44" height="28" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" transform="rotate(1.2 178 64)" />
      <text x="162" y="60" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#92400e">Slow CI</text>
      <text x="162" y="68" fontSize="5" fontFamily="system-ui" fill="#92400e">pipeline</text>

      <rect x="204" y="52" width="44" height="28" rx="2" fill="#fee2e2" stroke="#dc4545" strokeWidth="0.8" transform="rotate(-0.5 226 66)" />
      <text x="210" y="62" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#991b1b">Scope creep</text>
      <text x="210" y="70" fontSize="5" fontFamily="system-ui" fill="#991b1b">on auth</text>

      <rect x="156" y="82" width="44" height="28" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.8" transform="rotate(0.8 178 96)" />
      <text x="162" y="92" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#7c3aed">Missing</text>
      <text x="162" y="100" fontSize="5" fontFamily="system-ui" fill="#7c3aed">test docs</text>

      <rect x="204" y="84" width="44" height="28" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.8" transform="rotate(-1 226 98)" />
      <text x="210" y="94" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#854d0e">Late standup</text>
      <text x="210" y="102" fontSize="5" fontFamily="system-ui" fill="#854d0e">meetings</text>

      {/* Action items */}
      <rect x="276" y="36" width="96" height="10" rx="2" fill="rgba(69,133,209,0.12)" />
      <text x="282" y="44" fontSize="5" fontWeight="700" fontFamily="system-ui" fill={A.blue} letterSpacing="0.06em">ACTION ITEMS</text>

      <rect x="276" y="50" width="90" height="24" rx="3" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <circle cx="286" cy="62" r="4" fill="rgba(47,133,90,0.1)" stroke={A.green} strokeWidth="0.6" />
      <text x="294" y="64" fontSize="5" fontFamily="system-ui" fill={A.text}>Optimize CI cache</text>

      <rect x="276" y="78" width="90" height="24" rx="3" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <circle cx="286" cy="90" r="4" fill="rgba(220,69,69,0.1)" stroke={A.red} strokeWidth="0.6" />
      <text x="294" y="92" fontSize="5" fontFamily="system-ui" fill={A.text}>Add PR size guide</text>

      {/* Arrow connecting items */}
      <path d="M270 64 L276 64" stroke={A.accent} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M274 62 L278 64 L274 66" fill="none" stroke={A.accent} strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  )
}

/* ─── FAQ: realistic help-center board ──────────────────────────── */
export function FAQIllustration() {
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="120" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1" />

      {/* Board title */}
      <text x="40" y="30" fontSize="11" fontWeight="700" fontFamily="system-ui" fill={A.text}>Help Center Board</text>

      {/* Category: Getting Started */}
      <rect x="36" y="38" width="100" height="10" rx="2" fill="rgba(47,133,90,0.1)" />
      <text x="42" y="47" fontSize="5" fontWeight="700" fontFamily="system-ui" fill={A.green} letterSpacing="0.06em">GETTING STARTED</text>

      <rect x="36" y="52" width="44" height="28" rx="2" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.8" />
      <text x="42" y="62" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#166534">Is Kanvas free?</text>
      <text x="42" y="72" fontSize="5" fontFamily="system-ui" fill="#166534">Yes, fully free</text>

      <rect x="84" y="52" width="44" height="28" rx="2" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.8" transform="rotate(0.5 106 66)" />
      <text x="90" y="62" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#166534">How to sign up?</text>
      <text x="90" y="72" fontSize="5" fontFamily="system-ui" fill="#166534">Email or Google</text>

      {/* Category: Features */}
      <rect x="156" y="38" width="100" height="10" rx="2" fill="rgba(69,133,209,0.1)" />
      <text x="162" y="47" fontSize="5" fontWeight="700" fontFamily="system-ui" fill={A.blue} letterSpacing="0.06em">FEATURES</text>

      <rect x="156" y="52" width="44" height="28" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.8" />
      <text x="162" y="62" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#7c3aed">Export formats?</text>
      <text x="162" y="72" fontSize="5" fontFamily="system-ui" fill="#7c3aed">PNG, SVG, PDF</text>

      <rect x="204" y="52" width="44" height="28" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.8" transform="rotate(-0.4 226 66)" />
      <text x="210" y="62" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#7c3aed">Offline mode?</text>
      <text x="210" y="72" fontSize="5" fontFamily="system-ui" fill="#7c3aed">Yes, local first</text>

      {/* Category: Troubleshooting */}
      <rect x="276" y="38" width="96" height="10" rx="2" fill="rgba(220,69,69,0.1)" />
      <text x="282" y="47" fontSize="5" fontWeight="700" fontFamily="system-ui" fill={A.red} letterSpacing="0.06em">TROUBLESHOOTING</text>

      <rect x="276" y="52" width="90" height="28" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="282" y="62" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="#92400e">Board won't load?</text>
      <text x="282" y="72" fontSize="5" fontFamily="system-ui" fill="#92400e">Clear cache + retry</text>

      {/* Connection line between related items */}
      <path d="M132 66 L156 66" stroke={A.muted} strokeWidth="0.6" strokeDasharray="2 1.5" strokeLinecap="round" />
      <path d="M152 64 L158 66 L152 68" fill="none" stroke={A.muted} strokeWidth="0.6" strokeLinecap="round" />

      {/* Selection state on a note */}
      <rect x="152" y="48" width="52" height="36" rx="4" fill="none" stroke={A.accent} strokeWidth="1.5" strokeDasharray="4 2" />
      <rect x="148" y="44" width="4" height="4" rx="1" fill={A.accent} />
      <rect x="204" y="44" width="4" height="4" rx="1" fill={A.accent} />
      <rect x="148" y="80" width="4" height="4" rx="1" fill={A.accent} />
      <rect x="204" y="80" width="4" height="4" rx="1" fill={A.accent} />

      {/* Bottom row: popular questions */}
      <rect x="36" y="90" width="336" height="10" rx="2" fill="rgba(139,92,246,0.08)" />
      <text x="42" y="99" fontSize="5" fontWeight="700" fontFamily="system-ui" fill={A.purple} letterSpacing="0.06em">POPULAR QUESTIONS</text>

      <rect x="36" y="104" width="52" height="20" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="42" y="116" fontSize="4.5" fontFamily="system-ui" fill={A.text}>Share boards?</text>

      <rect x="92" y="104" width="52" height="20" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="98" y="116" fontSize="4.5" fontFamily="system-ui" fill={A.text}>Team sizes?</text>

      <rect x="148" y="104" width="52" height="20" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="154" y="116" fontSize="4.5" fontFamily="system-ui" fill={A.text}>Keyboard shortcuts</text>

      <rect x="204" y="104" width="52" height="20" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="210" y="116" fontSize="4.5" fontFamily="system-ui" fill={A.text}>Image limits?</text>

      <rect x="260" y="104" width="52" height="20" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="266" y="116" fontSize="4.5" fontFamily="system-ui" fill={A.text}>Dark mode?</text>

      <rect x="316" y="104" width="56" height="20" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.6" />
      <text x="322" y="116" fontSize="4.5" fontFamily="system-ui" fill={A.text}>Mobile support?</text>
    </svg>
  )
}
