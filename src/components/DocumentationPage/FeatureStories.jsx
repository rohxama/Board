/* Feature story components — visual storytelling diagrams for key docs sections.
   Each story depicts realistic canvas compositions a user would build in Kanvas. */

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

function FeatureStory({ heading, description, diagram, steps }) {
  return (
    <div className="doc-feature-story">
      <div className="doc-feature-story-text">
        <h3 className="doc-feature-story-heading">{heading}</h3>
        <p className="doc-feature-story-desc">{description}</p>
      </div>
      <div className="doc-feature-story-visual">
        {diagram}
      </div>
      <div className="doc-feature-story-steps">
        {steps.map((step, i) => (
          <div key={i} className="doc-feature-story-step">
            <span className="doc-feature-story-step-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="doc-feature-story-step-label">{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Getting Started: From Idea to Board ────────────────────────── */
function GettingStartedDiagram() {
  return (
    <svg viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-feature-svg" aria-hidden="true">
      {/* Step 1: Empty canvas with dot grid */}
      <g>
        <rect x="10" y="16" width="100" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {[28,44,60,76,92].map(x => [32,48,64,80].map(y => (
          <circle key={`a${x}${y}`} cx={x} cy={y} r="0.8" fill={A.muted} opacity="0.25" />
        )))}
        <text x="60" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Empty board</text>
      </g>

      <path d="M120 58 L140 58" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M136 55 L142 58 L136 61" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 2: Added shapes — a small flow */}
      <g>
        <rect x="150" y="16" width="100" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="162" y="28" width="36" height="20" rx="3" fill="rgba(47,133,90,0.1)" stroke={A.green} strokeWidth="1.2" />
        <text x="180" y="41" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill={A.green}>Plan</text>
        <path d="M202 38 L218 38" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <path d="M214 36 L220 38 L214 40" fill="none" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <rect x="224" y="28" width="16" height="20" rx="3" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="1.2" />
        <circle cx="180" cy="68" r="12" fill="rgba(212,148,58,0.08)" stroke={A.orange} strokeWidth="1.2" />
        <text x="180" y="71" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill={A.orange}>Idea</text>
        <path d="M180 52 L180 56" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <path d="M178 54 L180 58 L182 54" fill="none" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <text x="200" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Add shapes</text>
      </g>

      <path d="M260 58 L280 58" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M276 55 L282 58 L276 61" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 3: Connected with arrows */}
      <g>
        <rect x="290" y="16" width="100" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="302" y="28" width="36" height="20" rx="3" fill="rgba(47,133,90,0.1)" stroke={A.green} strokeWidth="1.2" />
        <text x="320" y="41" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill={A.green}>Plan</text>
        <path d="M342 38 L358 38" stroke={A.orange} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M354 35 L360 38 L354 41" fill="none" stroke={A.orange} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="364" y="28" width="16" height="20" rx="3" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="1.2" />
        <circle cx="320" cy="68" r="12" fill="rgba(212,148,58,0.08)" stroke={A.orange} strokeWidth="1.2" />
        <text x="320" y="71" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill={A.orange}>Idea</text>
        <path d="M320 52 L320 56" stroke={A.orange} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M318 54 L320 58 L322 54" fill="none" stroke={A.orange} strokeWidth="1.2" strokeLinecap="round" />
        {/* Sticky note */}
        <rect x="350" y="56" width="32" height="24" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.8" />
        <text x="356" y="68" fontSize="5" fontFamily="system-ui" fill="#854d0e">Review</text>
        <text x="356" y="76" fontSize="5" fontFamily="system-ui" fill="#854d0e">with team</text>
        <text x="340" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Connect</text>
      </g>

      <path d="M400 58 L420 58" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M416 55 L422 58 L416 61" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 4: Styled and polished */}
      <g>
        <rect x="430" y="16" width="80" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="440" y="26" width="56" height="18" rx="3" fill="rgba(47,133,90,0.15)" stroke={A.green} strokeWidth="1.8" />
        <text x="468" y="38" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="system-ui" fill={A.green}>Launch</text>
        <path d="M468 46 L468 58" stroke={A.orange} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M465 54 L468 60 L471 54" fill="none" stroke={A.orange} strokeWidth="1.5" strokeLinecap="round" />
        <rect x="444" y="64" width="48" height="24" rx="3" fill="rgba(139,92,246,0.1)" stroke={A.purple} strokeWidth="1.5" />
        <text x="468" y="80" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.purple}>Ship it</text>
        <text x="470" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Style</text>
      </g>
    </svg>
  )
}

/* ─── Styling Objects: From Plain to Polished ─────────────────────── */
function StylingStoryDiagram() {
  return (
    <svg viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-feature-svg" aria-hidden="true">
      {/* Step 1: Plain unstyled shapes */}
      <g>
        <rect x="10" y="20" width="100" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="30" y="36" width="56" height="32" rx="3" fill="none" stroke={A.muted} strokeWidth="1.2" />
        <circle cx="58" cy="84" r="10" fill="none" stroke={A.muted} strokeWidth="1.2" />
        <text x="60" y="124" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Plain shapes</text>
      </g>

      <path d="M120 62 L142 62" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M138 59 L144 62 L138 65" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 2: Apply color */}
      <g>
        <rect x="152" y="20" width="100" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="172" y="36" width="56" height="32" rx="3" fill="rgba(47,133,90,0.15)" stroke={A.green} strokeWidth="2" />
        <circle cx="200" cy="84" r="10" fill="rgba(212,148,58,0.12)" stroke={A.orange} strokeWidth="2" />
        {/* Style panel */}
        <rect x="236" y="28" width="8" height="40" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
        <rect x="238" y="32" width="4" height="4" rx="1" fill={A.green} />
        <rect x="238" y="40" width="4" height="4" rx="1" fill={A.blue} />
        <rect x="238" y="48" width="4" height="4" rx="1" fill={A.orange} />
        <rect x="238" y="56" width="4" height="4" rx="1" fill={A.purple} />
        <text x="202" y="124" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Add color</text>
      </g>

      <path d="M262 62 L284 62" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M280 59 L286 62 L280 65" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 3: Adjust stroke and dash */}
      <g>
        <rect x="294" y="20" width="100" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="314" y="36" width="56" height="32" rx="3" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="2" strokeDasharray="6 3" />
        <circle cx="342" cy="84" r="10" fill="rgba(212,148,58,0.08)" stroke={A.orange} strokeWidth="3" />
        <text x="344" y="124" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Stroke style</text>
      </g>

      <path d="M404 62 L426 62" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M422 59 L428 62 L422 65" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 4: Final styled composition */}
      <g>
        <rect x="436" y="20" width="74" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="446" y="30" width="50" height="24" rx="4" fill="rgba(47,133,90,0.15)" stroke={A.green} strokeWidth="2" />
        <text x="471" y="46" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="system-ui" fill={A.green}>Styled</text>
        <circle cx="471" cy="72" r="12" fill="rgba(139,92,246,0.12)" stroke={A.purple} strokeWidth="2" />
        <text x="471" y="75" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill={A.purple}>Look</text>
        <path d="M471 56 L471 58" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <text x="473" y="124" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Done</text>
      </g>
    </svg>
  )
}

/* ─── Export: From Canvas to File ─────────────────────────────────── */
function ExportStoryDiagram() {
  return (
    <svg viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-feature-svg" aria-hidden="true">
      {/* Step 1: Canvas with content */}
      <g>
        <rect x="10" y="16" width="100" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="22" y="28" width="40" height="24" rx="3" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="1.2" />
        <text x="42" y="44" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill={A.blue}>Design</text>
        <circle cx="82" cy="40" r="10" fill="rgba(212,148,58,0.08)" stroke={A.orange} strokeWidth="1.2" />
        <path d="M30 68 L70 62" stroke={A.green} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M66 59 L72 62 L66 65" fill="none" stroke={A.green} strokeWidth="1.2" strokeLinecap="round" />
        <rect x="22" y="78" width="70" height="14" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.8" />
        <text x="30" y="88" fontSize="6" fontFamily="system-ui" fill="#854d0e">Project notes</text>
        <text x="60" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Your board</text>
      </g>

      <path d="M120 58 L142 58" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M138 55 L144 58 L138 61" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 2: Open export menu */}
      <g>
        <rect x="152" y="16" width="100" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="168" y="28" width="68" height="60" rx="6" fill={A.surface} stroke={A.border} strokeWidth="1.2" />
        <rect x="168" y="28" width="68" height="18" rx="6" fill={A.accentSoft} />
        <text x="202" y="40" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="system-ui" fill={A.accent}>Export</text>
        <rect x="176" y="52" width="52" height="10" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
        <text x="202" y="60" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill={A.muted}>PNG</text>
        <rect x="176" y="66" width="52" height="10" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
        <text x="202" y="74" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill={A.muted}>PDF</text>
        <rect x="176" y="80" width="52" height="10" rx="2" fill={A.surface} stroke={A.border} strokeWidth="0.8" />
        <text x="202" y="88" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill={A.muted}>SVG</text>
        <text x="202" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Click Export</text>
      </g>

      <path d="M262 58 L284 58" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M280 55 L286 58 L280 61" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 3: Choose format */}
      <g>
        <rect x="294" y="16" width="100" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="306" y="28" width="36" height="24" rx="4" fill={A.accentSoft} stroke={A.accent} strokeWidth="1.5" />
        <text x="324" y="44" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill={A.accent}>PNG</text>
        <rect x="348" y="28" width="36" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="366" y="44" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>PDF</text>
        <rect x="306" y="58" width="36" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="324" y="74" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>SVG</text>
        <rect x="348" y="58" width="36" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="366" y="74" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>JSON</text>
        <text x="344" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Pick format</text>
      </g>

      <path d="M404 58 L426 58" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M422 55 L428 58 L422 61" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 4: Downloaded file */}
      <g>
        <rect x="436" y="16" width="74" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="452" y="30" width="42" height="28" rx="4" fill={A.accentSoft} stroke={A.accent} strokeWidth="1.5" />
        <text x="473" y="48" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill={A.accent}>PNG</text>
        <path d="M473 64 L473 76" stroke={A.accent} strokeWidth="2" strokeLinecap="round" />
        <path d="M468 72 L473 78 L478 72" fill="none" stroke={A.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="473" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Download</text>
      </g>
    </svg>
  )
}

/* ─── Zoom & Navigation: Explore the Canvas ──────────────────────── */
function NavigationStoryDiagram() {
  return (
    <svg viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-feature-svg" aria-hidden="true">
      {/* Step 1: Zoomed in — see details */}
      <g>
        <rect x="10" y="16" width="110" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="20" y="26" width="90" height="58" rx="4" fill="rgba(69,133,209,0.03)" stroke={A.border} strokeWidth="0.6" />
        {/* Zoomed-in content */}
        <rect x="26" y="32" width="52" height="24" rx="3" fill="rgba(47,133,90,0.12)" stroke={A.green} strokeWidth="1.5" />
        <text x="52" y="48" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.green}>Sprint 1</text>
        <rect x="26" y="62" width="36" height="16" rx="2" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="1" />
        <text x="44" y="73" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill={A.blue}>Task A</text>
        <rect x="68" y="62" width="36" height="16" rx="2" fill="rgba(212,148,58,0.1)" stroke={A.orange} strokeWidth="1" />
        <text x="86" y="73" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill={A.orange}>Task B</text>
        {/* Zoom indicator */}
        <rect x="22" y="82" width="36" height="12" rx="3" fill={A.accentSoft} />
        <text x="40" y="91" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="system-ui" fill={A.accent}>150%</text>
        <text x="65" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Zoom in</text>
      </g>

      <path d="M130 58 L152 58" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M148 55 L154 58 L148 61" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 2: Pan to see more */}
      <g>
        <rect x="162" y="16" width="110" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="172" y="26" width="90" height="58" rx="4" fill="rgba(69,133,209,0.03)" stroke={A.border} strokeWidth="0.6" />
        {/* Panned view — shifted content */}
        <rect x="192" y="32" width="44" height="20" rx="3" fill="rgba(139,92,246,0.1)" stroke={A.purple} strokeWidth="1.2" />
        <text x="214" y="45" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill={A.purple}>Research</text>
        <circle cx="248" cy="42" r="10" fill="rgba(212,148,58,0.08)" stroke={A.orange} strokeWidth="1.2" />
        <text x="248" y="45" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill={A.orange}>Idea</text>
        <path d="M214 54 L236 48" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <path d="M232 45 L238 48 L232 51" fill="none" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <rect x="192" y="62" width="60" height="16" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.8" />
        <text x="200" y="73" fontSize="6" fontFamily="system-ui" fill="#854d0e">Follow up on...</text>
        <text x="217" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Pan around</text>
      </g>

      <path d="M282 58 L304 58" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M300 55 L306 58 L300 61" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 3: Zoom to fit all */}
      <g>
        <rect x="314" y="16" width="110" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="324" y="26" width="90" height="58" rx="4" fill="rgba(69,133,209,0.03)" stroke={A.border} strokeWidth="0.6" />
        {/* All content visible */}
        <rect x="330" y="32" width="28" height="16" rx="2" fill="rgba(47,133,90,0.1)" stroke={A.green} strokeWidth="1" />
        <text x="344" y="43" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.green}>A</text>
        <rect x="364" y="32" width="28" height="16" rx="2" fill="rgba(69,133,209,0.1)" stroke={A.blue} strokeWidth="1" />
        <text x="378" y="43" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill={A.blue}>B</text>
        <rect x="398" y="32" width="16" height="16" rx="2" fill="rgba(212,148,58,0.1)" stroke={A.orange} strokeWidth="1" />
        <circle cx="344" cy="62" r="8" fill="rgba(139,92,246,0.08)" stroke={A.purple} strokeWidth="1" />
        <rect x="364" y="56" width="48" height="16" rx="2" fill="#fefce8" stroke="#eab308" strokeWidth="0.6" />
        <text x="372" y="67" fontSize="5" fontFamily="system-ui" fill="#854d0e">Notes</text>
        <path d="M340 48 L340 54" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />
        <path d="M358 42 L362 42 L358 48" fill="none" stroke={A.muted} strokeWidth="0.8" strokeLinecap="round" />
        {/* Fit corners */}
        <path d="M320 22 L320 18 L324 18" stroke={A.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M418 22 L418 18 L414 18" stroke={A.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M320 82 L320 86 L324 86" stroke={A.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M418 82 L418 86 L414 86" stroke={A.accent} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="369" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Fit to view</text>
      </g>

      <path d="M434 58 L456 58" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M452 55 L458 58 L452 61" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 4: Navigate freely */}
      <g>
        <rect x="466" y="16" width="44" height="84" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Mini overview map */}
        <rect x="474" y="28" width="28" height="56" rx="3" fill="rgba(69,133,209,0.04)" stroke={A.border} strokeWidth="0.6" />
        <rect x="478" y="34" width="8" height="6" rx="1" fill={A.green} opacity="0.5" />
        <rect x="490" y="34" width="6" height="8" rx="1" fill={A.blue} opacity="0.5" />
        <circle cx="482" cy="52" r="4" fill={A.orange} opacity="0.4" />
        <rect x="490" y="50" width="8" height="6" rx="1" fill={A.purple} opacity="0.4" />
        <rect x="478" y="64" width="16" height="8" rx="1" fill={A.yellow} opacity="0.3" />
        {/* Viewport indicator */}
        <rect x="476" y="32" width="16" height="24" rx="1" fill="none" stroke={A.accent} strokeWidth="1" strokeDasharray="2 1" />
        <text x="488" y="118" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill={A.muted}>Overview</text>
      </g>
    </svg>
  )
}

export {
  FeatureStory,
  GettingStartedDiagram,
  StylingStoryDiagram,
  ExportStoryDiagram,
  NavigationStoryDiagram,
}
