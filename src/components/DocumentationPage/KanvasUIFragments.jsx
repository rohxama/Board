/* Non-interactive fragments of real Kanvas UI components.
   Used in documentation to show authentic interface elements
   without requiring context providers or interactivity. */

/* ─── Icon: real Kanvas icon SVGs ──────────────────────────────── */
const C = { common: { fill: 'none', stroke: 'currentColor', strokeWidth: 1.85, strokeLinecap: 'round', strokeLinejoin: 'round' } }

const iconPaths = {
  cursor: <path d="m5 3 6 17 2-7 7-2L5 3Z" {...C.common} />,
  hand: <><path d="M5 12h14M8 10V5a1.5 1.5 0 0 1 3 0v5V3.5a1.5 1.5 0 0 1 3 0V10V5a1.5 1.5 0 0 1 3 0v6" {...C.common} /><path d="M8 11 6.8 8.3a1.5 1.5 0 0 0-2.1 2.1l4.4 6a3.8 3.8 0 0 0 3.2 1.6h2.2a4 4 0 0 0 4-4V11" {...C.common} /></>,
  square: <rect x="4" y="4" width="16" height="16" rx="2" {...C.common} />,
  circle: <circle cx="12" cy="12" r="8" {...C.common} />,
  diamond: <path d="M12 3 21 12 12 21 3 12 12 3" {...C.common} />,
  arrow: <path d="M5 19 19 5M8 5h11v11" {...C.common} />,
  line: <path d="M5 19 19 5" {...C.common} />,
  pen: <><path d="m4 20 4-1 10-10-3-3L5 16l-1 4Z" {...C.common} /><path d="m13 8 3 3" {...C.common} /></>,
  laser: <><path d="M4 7V5h2M18 5h2v2M20 17v2h-2M6 19H4v-2M5 12h14" {...C.common} /></>,
  text: <><path d="M4 6V4h16v2M12 4v16M8 20h8" {...C.common} /></>,
  eraser: <path d="m7 19-3-3a2 2 0 0 1 0-3l7-7a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-5 5H7Z" {...C.common} />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" {...C.common} /><circle cx="8" cy="9" r="1" {...C.common} /><path d="m21 15-5-5L5 20" {...C.common} /></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14" {...C.common} /></>,
  upload: <><path d="M12 15V3M7 8l5-5 5 5M5 21h14" {...C.common} /></>,
  undo: <path d="M9 7 4 12l5 5M4 12h10a5 5 0 0 1 5 5" {...C.common} />,
  redo: <path d="m15 7 5 5-5 5M20 12H10a5 5 0 0 0-5 5" {...C.common} />,
  moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" {...C.common} />,
  sun: <><circle cx="12" cy="12" r="4" {...C.common} /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" {...C.common} /></>,
  settings: <><circle cx="12" cy="12" r="3" {...C.common} /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" {...C.common} /></>,
  home: <><path d="m4 11 8-7 8 7" {...C.common} /><path d="M6.5 10.5V20h11v-9.5M10 20v-5h4v5" {...C.common} /></>,
  info: <><circle cx="12" cy="12" r="9" {...C.common} /><path d="M12 11v5M12 8h.01" strokeWidth="2.2" {...C.common} /></>,
  code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 5l-2 14" {...C.common} /></>,
  file: <><path d="M13 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8l-5-5Z" {...C.common} /><path d="M13 3v5h5" {...C.common} /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" {...C.common} /><path d="M5 15V5a2 2 0 0 1 2-2h10" {...C.common} /></>,
  print: <><path d="M6 9V4h12v5M6 18H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1M6 14h12v6H6v-6Z" {...C.common} /></>,
  trash: <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13M10 11v6M14 11v6" {...C.common} /></>,
  'chevron-left': <path d="m15 18-6-6 6-6" {...C.common} />,
  chevron: <path d="m9 18 6-6-6-6" {...C.common} />,
}

export function KanvasIcon({ name, size = 19 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block', flex: '0 0 auto' }}>
      {iconPaths[name] || null}
    </svg>
  )
}

/* ─── ToolbarFrag: non-interactive left toolbar ────────────────── */
const TOOLS = [
  ['select', 'cursor', 'Select', 'V'],
  ['pan', 'hand', 'Pan', 'H'],
  ['rectangle', 'square', 'Rectangle', 'R'],
  ['ellipse', 'circle', 'Ellipse', 'O'],
  ['diamond', 'diamond', 'Diamond', 'D'],
  ['arrow', 'arrow', 'Arrow', 'A'],
  ['line', 'line', 'Line', 'L'],
  ['pen', 'pen', 'Pencil', 'P'],
  ['laser', 'laser', 'Laser', 'K'],
  ['eraser', 'eraser', 'Eraser', 'E'],
  ['text', 'text', 'Text', 'T'],
]

export function ToolbarFrag({ activeTool = 'select', className = '' }) {
  return (
    <nav className={`left-toolbar is-open doc-frag-toolbar ${className}`} aria-label="Drawing tools" style={{ position: 'relative', pointerEvents: 'none' }}>
      {TOOLS.slice(0, 2).map(([tool, icon, label]) => (
        <button key={tool} className={activeTool === tool ? 'active' : ''} aria-label={label}>
          <KanvasIcon name={icon} />
          <span className="tool-label">{label}</span>
        </button>
      ))}
      <span className="tool-divider" />
      {TOOLS.slice(2, 7).map(([tool, icon, label]) => (
        <button key={tool} className={activeTool === tool ? 'active' : ''} aria-label={label}>
          <KanvasIcon name={icon} />
          <span className="tool-label">{label}</span>
        </button>
      ))}
      <span className="tool-divider" />
      {TOOLS.slice(7).map(([tool, icon, label]) => (
        <button key={tool} className={activeTool === tool ? 'active' : ''} aria-label={label}>
          <KanvasIcon name={icon} />
          <span className="tool-label">{label}</span>
        </button>
      ))}
      <span className="tool-divider" />
      <button aria-label="Insert image">
        <KanvasIcon name="image" />
        <span className="tool-label">Image</span>
      </button>
    </nav>
  )
}

/* ─── StylePanelFrag: non-interactive style panel ──────────────── */
const STROKE_COLORS = ['#111111', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']
const BG_COLORS = ['#111111', '#ef4444', '#f97316', '#eab308', '#22c55e']

export function StylePanelFrag({ className = '' }) {
  return (
    <aside className={`style-panel is-open doc-frag-stylepanel ${className}`} aria-label="Properties inspector" style={{ position: 'relative', pointerEvents: 'none' }}>
      <div className="inspector-tabs" role="tablist">
        <button type="button" role="tab" aria-selected="true" className="inspector-tab is-active">Style</button>
        <button type="button" role="tab" aria-selected="false" className="inspector-tab">Arrange</button>
      </div>
      <div className="inspector-body">
        <section className="inspector-section">
          <h3>Stroke</h3>
          <div className="swatch-row">
            {STROKE_COLORS.map(color => (
              <button key={color} type="button" className={`swatch${color === '#111111' ? ' is-selected' : ''}`} style={{ background: color }} title={color} />
            ))}
          </div>
        </section>
        <section className="inspector-section">
          <h3>Background</h3>
          <div className="swatch-row">
            {BG_COLORS.map(color => (
              <button key={color} type="button" className="swatch" style={{ background: color }} title={color} />
            ))}
            <button type="button" className="swatch swatch-transparent" title="Transparent">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19L19 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </section>
        <section className="inspector-section">
          <h3>Stroke width</h3>
          <div className="option-row">
            {[1, 3, 6].map(w => (
              <button key={w} type="button" className={`option-btn${w === 1 ? ' is-selected' : ''}`}>
                <svg viewBox="0 0 24 24"><path d="M4 12h16" stroke="currentColor" strokeWidth={w} strokeLinecap="round" /></svg>
              </button>
            ))}
          </div>
        </section>
        <section className="inspector-section">
          <h3>Stroke style</h3>
          <div className="option-row">
            {[{ v: 'solid', d: 'none' }, { v: 'dashed', d: '5 4' }, { v: 'dotted', d: '0.1 3.4' }].map(({ v, d }) => (
              <button key={v} type="button" className={`option-btn${v === 'solid' ? ' is-selected' : ''}`}>
                <svg viewBox="0 0 24 24"><path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray={d} /></svg>
              </button>
            ))}
          </div>
        </section>
        <section className="inspector-section">
          <h3>Opacity</h3>
          <div className="opacity-row">
            <span className="opacity-end-label">0</span>
            <input type="range" min="0" max="100" defaultValue="100" readOnly aria-label="Opacity" />
            <span className="opacity-end-label">100</span>
          </div>
        </section>
      </div>
    </aside>
  )
}

/* ─── ZoomFrag: non-interactive zoom controls ──────────────────── */
export function ZoomFrag({ percent = '100', className = '' }) {
  return (
    <div className={`zoom-controls doc-frag-zoom ${className}`} style={{ position: 'relative', pointerEvents: 'none' }}>
      <button title="Zoom out" aria-label="Zoom out">−</button>
      <button className="zoom-percent-btn" title="Zoom levels" aria-label="Zoom levels">{percent}%</button>
      <button title="Zoom in" aria-label="Zoom in">+</button>
      <span className="zoom-divider" aria-hidden="true" />
      <button title="Toggle fullscreen" aria-label="Toggle fullscreen" className="fullscreen-button">⤢</button>
    </div>
  )
}
