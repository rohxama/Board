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

/* ─── Getting Started ───────────────────────────────────────────── */
export function GettingStartedIllustration() {
  return (
    <svg viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="160" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1" />

      {/* Dot grid */}
      {Array.from({ length: 7 }, (_, row) =>
        Array.from({ length: 16 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={40 + col * 22} cy={30 + row * 20} r="0.6" fill={A.muted} opacity="0.2" />
        ))
      )}

      {/* A realistic process flow */}
      <text x="52" y="34" fontSize="11" fontWeight="600" fontFamily="system-ui" fill={A.text}>Project Kickoff</text>

      <rect x="40" y="48" width="72" height="32" rx="4" fill="rgba(47,133,90,0.08)" stroke={A.green} strokeWidth="1" />
      <text x="76" y="68" textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="system-ui" fill={A.green}>Research</text>

      <path d="M120 64 L152 64" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
      <path d="M148 61 L154 64 L148 67" fill="none" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />

      <rect x="160" y="48" width="72" height="32" rx="4" fill="rgba(69,133,209,0.08)" stroke={A.blue} strokeWidth="1" />
      <text x="196" y="68" textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="system-ui" fill={A.blue}>Design</text>

      <path d="M240 64 L272 64" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
      <path d="M268 61 L274 64 L268 67" fill="none" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />

      <rect x="280" y="48" width="72" height="32" rx="4" fill="rgba(212,148,58,0.08)" stroke={A.orange} strokeWidth="1" />
      <text x="316" y="68" textAnchor="middle" fontSize="8" fontWeight="500" fontFamily="system-ui" fill={A.orange}>Build</text>

      {/* Sticky note */}
      <rect x="40" y="96" width="100" height="52" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="1" />
      <text x="52" y="112" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#854d0e">Next steps:</text>
      <text x="52" y="124" fontSize="7" fontFamily="system-ui" fill="#854d0e">- User testing</text>
      <text x="52" y="136" fontSize="7" fontFamily="system-ui" fill="#854d0e">- Deploy v1</text>

      {/* Selection handles on the Design box */}
      <rect x="156" y="44" width="5" height="5" rx="1" fill={A.blue} />
      <rect x="228" y="44" width="5" height="5" rx="1" fill={A.blue} />
      <rect x="156" y="78" width="5" height="5" rx="1" fill={A.blue} />
      <rect x="228" y="78" width="5" height="5" rx="1" fill={A.blue} />
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

/* ─── Styling ────────────────────────────────────────────────────── */
export function StylingIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="140" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1" />

      <text x="40" y="32" fontSize="10" fontWeight="600" fontFamily="system-ui" fill={A.text}>Style options</text>

      {/* Rectangles showing different styles */}
      <rect x="40" y="42" width="64" height="36" rx="3" fill="rgba(47,133,90,0.08)" stroke={A.green} strokeWidth="1" />
      <text x="72" y="64" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.green}>Solid</text>
      {/* Selection state on Solid rect */}
      <rect x="36" y="38" width="72" height="44" rx="4" fill="none" stroke={A.accent} strokeWidth="1.5" strokeDasharray="4 2" />
      <rect x="32" y="34" width="5" height="5" rx="1" fill={A.accent} />
      <rect x="104" y="34" width="5" height="5" rx="1" fill={A.accent} />
      <rect x="32" y="78" width="5" height="5" rx="1" fill={A.accent} />
      <rect x="104" y="78" width="5" height="5" rx="1" fill={A.accent} />

      <rect x="120" y="42" width="64" height="36" rx="3" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="1" strokeDasharray="6 3" />
      <text x="152" y="64" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.blue}>Dashed</text>

      <rect x="200" y="42" width="64" height="36" rx="3" fill="rgba(212,148,58,0.05)" stroke={A.orange} strokeWidth="2" />
      <text x="232" y="64" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.orange}>Thick</text>

      <circle cx="312" cy="60" r="20" fill="rgba(139,92,246,0.06)" stroke={A.purple} strokeWidth="1" />
      <text x="312" y="63" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.purple}>Circle</text>

      {/* Colored arrow */}
      <path d="M52 100 L140 100" stroke={A.red} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M134 96 L142 100 L134 104" fill="none" stroke={A.red} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="96" y="116" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill={A.muted}>Colored arrow</text>

      {/* Sticky note */}
      <rect x="176" y="88" width="96" height="44" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="186" y="104" fontSize="7" fontWeight="500" fontFamily="system-ui" fill="#92400e">Notes:</text>
      <text x="186" y="116" fontSize="7" fontFamily="system-ui" fill="#92400e">Use color to group</text>
      <text x="186" y="126" fontSize="7" fontFamily="system-ui" fill="#92400e">related items</text>

      {/* Label card */}
      <rect x="300" y="92" width="72" height="36" rx="3" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="0.8" />
      <text x="336" y="108" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.blue}>Label</text>
      <text x="336" y="120" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill={A.muted}>Group A</text>
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

/* ─── Tips ───────────────────────────────────────────────────────── */
export function TipsIllustration() {
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="120" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1" />

      <text x="40" y="30" fontSize="10" fontWeight="600" fontFamily="system-ui" fill={A.text}>Pro tips</text>

      {/* Tip 1 */}
      <rect x="36" y="38" width="100" height="48" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.8" />
      <text x="46" y="54" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#854d0e">Tip 1</text>
      <text x="46" y="66" fontSize="7" fontFamily="system-ui" fill="#854d0e">Hold space to pan</text>
      <text x="46" y="78" fontSize="7" fontFamily="system-ui" fill="#854d0e">around the canvas</text>

      {/* Tip 2 */}
      <rect x="148" y="38" width="100" height="48" rx="2" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.8" />
      <text x="158" y="54" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#7c3aed">Tip 2</text>
      <text x="158" y="66" fontSize="7" fontFamily="system-ui" fill="#7c3aed">Ctrl+Z to undo</text>
      <text x="158" y="78" fontSize="7" fontFamily="system-ui" fill="#7c3aed">any mistake</text>

      {/* Tip 3 */}
      <rect x="260" y="38" width="100" height="48" rx="2" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.8" />
      <text x="270" y="54" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#166534">Tip 3</text>
      <text x="270" y="66" fontSize="7" fontFamily="system-ui" fill="#166534">Double-click to add</text>
      <text x="270" y="78" fontSize="7" fontFamily="system-ui" fill="#166534">text anywhere</text>

      {/* Bottom shortcuts bar */}
      <rect x="36" y="96" width="328" height="20" rx="3" fill={A.accentSoft} />
      <text x="50" y="110" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.accent}>Shortcuts:</text>
      <text x="108" y="110" fontSize="7" fontFamily="monospace" fill={A.muted}>V Select</text>
      <text x="158" y="110" fontSize="7" fontFamily="monospace" fill={A.muted}>R Rectangle</text>
      <text x="222" y="110" fontSize="7" fontFamily="monospace" fill={A.muted}>O Circle</text>
      <text x="276" y="110" fontSize="7" fontFamily="monospace" fill={A.muted}>T Text</text>
      <text x="318" y="110" fontSize="7" fontFamily="monospace" fill={A.muted}>P Pen</text>
    </svg>
  )
}

/* ─── FAQ ────────────────────────────────────────────────────────── */
export function FAQIllustration() {
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="120" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1" />

      <text x="40" y="30" fontSize="10" fontWeight="600" fontFamily="system-ui" fill={A.text}>Frequently asked</text>

      {/* Q1 — open */}
      <rect x="36" y="38" width="160" height="40" rx="4" fill={A.accentSoft} stroke={A.accent} strokeWidth="1" />
      <text x="48" y="54" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.accent}>Q: Is Kanvas free?</text>
      <text x="48" y="68" fontSize="7" fontFamily="system-ui" fill={A.muted}>A: Yes, fully free to use.</text>

      {/* Q2 — closed */}
      <rect x="36" y="86" width="160" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <text x="48" y="102" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.muted}>Q: Can I export my boards?</text>

      {/* Q3 — closed */}
      <rect x="208" y="38" width="160" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <text x="220" y="54" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.muted}>Q: Does it work offline?</text>

      {/* Q4 — closed */}
      <rect x="208" y="70" width="160" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
      <text x="220" y="86" fontSize="7" fontWeight="500" fontFamily="system-ui" fill={A.muted}>Q: How do I share boards?</text>
    </svg>
  )
}
