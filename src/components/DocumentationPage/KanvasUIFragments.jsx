/* Non-interactive fragments of real Kanvas UI components.
   Used in documentation to show authentic interface elements
   without requiring context providers or interactivity. */

import {
  MousePointer2, Hand, Square, Circle, Diamond, ArrowUpRight, Minus,
  Pencil, Crosshair, Type, Eraser, Image, Download, Upload, Undo2,
  Redo2, Moon, Sun, Settings, Home, Info, Code, File, Copy, Printer,
  Trash2, ChevronRight, ChevronLeft,
} from 'lucide-react'

const ICON_STROKE = 1.85

const LUCIDE_ICONS = {
  cursor: MousePointer2,
  hand: Hand,
  square: Square,
  circle: Circle,
  diamond: Diamond,
  arrow: ArrowUpRight,
  line: Minus,
  pen: Pencil,
  laser: Crosshair,
  text: Type,
  eraser: Eraser,
  image: Image,
  download: Download,
  upload: Upload,
  undo: Undo2,
  redo: Redo2,
  moon: Moon,
  sun: Sun,
  settings: Settings,
  home: Home,
  info: Info,
  code: Code,
  file: File,
  copy: Copy,
  print: Printer,
  trash: Trash2,
  'chevron-left': ChevronLeft,
  chevron: ChevronRight,
}

export function KanvasIcon({ name, size = 19 }) {
  const Icon = LUCIDE_ICONS[name]
  if (!Icon) return null
  return (
    <span style={{ display: 'block', flex: '0 0 auto', lineHeight: 0 }} aria-hidden="true">
      <Icon size={size} strokeWidth={ICON_STROKE} />
    </span>
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
