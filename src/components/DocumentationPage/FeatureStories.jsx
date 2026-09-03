/* Feature story components — visual storytelling diagrams for key docs sections.
   Each story: heading + explanation + SVG diagram + numbered steps. */

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
      {/* Step 1: Empty canvas */}
      <g>
        <rect x="10" y="20" width="100" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Dot grid */}
        {[30,50,70,90].map(x => [40,60,80].map(y => (
          <circle key={`a${x}${y}`} cx={x} cy={y} r="1" fill={A.muted} opacity="0.3" />
        )))}
        <text x="60" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Open</text>
      </g>

      {/* Arrow 1→2 */}
      <path d="M120 60 L140 60" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M136 56 L142 60 L136 64" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 2: Choose tool */}
      <g>
        <rect x="150" y="20" width="100" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Toolbar mockup */}
        <rect x="162" y="34" width="24" height="52" rx="4" fill={A.accentSoft} stroke={A.green} strokeWidth="1.5" />
        {/* Tool icons */}
        <path d="M170 42 L174 50 L176 47 L180 49 L170 42Z" fill={A.green} />
        <rect x="168" y="54" width="8" height="6" rx="1" fill={A.blue} opacity="0.6" />
        <circle cx="174" cy="70" r="4" fill={A.orange} opacity="0.6" />
        <path d="M170 78 L174 84 L178 78" fill="none" stroke={A.purple} strokeWidth="1.2" strokeLinecap="round" />
        <text x="200" y="65" fontSize="9" fontWeight="600" fill={A.muted}>Choose</text>
        <text x="200" y="76" fontSize="9" fontWeight="600" fill={A.muted}>tool</text>
        <text x="200" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Select</text>
      </g>

      {/* Arrow 2→3 */}
      <path d="M260 60 L280 60" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M276 56 L282 60 L276 64" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 3: Create shapes */}
      <g>
        <rect x="290" y="20" width="100" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Shapes being created */}
        <rect x="304" y="36" width="36" height="26" rx="3" fill="rgba(69,133,209,0.12)" stroke={A.blue} strokeWidth="1.5" />
        <circle cx="366" cy="52" r="16" fill="rgba(212,148,58,0.1)" stroke={A.orange} strokeWidth="1.5" />
        <path d="M310 80 L350 70" stroke={A.green} strokeWidth="2" strokeLinecap="round" />
        <path d="M344 66 L352 70 L344 74" fill="none" stroke={A.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="340" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Create</text>
      </g>

      {/* Arrow 3→4 */}
      <path d="M400 60 L420 60" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M416 56 L422 60 L416 64" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 4: Edit & style */}
      <g>
        <rect x="430" y="20" width="80" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Selected shape with handles */}
        <rect x="446" y="36" width="40" height="30" rx="3" fill="rgba(82,189,107,0.12)" stroke={A.green} strokeWidth="2" />
        <rect x="442" y="32" width="6" height="6" rx="1" fill={A.green} />
        <rect x="484" y="32" width="6" height="6" rx="1" fill={A.green} />
        <rect x="442" y="64" width="6" height="6" rx="1" fill={A.green} />
        <rect x="484" y="64" width="6" height="6" rx="1" fill={A.green} />
        <line x1="466" y1="28" x2="466" y2="22" stroke={A.green} strokeWidth="1.5" />
        <circle cx="466" cy="19" r="3" fill={A.green} />
        <text x="470" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Style</text>
      </g>
    </svg>
  )
}

/* ─── Styling Objects: From Plain to Polished ─────────────────────── */
function StylingStoryDiagram() {
  return (
    <svg viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-feature-svg" aria-hidden="true">
      {/* Step 1: Plain shape */}
      <g>
        <rect x="10" y="25" width="100" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="35" y="45" width="50" height="35" rx="3" fill="none" stroke={A.muted} strokeWidth="1.5" />
        <text x="60" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Select</text>
      </g>

      {/* Arrow */}
      <path d="M120 65 L145 65" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M141 61 L147 65 L141 69" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 2: Pick color */}
      <g>
        <rect x="155" y="25" width="110" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Color palette */}
        <circle cx="180" cy="46" r="8" fill={A.blue} />
        <circle cx="200" cy="46" r="8" fill={A.green} />
        <circle cx="220" cy="46" r="8" fill={A.orange} />
        <circle cx="240" cy="46" r="8" fill={A.purple} />
        {/* Selected indicator */}
        <circle cx="200" cy="46" r="11" stroke={A.green} strokeWidth="2" fill="none" />
        {/* Colored shape */}
        <rect x="170" y="68" width="50" height="28" rx="3" fill="rgba(47,133,90,0.12)" stroke={A.green} strokeWidth="2" />
        <text x="210" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Color</text>
      </g>

      {/* Arrow */}
      <path d="M275 65 L300 65" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M296 61 L302 65 L296 69" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 3: Adjust stroke */}
      <g>
        <rect x="310" y="25" width="110" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Stroke width options */}
        <line x1="330" y1="42" x2="360" y2="42" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <line x1="330" y1="52" x2="360" y2="52" stroke={A.muted} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="330" y1="62" x2="360" y2="62" stroke={A.muted} strokeWidth="4" strokeLinecap="round" />
        {/* Selected */}
        <rect x="324" y="47" width="42" height="10" rx="3" fill={A.accentSoft} stroke={A.accent} strokeWidth="1" />
        {/* Dashed style option */}
        <line x1="375" y1="42" x2="405" y2="42" stroke={A.muted} strokeWidth="1.5" strokeDasharray="4 2" strokeLinecap="round" />
        <line x1="375" y1="52" x2="405" y2="52" stroke={A.muted} strokeWidth="1.5" strokeLinecap="round" />
        <text x="365" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Stroke</text>
      </g>

      {/* Arrow */}
      <path d="M430 65 L455 65" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M451 61 L457 65 L451 69" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 4: Final polished shape */}
      <g>
        <rect x="465" y="25" width="48" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="475" y="40" width="28" height="22" rx="4" fill="rgba(47,133,90,0.15)" stroke={A.green} strokeWidth="2.5" />
        <text x="489" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Done</text>
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
        <rect x="10" y="20" width="100" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="24" y="34" width="36" height="24" rx="3" fill="rgba(69,133,209,0.12)" stroke={A.blue} strokeWidth="1.5" />
        <circle cx="80" cy="46" r="12" fill="rgba(212,148,58,0.1)" stroke={A.orange} strokeWidth="1.5" />
        <path d="M30 76 L70 68" stroke={A.green} strokeWidth="1.5" strokeLinecap="round" />
        <text x="60" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Create</text>
      </g>

      {/* Arrow */}
      <path d="M120 60 L145 60" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M141 56 L147 60 L141 64" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 2: Click Export */}
      <g>
        <rect x="155" y="20" width="100" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Export button */}
        <rect x="175" y="38" width="60" height="24" rx="6" fill={A.accent} />
        <text x="205" y="54" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">Export</text>
        {/* Cursor clicking */}
        <path d="M210 68 L216 80 L220 76 L226 78 L210 68Z" fill={A.text} stroke={A.surface} strokeWidth="1" />
        <text x="205" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Click Export</text>
      </g>

      {/* Arrow */}
      <path d="M265 60 L290 60" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M286 56 L292 60 L286 64" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 3: Choose format */}
      <g>
        <rect x="300" y="20" width="110" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Format options */}
        <rect x="314" y="32" width="38" height="28" rx="4" fill={A.accentSoft} stroke={A.accent} strokeWidth="1.5" />
        <text x="333" y="50" textAnchor="middle" fontSize="9" fontWeight="700" fill={A.accent}>PNG</text>
        <rect x="358" y="32" width="38" height="28" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="377" y="50" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>PDF</text>
        <rect x="314" y="66" width="38" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="333" y="82" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>SVG</text>
        <rect x="358" y="66" width="38" height="24" rx="4" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="377" y="82" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>JSON</text>
        <text x="355" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Choose format</text>
      </g>

      {/* Arrow */}
      <path d="M420 60 L445 60" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M441 56 L447 60 L441 64" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 4: Download */}
      <g>
        <rect x="455" y="20" width="55" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        <rect x="467" y="36" width="32" height="24" rx="4" fill={A.accentSoft} stroke={A.accent} strokeWidth="1.5" />
        <text x="483" y="52" textAnchor="middle" fontSize="8" fontWeight="700" fill={A.accent}>PNG</text>
        {/* Download arrow */}
        <path d="M483 68 L483 82" stroke={A.accent} strokeWidth="2" strokeLinecap="round" />
        <path d="M478 78 L483 84 L488 78" fill="none" stroke={A.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="483" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Download</text>
      </g>
    </svg>
  )
}

/* ─── Zoom & Navigation: Explore the Canvas ──────────────────────── */
function NavigationStoryDiagram() {
  return (
    <svg viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-feature-svg" aria-hidden="true">
      {/* Step 1: Scroll to zoom */}
      <g>
        <rect x="10" y="20" width="110" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Mini canvas with shapes at different zoom */}
        <rect x="22" y="32" width="86" height="56" rx="4" fill="rgba(69,133,209,0.06)" stroke={A.blue} strokeWidth="1" />
        <rect x="30" y="40" width="24" height="16" rx="2" fill="rgba(69,133,209,0.12)" stroke={A.blue} strokeWidth="1" />
        <circle cx="76" cy="56" r="10" fill="rgba(212,148,58,0.1)" stroke={A.orange} strokeWidth="1" />
        {/* Zoom indicator */}
        <rect x="30" y="64" width="32" height="14" rx="3" fill={A.accentSoft} />
        <text x="46" y="74" textAnchor="middle" fontSize="8" fontWeight="700" fill={A.accent}>100%</text>
        {/* Scroll icon */}
        <rect x="82" y="68" width="10" height="14" rx="5" fill="none" stroke={A.muted} strokeWidth="1.2" />
        <path d="M87 72 L87 76" stroke={A.muted} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M85 74 L87 72 L89 74" fill="none" stroke={A.muted} strokeWidth="1" strokeLinecap="round" />
        <text x="65" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Scroll to zoom</text>
      </g>

      {/* Arrow */}
      <path d="M130 60 L155 60" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M151 56 L157 60 L151 64" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 2: Space + drag to pan */}
      <g>
        <rect x="165" y="20" width="110" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Canvas with grid */}
        {[180,200,220,240,260].map(x => (
          <line key={`v${x}`} x1={x} y1="28" x2={x} y2="92" stroke={A.muted} strokeWidth="0.5" opacity="0.2" />
        ))}
        {[35,50,65,80].map(y => (
          <line key={`h${y}`} x1="173" y1={y} x2="267" y2={y} stroke={A.muted} strokeWidth="0.5" opacity="0.2" />
        ))}
        {/* Shapes */}
        <rect x="180" y="38" width="30" height="20" rx="2" fill="rgba(69,133,209,0.12)" stroke={A.blue} strokeWidth="1" />
        <circle cx="248" cy="55" r="12" fill="rgba(82,189,107,0.1)" stroke={A.green} strokeWidth="1" />
        {/* Pan hand icon */}
        <path d="M218 70 L218 64 L222 60 L226 64 L226 70" fill="none" stroke={A.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Space key */}
        <rect x="196" y="80" width="44" height="12" rx="3" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="218" y="89" textAnchor="middle" fontSize="7" fontWeight="700" fill={A.muted}>SPACE</text>
        <text x="220" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Space + drag</text>
      </g>

      {/* Arrow */}
      <path d="M285 60 L310 60" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M306 56 L312 60 L306 64" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 3: Zoom to fit */}
      <g>
        <rect x="320" y="20" width="110" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* All content fitting in view */}
        <rect x="332" y="32" width="28" height="20" rx="2" fill="rgba(69,133,209,0.12)" stroke={A.blue} strokeWidth="1" />
        <circle cx="380" cy="44" r="12" fill="rgba(212,148,58,0.1)" stroke={A.orange} strokeWidth="1" />
        <rect x="400" y="60" width="20" height="16" rx="2" fill="rgba(139,92,246,0.1)" stroke={A.purple} strokeWidth="1" />
        <path d="M340 72 L370 64" stroke={A.green} strokeWidth="1.5" strokeLinecap="round" />
        {/* Fit frame corners */}
        <path d="M328 28 L328 24 L332 24" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M422 28 L422 24 L418 24" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M328 92 L328 96 L332 96" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M422 92 L422 96 L418 96" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Keyboard shortcut */}
        <rect x="340" y="80" width="14" height="12" rx="2" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="347" y="89" textAnchor="middle" fontSize="6" fontWeight="700" fill={A.muted}>⇧</text>
        <rect x="358" y="80" width="10" height="12" rx="2" fill={A.surface} stroke={A.border} strokeWidth="1" />
        <text x="363" y="89" textAnchor="middle" fontSize="6" fontWeight="700" fill={A.muted}>1</text>
        <text x="375" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Zoom to fit</text>
      </g>

      {/* Arrow */}
      <path d="M440 60 L465 60" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M461 56 L467 60 L461 64" fill="none" stroke={A.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Step 4: Navigate freely */}
      <g>
        <rect x="475" y="20" width="38" height="80" rx="8" fill={A.surface} stroke={A.border} strokeWidth="1.5" />
        {/* Compass-like icon */}
        <circle cx="494" cy="52" r="16" fill="none" stroke={A.muted} strokeWidth="1" />
        <path d="M494 38 L498 50 L494 48 L490 50 Z" fill={A.accent} />
        <path d="M494 66 L490 54 L494 56 L498 54 Z" fill={A.muted} opacity="0.4" />
        <text x="494" y="130" textAnchor="middle" fontSize="9" fontWeight="600" fill={A.muted}>Free</text>
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
