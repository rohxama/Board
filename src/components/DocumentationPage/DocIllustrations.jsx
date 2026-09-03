/* Lightweight SVG illustrations for the Kanvas documentation.
   Each illustration depicts a realistic canvas composition —
   the kind of thing a real user would build in Kanvas. */

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
      <rect x="20" y="10" width="360" height="160" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Dot grid */}
      {Array.from({ length: 7 }, (_, row) =>
        Array.from({ length: 16 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={40 + col * 22} cy={30 + row * 20} r="0.8" fill={A.muted} opacity="0.25" />
        ))
      )}

      {/* "My First Board" title — handwritten feel */}
      <text x="52" y="34" fontSize="13" fontWeight="700" fontFamily="system-ui" fill={A.text}>My First Board</text>

      {/* Step 1: Start box */}
      <rect x="40" y="48" width="80" height="36" rx="6" fill="rgba(47,133,90,0.1)" stroke={A.green} strokeWidth="1.5" />
      <text x="80" y="70" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="system-ui" fill={A.green}>Start here</text>

      {/* Arrow 1 */}
      <path d="M128 66 L170 66" stroke={A.orange} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M164 62 L172 66 L164 70" fill="none" stroke={A.orange} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 2: Rectangle */}
      <rect x="180" y="44" width="88" height="44" rx="5" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="1.5" />
      <text x="224" y="64" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="system-ui" fill={A.blue}>Add shapes</text>
      <text x="224" y="76" textAnchor="middle" fontSize="8" fontFamily="system-ui" fill={A.muted}>Drag to create</text>

      {/* Arrow 2 */}
      <path d="M276 66 L310 66" stroke={A.orange} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M304 62 L312 66 L304 70" fill="none" stroke={A.orange} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 3: Circle with text */}
      <circle cx="346" cy="66" r="26" fill="rgba(212,148,58,0.08)" stroke={A.orange} strokeWidth="1.5" />
      <text x="346" y="63" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="system-ui" fill={A.orange}>Double</text>
      <text x="346" y="74" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="system-ui" fill={A.orange}>click</text>

      {/* Sticky note at bottom */}
      <rect x="40" y="100" width="100" height="56" rx="4" fill="#fefce8" stroke="#eab308" strokeWidth="1.2" />
      <text x="52" y="118" fontSize="8" fontWeight="600" fontFamily="system-ui" fill="#854d0e">Quick tip:</text>
      <text x="52" y="130" fontSize="8" fontFamily="system-ui" fill="#854d0e">Press V for select</text>
      <text x="52" y="142" fontSize="8" fontFamily="system-ui" fill="#854d0e">R for rectangle</text>

      {/* Selection handles on the rectangle */}
      <rect x="176" y="40" width="6" height="6" rx="1" fill={A.blue} />
      <rect x="264" y="40" width="6" height="6" rx="1" fill={A.blue} />
      <rect x="176" y="86" width="6" height="6" rx="1" fill={A.blue} />
      <rect x="264" y="86" width="6" height="6" rx="1" fill={A.blue} />
    </svg>
  )
}

/* ─── Tools ──────────────────────────────────────────────────────── */
export function ToolsIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="140" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Canvas area */}
      <rect x="72" y="20" width="300" height="120" rx="6" fill="rgba(69,133,209,0.03)" stroke={A.border} strokeWidth="0.8" strokeDasharray="4 3" />

      {/* Toolbar on left */}
      <rect x="30" y="24" width="32" height="112" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1.2" />
      {/* Select tool (active) */}
      <rect x="34" y="28" width="24" height="22" rx="4" fill={A.accentSoft} stroke={A.accent} strokeWidth="1.2" />
      <path d="M42 34 L46 42 L48 39 L52 41 L42 34Z" fill={A.accent} />
      {/* Pen tool */}
      <path d="M42 58 L44 52 L50 50 L52 56 L46 58Z" stroke={A.blue} strokeWidth="1.2" fill="none" />
      {/* Rectangle tool */}
      <rect x="38" y="66" width="14" height="10" rx="2" stroke={A.green} strokeWidth="1.2" fill="none" />
      {/* Circle tool */}
      <circle cx="46" cy="88" r="6" stroke={A.orange} strokeWidth="1.2" fill="none" />
      {/* Text tool */}
      <text x="46" y="108" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="system-ui" fill={A.purple}>T</text>

      {/* Shapes on canvas — a process flow */}
      <rect x="96" y="40" width="72" height="32" rx="4" fill="rgba(47,133,90,0.1)" stroke={A.green} strokeWidth="1.5" />
      <text x="132" y="60" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.green}>Research</text>

      <path d="M176 56 L200 56" stroke={A.muted} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M196 53 L202 56 L196 59" fill="none" stroke={A.muted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="208" y="40" width="72" height="32" rx="4" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="1.5" />
      <text x="244" y="60" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.blue}>Design</text>

      <path d="M288 56 L312 56" stroke={A.muted} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M308 53 L314 56 L308 59" fill="none" stroke={A.muted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="320" y="40" width="48" height="32" rx="4" fill="rgba(212,148,58,0.1)" stroke={A.orange} strokeWidth="1.5" />
      <text x="344" y="60" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.orange}>Build</text>

      {/* Sticky note */}
      <rect x="100" y="88" width="80" height="40" rx="3" fill="#fefce8" stroke="#eab308" strokeWidth="1" />
      <text x="110" y="104" fontSize="7" fontFamily="system-ui" fill="#854d0e">Next steps:</text>
      <text x="110" y="116" fontSize="7" fontFamily="system-ui" fill="#854d0e">- User testing</text>

      {/* Arrow annotation */}
      <path d="M220 88 L260 76" stroke={A.red} strokeWidth="1.2" strokeLinecap="round" />
      <text x="228" y="96" fontSize="7" fontFamily="system-ui" fill={A.red}>needs work</text>
    </svg>
  )
}

/* ─── Styling ────────────────────────────────────────────────────── */
export function StylingIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="140" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Board title */}
      <text x="40" y="32" fontSize="11" fontWeight="700" fontFamily="system-ui" fill={A.text}>Style options</text>

      {/* Rectangle — solid fill */}
      <rect x="40" y="44" width="64" height="40" rx="4" fill="rgba(47,133,90,0.15)" stroke={A.green} strokeWidth="2" />
      <text x="72" y="68" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.green}>Solid</text>

      {/* Rectangle — dashed stroke */}
      <rect x="120" y="44" width="64" height="40" rx="4" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="2" strokeDasharray="6 3" />
      <text x="152" y="68" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.blue}>Dashed</text>

      {/* Rectangle — thick border */}
      <rect x="200" y="44" width="64" height="40" rx="4" fill="rgba(212,148,58,0.08)" stroke={A.orange} strokeWidth="3" />
      <text x="232" y="68" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.orange}>Thick</text>

      {/* Circle — rounded style */}
      <circle cx="312" cy="64" r="22" fill="rgba(139,92,246,0.1)" stroke={A.purple} strokeWidth="2" />
      <text x="312" y="67" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.purple}>Circle</text>

      {/* Arrow with color */}
      <path d="M52 108 L140 108" stroke={A.red} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M134 104 L142 108 L134 112" fill="none" stroke={A.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="96" y="126" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill={A.red}>Colored arrow</text>

      {/* Sticky note with annotation */}
      <rect x="176" y="96" width="96" height="44" rx="3" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" />
      <text x="186" y="112" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#92400e">Notes:</text>
      <text x="186" y="124" fontSize="7" fontFamily="system-ui" fill="#92400e">Use color to group</text>
      <text x="186" y="134" fontSize="7" fontFamily="system-ui" fill="#92400e">related items</text>

      {/* Label */}
      <rect x="300" y="100" width="72" height="36" rx="4" fill="rgba(69,133,209,0.08)" stroke={A.blue} strokeWidth="1" />
      <text x="336" y="116" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.blue}>Label</text>
      <text x="336" y="128" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill={A.muted}>Group A</text>
    </svg>
  )
}

/* ─── Themes ─────────────────────────────────────────────────────── */
export function ThemesIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      {/* Split — light side */}
      <clipPath id="theme-light">
        <rect x="20" y="10" width="180" height="140" rx="10" />
      </clipPath>
      <clipPath id="theme-dark">
        <rect x="200" y="10" width="180" height="140" rx="10" />
      </clipPath>

      {/* Light side */}
      <g clipPath="url(#theme-light)">
        <rect x="20" y="10" width="180" height="140" fill="#f7f8fc" stroke={A.border} strokeWidth="1.5" />
        {/* Canvas content — light */}
        <rect x="36" y="28" width="60" height="32" rx="4" fill="rgba(47,133,90,0.1)" stroke={A.green} strokeWidth="1.5" />
        <text x="66" y="48" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.green}>Task</text>
        <circle cx="150" cy="44" r="16" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="1.5" />
        <text x="150" y="47" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.blue}>Idea</text>
        <path d="M100 56 L130 44" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <path d="M126 41 L132 44 L126 47" fill="none" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <rect x="36" y="76" width="140" height="28" rx="3" fill="#fefce8" stroke="#eab308" strokeWidth="1" />
        <text x="46" y="94" fontSize="7" fontFamily="system-ui" fill="#854d0e">Group meeting notes</text>
        <text x="110" y="142" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Light</text>
      </g>

      {/* Dark side */}
      <g clipPath="url(#theme-dark)">
        <rect x="200" y="10" width="180" height="140" fill="#181b22" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        {/* Canvas content — dark */}
        <rect x="216" y="28" width="60" height="32" rx="4" fill="rgba(82,189,107,0.15)" stroke={A.greenLight} strokeWidth="1.5" />
        <text x="246" y="48" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.greenLight}>Task</text>
        <circle cx="330" cy="44" r="16" fill="rgba(107,163,232,0.12)" stroke={A.blueLight} strokeWidth="1.5" />
        <text x="330" y="47" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.blueLight}>Idea</text>
        <path d="M280 56 L310 44" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
        <path d="M306 41 L312 44 L306 47" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
        <rect x="216" y="76" width="140" height="28" rx="3" fill="rgba(234,179,8,0.08)" stroke="rgba(234,179,8,0.4)" strokeWidth="1" />
        <text x="226" y="94" fontSize="7" fontFamily="system-ui" fill="rgba(234,179,8,0.8)">Group meeting notes</text>
        <text x="290" y="142" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="system-ui" fill="rgba(255,255,255,0.5)">Dark</text>
      </g>

      <line x1="200" y1="18" x2="200" y2="142" stroke={A.border} strokeWidth="1.5" strokeDasharray="4 3" />
    </svg>
  )
}

/* ─── Export ──────────────────────────────────────────────────────── */
export function ExportIllustration() {
  return (
    <svg viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="140" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Canvas with content being exported */}
      <rect x="36" y="24" width="140" height="108" rx="6" fill="rgba(69,133,209,0.03)" stroke={A.border} strokeWidth="0.8" />
      {/* Flowchart on canvas */}
      <rect x="48" y="36" width="56" height="28" rx="4" fill="rgba(47,133,90,0.1)" stroke={A.green} strokeWidth="1.2" />
      <text x="76" y="54" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.green}>Start</text>
      <path d="M108 50 L128 50" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
      <path d="M124 47 L130 50 L124 53" fill="none" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
      <rect x="136" y="36" width="32" height="28" rx="4" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="1.2" />
      <text x="152" y="54" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.blue}>Do</text>
      <path d="M152 68 L152 82" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
      <path d="M149 78 L152 84 L155 78" fill="none" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
      <rect x="124" y="88" width="56" height="28" rx="4" fill="rgba(212,148,58,0.1)" stroke={A.orange} strokeWidth="1.2" />
      <text x="152" y="106" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.orange}>Check</text>

      {/* Arrow to export panel */}
      <path d="M184 70 L210 70" stroke={A.accent} strokeWidth="2" strokeLinecap="round" />
      <path d="M206 66 L214 70 L206 74" fill="none" stroke={A.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Export dialog */}
      <rect x="220" y="24" width="148" height="108" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
      <rect x="220" y="24" width="148" height="24" rx="8" fill={A.accentSoft} />
      <text x="294" y="40" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="system-ui" fill={A.accent}>Export board</text>

      {/* Format options */}
      <rect x="232" y="58" width="60" height="28" rx="5" fill={A.accentSoft} stroke={A.accent} strokeWidth="1.5" />
      <text x="262" y="76" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="system-ui" fill={A.accent}>PNG</text>
      <rect x="300" y="58" width="60" height="28" rx="5" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <text x="330" y="76" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="system-ui" fill={A.muted}>PDF</text>
      <rect x="232" y="94" width="60" height="28" rx="5" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <text x="262" y="112" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="system-ui" fill={A.muted}>SVG</text>
      <rect x="300" y="94" width="60" height="28" rx="5" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <text x="330" y="112" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="system-ui" fill={A.muted}>JSON</text>
    </svg>
  )
}

/* ─── Tips ───────────────────────────────────────────────────────── */
export function TipsIllustration() {
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="120" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* Board title */}
      <text x="40" y="30" fontSize="10" fontWeight="700" fontFamily="system-ui" fill={A.text}>Pro tips</text>

      {/* Tip 1 — sticky note */}
      <rect x="36" y="38" width="100" height="52" rx="3" fill="#fefce8" stroke="#eab308" strokeWidth="1.2" />
      <text x="46" y="54" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#854d0e">Tip 1</text>
      <text x="46" y="66" fontSize="7" fontFamily="system-ui" fill="#854d0e">Hold space to pan</text>
      <text x="46" y="78" fontSize="7" fontFamily="system-ui" fill="#854d0e">around the canvas</text>

      {/* Tip 2 — sticky note */}
      <rect x="148" y="38" width="100" height="52" rx="3" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.2" />
      <text x="158" y="54" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#7c3aed">Tip 2</text>
      <text x="158" y="66" fontSize="7" fontFamily="system-ui" fill="#7c3aed">Ctrl+Z to undo</text>
      <text x="158" y="78" fontSize="7" fontFamily="system-ui" fill="#7c3aed">any mistake</text>

      {/* Tip 3 — sticky note */}
      <rect x="260" y="38" width="100" height="52" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.2" />
      <text x="270" y="54" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#166534">Tip 3</text>
      <text x="270" y="66" fontSize="7" fontFamily="system-ui" fill="#166534">Double-click to add</text>
      <text x="270" y="78" fontSize="7" fontFamily="system-ui" fill="#166534">text anywhere</text>

      {/* Arrow connecting tips */}
      <path d="M140 64 L148 64" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="3 2" />
      <path d="M250 64 L260 64" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="3 2" />

      {/* Bottom: keyboard shortcut reference */}
      <rect x="36" y="100" width="328" height="20" rx="4" fill={A.accentSoft} />
      <text x="50" y="114" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.accent}>Shortcuts:</text>
      <text x="108" y="114" fontSize="7" fontFamily="monospace" fill={A.muted}>V Select</text>
      <text x="158" y="114" fontSize="7" fontFamily="monospace" fill={A.muted}>R Rectangle</text>
      <text x="222" y="114" fontSize="7" fontFamily="monospace" fill={A.muted}>O Circle</text>
      <text x="276" y="114" fontSize="7" fontFamily="monospace" fill={A.muted}>T Text</text>
      <text x="318" y="114" fontSize="7" fontFamily="monospace" fill={A.muted}>P Pen</text>
    </svg>
  )
}

/* ─── FAQ ────────────────────────────────────────────────────────── */
export function FAQIllustration() {
  return (
    <svg viewBox="0 0 400 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true">
      <rect x="20" y="10" width="360" height="120" rx="10" fill={A.surface} stroke={A.border} strokeWidth="1.5" />

      {/* FAQ board layout */}
      <text x="40" y="30" fontSize="11" fontWeight="700" fontFamily="system-ui" fill={A.text}>Frequently asked</text>

      {/* Q1 card — open */}
      <rect x="36" y="38" width="160" height="44" rx="6" fill={A.accentSoft} stroke={A.accent} strokeWidth="1.5" />
      <text x="48" y="56" fontSize="8" fontWeight="700" fontFamily="system-ui" fill={A.accent}>Q: Is Kanvas free?</text>
      <text x="48" y="70" fontSize="7" fontFamily="system-ui" fill={A.muted}>A: Yes, fully free to use.</text>

      {/* Q2 card — closed */}
      <rect x="36" y="90" width="160" height="28" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <text x="48" y="108" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Q: Can I export my boards?</text>

      {/* Q3 card — closed */}
      <rect x="208" y="38" width="160" height="28" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <text x="220" y="56" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Q: Does it work offline?</text>

      {/* Q4 card — closed */}
      <rect x="208" y="74" width="160" height="28" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1" />
      <text x="220" y="92" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Q: How do I share boards?</text>

      {/* Q5 card — closed */}
      <rect x="208" y="110" width="160" height="12" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1" />
    </svg>
  )
}
