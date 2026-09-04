import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../../context/ThemeContext'
import siteIcon from '../../assets/images/site-logo-removebg-preview.png'
import {
  GettingStartedIllustration,
  ThemesIllustration,
  ExportIllustration,
  TipsIllustration,
  FAQIllustration,
} from './DocIllustrations'
import {
  ColorLabHero,
  SwatchDisplay,
  FillDemo,
  StrokeWidthDemo,
  StrokeStyleDemo,
  OpacityDemo,
  CornerStyleDemo,
  CombinedStylesDemo,
  FontSizeDemo,
} from './ColorLab'
import {
  FeatureStory,
  StylingStoryDiagram,
  ExportStoryDiagram,
} from './FeatureStories'
import {
  SectionBreak,
  ToolsBreakIllustration,
  ZoomBreakIllustration,
  StylingBreakIllustration,
  ExportBreakIllustration,
  ShortcutsBreakIllustration,
} from './SectionBreaks'
import { ToolbarFrag, StylePanelFrag, KanvasIcon } from './KanvasUIFragments'
import {
  Maximize2, ChevronRight, ChevronDown, Menu, X, MousePointer2, Hand, Square, Circle,
  Diamond, ArrowUpRight, Minus, Pencil, Crosshair, Type, Eraser, Image,
  Download, ZoomIn, Undo2, Redo2, Palette, Sun, Moon, File, Code, Copy,
  Printer, Camera, FileText, Layers, Info, Play, Zap, ArrowUp,
} from 'lucide-react'

const NAV = [
  {
    id: 'cat-getting-started',
    label: 'Getting Started',
    items: [
      { id: 'getting-started', label: 'Introduction' },
    ],
  },
  {
    id: 'cat-tools',
    label: 'Tools',
    items: [
      { id: 'tools', label: 'All Tools' },
    ],
  },
  {
    id: 'cat-canvas',
    label: 'Canvas',
    items: [
      { id: 'zoom', label: 'Zoom & Navigation' },
    ],
  },
  {
    id: 'cat-editing',
    label: 'Editing',
    items: [
      { id: 'undo-redo', label: 'Undo & Redo' },
    ],
  },
  {
    id: 'cat-styling',
    label: 'Styling',
    items: [
      { id: 'styling', label: 'Style Controls' },
      { id: 'themes', label: 'Light & Dark Mode' },
    ],
  },
  {
    id: 'cat-export',
    label: 'Export',
    items: [
      { id: 'export', label: 'Export Options' },
    ],
  },
  {
    id: 'cat-reference',
    label: 'Reference',
    items: [
      { id: 'shortcuts', label: 'Keyboard Shortcuts' },
      { id: 'tips', label: 'Tips' },
      { id: 'faq', label: 'FAQ' },
    ],
  },
]

const ICON_SIZE = 18
const ICON_STROKE = 1.85

const LUCIDE_MAP = {
  logo: Square,
  board: Maximize2,
  chevron: ChevronRight,
  'chevron-down': ChevronDown,
  menu: Menu,
  close: X,
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
  zoom: ZoomIn,
  undo: Undo2,
  redo: Redo2,
  palette: Palette,
  sun: Sun,
  moon: Moon,
  file: File,
  code: Code,
  copy: Copy,
  print: Printer,
  camera: Camera,
  pdf: FileText,
  svg: Layers,
  json: FileText,
  lock: File,
  flip: Maximize2,
  layers: Layers,
  info: Info,
  play: Play,
  zap: Zap,
}

function NavIcon({ name }) {
  const Icon = LUCIDE_MAP[name]
  if (!Icon) return null
  return (
    <span className="doc-nav-icon">
      <Icon size={ICON_SIZE} strokeWidth={ICON_STROKE} />
    </span>
  )
}

function ToolCard({ icon, name, shortcut, description, howToUse, tips, visual, className }) {
  return (
    <div className={`doc-tool-card${className ? ' ' + className : ''}`}>
      <div className="doc-tool-visual-area">
        {visual}
      </div>
      <div className="doc-tool-info">
        <div className="doc-tool-header">
          <div className="doc-tool-icon-wrap"><NavIcon name={icon} /></div>
          <div className="doc-tool-title-group">
            <h3 className="doc-tool-name">{name}</h3>
            {shortcut && <kbd className="doc-tool-kbd">{shortcut}</kbd>}
          </div>
        </div>
        <p className="doc-tool-desc">{description}</p>
        {howToUse && (
          <div className="doc-tool-steps">
            <span className="doc-tool-steps-label">How to use</span>
            <ol className="doc-tool-step-list">
              {howToUse.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>
        )}
        {tips && (
          <div className="doc-tool-tip">
            <NavIcon name="zap" />
            <span>{tips}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const MODIFIER_KEYS = new Set(['Ctrl', 'Shift', 'Alt', 'Cmd'])

function ShortcutRow({ keys, action }) {
  return (
    <div className="doc-shortcut-row">
      <div className="doc-shortcut-keys">
        {keys.map((k, i) => (
          <span key={i} className="doc-shortcut-key-group">
            {i > 0 && <span className="doc-shortcut-sep" aria-hidden="true">+</span>}
            <kbd className={`doc-shortcut-kbd${MODIFIER_KEYS.has(k) ? ' is-modifier' : ''}`}>{k}</kbd>
          </span>
        ))}
      </div>
      <span className="doc-shortcut-action">{action}</span>
    </div>
  )
}

function FAQItem({ question, answer, index }) {
  const [open, setOpen] = useState(false)
  const num = String(index + 1).padStart(2, '0')
  return (
    <div className={`doc-faq-item${open ? ' is-open' : ''}`}>
      <button className="doc-faq-question" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <span className="doc-faq-num">{num}</span>
        <span className="doc-faq-dot" aria-hidden="true" />
        <span className="doc-faq-qtext">{question}</span>
        <span className={`doc-faq-chevron${open ? ' rotated' : ''}`}><NavIcon name="chevron" /></span>
      </button>
      <div className={`doc-faq-answer-wrap${open ? ' is-open' : ''}`}>
        <div className="doc-faq-answer">{answer}</div>
      </div>
    </div>
  )
}

function useHeadingToc(contentRef) {
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    if (!contentRef.current) return
    const els = contentRef.current.querySelectorAll('h2[id], h3[id]')
    const items = Array.from(els).map(el => ({
      id: el.id,
      text: el.textContent.trim(),
      level: parseInt(el.tagName[1], 10),
    }))
    const tree = []
    let currentH2 = null
    for (const item of items) {
      if (item.level === 2) {
        currentH2 = { ...item, children: [] }
        tree.push(currentH2)
      } else if (item.level === 3 && currentH2) {
        currentH2.children.push(item)
      } else if (item.level === 3) {
        currentH2 = { ...item, children: [] }
        tree.push(currentH2)
      }
    }
    setHeadings(tree)
  }, [contentRef])

  return headings
}

/* Four-step workflow: Think → Choose → Draw → Ship.
   Each step shows a realistic mini-board illustration so the
   reader sees the action (what to do) and the result (what
   the board looks like after doing it). */
const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Think',
    desc: 'Start with an idea. Every great board begins with a single thought — a concept, a problem, a spark.',
    color: '#10b981',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-workflow-illust" aria-hidden="true">
        <rect x="8" y="8" width="48" height="48" rx="4" fill="rgba(16,185,129,0.04)" stroke="#10b981" strokeWidth="0.8" />
        <rect x="14" y="14" width="24" height="16" rx="2" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="0.8" />
        <text x="26" y="25" textAnchor="middle" fontSize="5" fontWeight="500" fontFamily="system-ui" fill="#10b981">Idea</text>
        {/* Selection state on Idea rect */}
        <rect x="10" y="10" width="32" height="24" rx="3" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="6" y="6" width="4" height="4" rx="1" fill="var(--accent)" />
        <rect x="42" y="6" width="4" height="4" rx="1" fill="var(--accent)" />
        <rect x="6" y="32" width="4" height="4" rx="1" fill="var(--accent)" />
        <rect x="42" y="32" width="4" height="4" rx="1" fill="var(--accent)" />
        <path d="M42 22 L50 22" stroke="#10b981" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M48 20 L52 22 L48 24" fill="none" stroke="#10b981" strokeWidth="0.6" strokeLinecap="round" />
        <rect x="14" y="38" width="18" height="12" rx="1" fill="rgba(234,179,8,0.06)" stroke="#eab308" strokeWidth="0.6" />
        <text x="23" y="46" textAnchor="middle" fontSize="4" fontFamily="system-ui" fill="#854d0e">Notes</text>
        <circle cx="48" cy="44" r="6" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth="0.6" />
        <text x="48" y="46" textAnchor="middle" fontSize="4" fontWeight="500" fontFamily="system-ui" fill="#3b82f6">Plan</text>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Choose',
    desc: 'Pick the right tool. Rectangle, ellipse, arrow, pencil — each shape serves a purpose.',
    color: '#3b82f6',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-workflow-illust" aria-hidden="true">
        <rect x="6" y="12" width="14" height="40" rx="2" fill="rgba(59,130,246,0.04)" stroke="#3b82f6" strokeWidth="0.8" />
        <rect x="8" y="14" width="10" height="8" rx="1.5" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="0.6" />
        <path d="M11 28 L13 32 L15 29" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeLinecap="round" />
        <rect x="8" y="36" width="10" height="8" rx="1" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
        <circle cx="13" cy="50" r="3" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
        <rect x="26" y="16" width="20" height="14" rx="1.5" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth="0.8" />
        <circle cx="52" cy="23" r="8" fill="rgba(59,130,246,0.05)" stroke="#3b82f6" strokeWidth="0.8" />
        <path d="M30 44 L44 44 L44 52 L30 52Z" fill="rgba(59,130,246,0.04)" stroke="#3b82f6" strokeWidth="0.6" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Draw',
    desc: 'Turn it into shapes and sketches. Click and drag to bring your ideas to life on the canvas.',
    color: '#8b5cf6',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-workflow-illust" aria-hidden="true">
        <rect x="10" y="28" width="22" height="14" rx="1.5" stroke="#8b5cf6" strokeWidth="0.8" fill="rgba(139,92,246,0.05)" />
        <circle cx="46" cy="35" r="10" stroke="#8b5cf6" strokeWidth="0.8" fill="rgba(139,92,246,0.05)" />
        <path d="M36 35 L38 35" stroke="#8b5cf6" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M14 16 L30 16 L30 24 L14 24Z" fill="rgba(139,92,246,0.04)" stroke="#8b5cf6" strokeWidth="0.5" />
        <text x="22" y="21" textAnchor="middle" fontSize="4" fontFamily="system-ui" fill="#8b5cf6">Label</text>
        <path d="M22 46 L22 52" stroke="#8b5cf6" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M20 50 L22 54 L24 50" fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Style',
    desc: 'Add color and visual hierarchy. Use strokes, fills, and opacity to make your ideas pop.',
    color: '#f97066',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-workflow-illust" aria-hidden="true">
        <rect x="10" y="14" width="22" height="16" rx="2" stroke="#f97066" strokeWidth="1" fill="rgba(249,112,102,0.08)" />
        <rect x="36" y="14" width="22" height="16" rx="2" stroke="#f97066" strokeWidth="1" strokeDasharray="4 3" fill="rgba(249,112,102,0.04)" />
        <circle cx="18" cy="46" r="6" fill="rgba(249,112,102,0.08)" stroke="#f97066" strokeWidth="0.8" />
        {/* Selection state on center circle */}
        <circle cx="36" cy="46" r="10" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 2" />
        <rect x="30" y="40" width="4" height="4" rx="1" fill="var(--accent)" />
        <rect x="38" y="40" width="4" height="4" rx="1" fill="var(--accent)" />
        <rect x="30" y="48" width="4" height="4" rx="1" fill="var(--accent)" />
        <rect x="38" y="48" width="4" height="4" rx="1" fill="var(--accent)" />
        <circle cx="36" cy="46" r="6" fill="rgba(249,112,102,0.12)" stroke="#f97066" strokeWidth="0.8" />
        <circle cx="52" cy="46" r="6" fill="rgba(249,112,102,0.18)" stroke="#f97066" strokeWidth="0.8" />
        <path d="M14 36h14" stroke="#f97066" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Organize',
    desc: 'Arrange your ideas on the infinite canvas. Group related concepts and create visual flow.',
    color: '#f59e0b',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-workflow-illust" aria-hidden="true">
        <rect x="6" y="8" width="18" height="12" rx="1.5" stroke="#f59e0b" strokeWidth="0.8" fill="rgba(245,158,11,0.05)" />
        <rect x="40" y="8" width="18" height="12" rx="1.5" stroke="#f59e0b" strokeWidth="0.8" fill="rgba(245,158,11,0.05)" />
        <rect x="22" y="30" width="20" height="12" rx="1.5" stroke="#f59e0b" strokeWidth="0.8" fill="rgba(245,158,11,0.05)" />
        <rect x="6" y="46" width="16" height="10" rx="1.5" stroke="#f59e0b" strokeWidth="0.8" fill="rgba(245,158,11,0.05)" />
        <rect x="42" y="46" width="16" height="10" rx="1.5" stroke="#f59e0b" strokeWidth="0.8" fill="rgba(245,158,11,0.05)" />
        <path d="M15 20v4l17 8M49 20v4L32 30" stroke="#f59e0b" strokeWidth="0.6" strokeLinecap="round" strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Export',
    desc: 'Take your work wherever you need it. Download as PNG, JPG, PDF, or share a JSON to continue later.',
    color: '#ec4899',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-workflow-illust" aria-hidden="true">
        <rect x="8" y="8" width="28" height="48" rx="3" stroke="#ec4899" strokeWidth="0.8" fill="rgba(236,72,153,0.04)" />
        <rect x="12" y="14" width="20" height="10" rx="1.5" fill="rgba(236,72,153,0.06)" stroke="#ec4899" strokeWidth="0.6" />
        <rect x="12" y="28" width="20" height="5" rx="1" fill="rgba(236,72,153,0.04)" />
        <rect x="12" y="38" width="14" height="5" rx="1" fill="rgba(236,72,153,0.04)" />
        <path d="M44 24 L52 24" stroke="#ec4899" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M49 21 L54 24 L49 27" fill="none" stroke="#ec4899" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="44" y="32" width="14" height="10" rx="2" fill="rgba(236,72,153,0.06)" stroke="#ec4899" strokeWidth="0.6" />
        <text x="51" y="40" textAnchor="middle" fontSize="4" fontWeight="500" fontFamily="system-ui" fill="#ec4899">PNG</text>
        <rect x="44" y="46" width="14" height="10" rx="2" fill="rgba(236,72,153,0.04)" stroke="#ec4899" strokeWidth="0.5" />
        <text x="51" y="54" textAnchor="middle" fontSize="4" fontWeight="500" fontFamily="system-ui" fill="#ec4899">PDF</text>
      </svg>
    ),
  },
]

function WorkflowConnector({ color }) {
  return (
    <svg className="doc-workflow-arrow" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4 12C12 12 16 8 24 12C32 16 36 12 44 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />
      <path
        d="M40 8l4 4-4 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function WorkflowSection() {
  return (
    <section className="doc-section doc-workflow-section" id="workflow">
      <h2 className="doc-section-title">
        <NavIcon name="play" /> From Idea to Canvas
      </h2>
      <p className="doc-section-intro">
        Every creation follows a journey. Here is how ideas become something real in Kanvas.
      </p>

      <div className="doc-workflow-board" aria-label="Workflow: Think, Choose, Draw, Style, Organize, Export">
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={step.num} className="doc-workflow-step-wrap">
            <div className="doc-workflow-step" style={{ '--wf-color': step.color }}>
              <span className="doc-workflow-num">{step.num}</span>
              <div className="doc-workflow-illust-wrap">
                {step.illustration}
              </div>
              <h3 className="doc-workflow-heading">{step.title}</h3>
              <p className="doc-workflow-desc">{step.desc}</p>
            </div>
            {i < WORKFLOW_STEPS.length - 1 && (
              <WorkflowConnector color={step.color} />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

const DEMO_COLORS = [
  { name: 'Green', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Coral', value: '#f97066' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Slate', value: '#64748b' },
  { name: 'Black', value: '#1e293b' },
]

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      className={`doc-back-to-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      type="button"
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={16} strokeWidth={2} />
    </button>
  )
}

/* Interactive Styling Demo — the user clicks swatches and buttons
   to change stroke color, fill, width, style, corners, and opacity.
   The result is immediately visible on the canvas shape. This
   teaches the action→result loop: pick a property → see the change. */
function StylingDemo() {
  const [strokeColor, setStrokeColor] = useState('#3b82f6')
  const [fillColor, setFillColor] = useState('transparent')
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [strokeStyle, setBorderStyle] = useState('solid')
  const [rounded, setRounded] = useState(false)
  const [opacity, setOpacity] = useState(100)
  const [showTooltip, setShowTooltip] = useState(null)

  return (
    <div className="doc-demo doc-styling-demo">
      <div className="doc-demo-label">Interactive Demo — Try It</div>
      <div className="doc-styling-layout">
        <svg
          className="doc-styling-canvas"
          viewBox="0 0 220 180"
          aria-label="Interactive shape demonstration"
          role="img"
        >
          <rect
            x="35" y="25" width="150" height="130"
            rx={rounded ? 16 : 0}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeStyle === 'dashed' ? '10 5' : strokeStyle === 'dotted' ? '3 4' : 'none'}
            fill={fillColor}
            opacity={opacity / 100}
            style={{ transition: 'all 0.2s ease' }}
          />
          <circle cx="60" cy="55" r="12" fill={strokeColor} opacity="0.15" />
          <circle cx="160" cy="125" r="18" fill={strokeColor} opacity="0.1" />
          <text x="110" y="98" textAnchor="middle" fill={strokeColor} fontSize="13" fontFamily="inherit" fontWeight="500" opacity={Math.max(opacity / 100, 0.3)}>
            Kanvas
          </text>
        </svg>

        <div className="doc-styling-controls">
          <div className="doc-styling-control-group">
            <span className="doc-styling-control-label">Stroke</span>
            <div className="doc-styling-swatches" role="radiogroup" aria-label="Stroke color">
              {DEMO_COLORS.map(c => (
                <button
                  key={c.value}
                  className={`doc-styling-swatch${strokeColor === c.value ? ' active' : ''}`}
                  style={{ '--sw-color': c.value }}
                  onClick={() => setStrokeColor(c.value)}
                  aria-label={c.name}
                  aria-pressed={strokeColor === c.value}
                  onMouseEnter={() => setShowTooltip(c.name)}
                  onMouseLeave={() => setShowTooltip(null)}
                />
              ))}
            </div>
          </div>

          <div className="doc-styling-control-group">
            <span className="doc-styling-control-label">Fill</span>
            <div className="doc-styling-swatches" role="radiogroup" aria-label="Fill color">
              <button
                className={`doc-styling-swatch doc-styling-swatch--none${fillColor === 'transparent' ? ' active' : ''}`}
                onClick={() => setFillColor('transparent')}
                aria-label="No fill"
                aria-pressed={fillColor === 'transparent'}
              />
              {DEMO_COLORS.slice(0, 5).map(c => (
                <button
                  key={c.value}
                  className={`doc-styling-swatch${fillColor === c.value ? ' active' : ''}`}
                  style={{ '--sw-color': c.value }}
                  onClick={() => setFillColor(c.value)}
                  aria-label={c.name}
                  aria-pressed={fillColor === c.value}
                />
              ))}
            </div>
          </div>

          <div className="doc-styling-control-row">
            <div className="doc-styling-control-group">
              <span className="doc-styling-control-label">Width</span>
              <div className="doc-styling-btn-group" role="radiogroup" aria-label="Stroke width">
                {[1, 3, 6].map(w => (
                  <button
                    key={w}
                    className={`doc-styling-btn${strokeWidth === w ? ' active' : ''}`}
                    onClick={() => setStrokeWidth(w)}
                    aria-pressed={strokeWidth === w}
                  >
                    <span className="doc-styling-width-preview" style={{ height: w }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="doc-styling-control-group">
              <span className="doc-styling-control-label">Style</span>
              <div className="doc-styling-btn-group" role="radiogroup" aria-label="Stroke style">
                {['solid', 'dashed', 'dotted'].map(s => (
                  <button
                    key={s}
                    className={`doc-styling-btn${strokeStyle === s ? ' active' : ''}`}
                    onClick={() => setBorderStyle(s)}
                    aria-pressed={strokeStyle === s}
                  >
                    <span className={`doc-styling-style-preview doc-styling-style-preview--${s}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="doc-styling-control-row">
            <div className="doc-styling-control-group">
              <span className="doc-styling-control-label">Corners</span>
              <button
                className={`doc-styling-toggle${rounded ? ' active' : ''}`}
                onClick={() => setRounded(v => !v)}
                aria-pressed={rounded}
                aria-label={`Corners: ${rounded ? 'rounded' : 'sharp'}`}
              >
                {rounded ? 'Rounded' : 'Sharp'}
              </button>
            </div>

            <div className="doc-styling-control-group">
              <span className="doc-styling-control-label">Opacity — {opacity}%</span>
              <input
                className="doc-styling-slider"
                type="range"
                min="10"
                max="100"
                step="5"
                value={opacity}
                onChange={e => setOpacity(Number(e.target.value))}
                aria-label={`Opacity: ${opacity}%`}
              />
            </div>
          </div>
        </div>
      </div>
      {showTooltip && <div className="doc-demo-tooltip" role="status">{showTooltip}</div>}
    </div>
  )
}

/* Interactive Theme Demo — the user clicks the toggle switch.
   The action: flip from light to dark. The result: every surface,
   stroke, and text color updates instantly. Same shapes, new
   palette. Teaches that theming is global, not per-shape. */
function ThemeToggleDemo() {
  const [isDark, setIsDark] = useState(false)

  return (
    <div className="doc-demo doc-theme-demo">
      <div className="doc-demo-label">Interactive Demo — Toggle Theme</div>
      <div className={`doc-theme-demo-canvas${isDark ? ' dark' : ' light'}`}>
        <div className="doc-theme-demo-grid" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="doc-theme-demo-dot" />
          ))}
        </div>
        <div className="doc-theme-demo-shapes" aria-hidden="true">
          <div className="doc-theme-demo-rect" />
          <div className="doc-theme-demo-circle" />
          <div className="doc-theme-demo-note" />
        </div>
        <div className="doc-theme-demo-toolbar" aria-hidden="true">
          <span className="doc-theme-demo-tool doc-theme-demo-tool--active" />
          <span className="doc-theme-demo-tool" />
          <span className="doc-theme-demo-tool" />
          <span className="doc-theme-demo-tool" />
        </div>
      </div>
      <button
        className="doc-theme-demo-toggle"
        onClick={() => setIsDark(v => !v)}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        aria-pressed={isDark}
      >
        <span className="doc-theme-demo-toggle-track">
          <span className="doc-theme-demo-toggle-thumb" />
          <span className="doc-theme-demo-toggle-icon">
            {isDark ? (
              <Moon size={14} fill="currentColor" strokeWidth={0} />
            ) : (
              <Sun size={14} fill="currentColor" strokeWidth={2} />
            )}
          </span>
        </span>
        <span className="doc-theme-demo-toggle-label">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
      </button>
    </div>
  )
}

/* Interactive Zoom Demo — the user scrolls to zoom, clicks and
   drags to pan. The action: zoom in/out or drag. The result: the
   canvas scales and shifts, revealing detail or overview. Teaches
   the two core navigation gestures: scroll-to-zoom, drag-to-pan. */
function ZoomDemo() {
  const [zoom, setZoom] = useState(100)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const lastPos = useRef(null)
  const canvasRef = useRef(null)

  const handleMouseDown = useCallback((e) => {
    setIsPanning(true)
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isPanning || !lastPos.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setPan(p => ({ x: p.x + dx, y: p.y + dy }))
  }, [isPanning])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    lastPos.current = null
  }, [])

  useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isPanning, handleMouseMove, handleMouseUp])

  const scale = zoom / 100

  return (
    <div className="doc-demo doc-zoom-demo">
      <div className="doc-demo-label">Interactive Demo — Zoom & Pan</div>
      <div
        className={`doc-zoom-demo-canvas${isPanning ? ' panning' : ''}`}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        role="application"
        aria-label={`Zoom demo at ${zoom}%. Click and drag to pan.`}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 25, 300))
          else if (e.key === '-') setZoom(z => Math.max(z - 25, 25))
          else if (e.key === '0') { setZoom(100); setPan({ x: 0, y: 0 }) }
        }}
      >
        <div
          className="doc-zoom-demo-world"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
        >
          <div className="doc-zoom-demo-shape doc-zoom-demo-shape--rect" />
          <div className="doc-zoom-demo-shape doc-zoom-demo-shape--circle" />
          <div className="doc-zoom-demo-shape doc-zoom-demo-shape--note" />
          <div className="doc-zoom-demo-shape doc-zoom-demo-shape--label" />
        </div>
      </div>
      <div className="doc-zoom-demo-controls">
        <button
          className="doc-zoom-demo-btn"
          onClick={() => setZoom(z => Math.max(z - 25, 25))}
          aria-label="Zoom out"
          disabled={zoom <= 25}
        >
          −
        </button>
        <span className="doc-zoom-demo-level">{zoom}%</span>
        <button
          className="doc-zoom-demo-btn"
          onClick={() => setZoom(z => Math.min(z + 25, 300))}
          aria-label="Zoom in"
          disabled={zoom >= 300}
        >
          +
        </button>
        <button
          className="doc-zoom-demo-btn doc-zoom-demo-btn--reset"
          onClick={() => { setZoom(100); setPan({ x: 0, y: 0 }) }}
          aria-label="Reset zoom"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default function DocumentationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [activeTocId, setActiveTocId] = useState('')
  const [tocOpen, setTocOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    const init = {}
    NAV.forEach(cat => { init[cat.id] = true })
    if (NAV.length) init[NAV[0].id] = false
    return init
  })
  const contentRef = useRef(null)
  const sidebarRef = useRef(null)
  const { darkMode } = useTheme()
  const tocHeadings = useHeadingToc(contentRef)

  const toggleCategory = useCallback(catId => {
    setCollapsed(prev => ({ ...prev, [catId]: !prev[catId] }))
  }, [])

  const scrollTo = useCallback(id => {
    const el = document.getElementById(id)
    if (el) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: prefersReduced ? 'instant' : 'smooth', block: 'start' })
      setSidebarOpen(false)
    }
  }, [])

  const findCategoryForItem = useCallback(itemId => {
    for (const cat of NAV) {
      if (cat.items.some(item => item.id === itemId)) return cat.id
    }
    return null
  }, [])

  const handleSidebarKeyDown = useCallback(e => {
    if (!sidebarRef.current) return
    const links = Array.from(sidebarRef.current.querySelectorAll('.doc-sidebar-item-btn:not([disabled])'))
    const idx = links.indexOf(document.activeElement)
    if (idx === -1) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = links[idx + 1]
      if (next) next.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = links[idx - 1]
      if (prev) prev.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      links[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      links[links.length - 1]?.focus()
    }
  }, [])

  // Focus trap for mobile sidebar overlay
  useEffect(() => {
    if (!sidebarOpen) return
    const isMobile = window.matchMedia('(max-width: 900px)').matches
    if (!isMobile) return

    const sidebar = sidebarRef.current
    if (!sidebar) return

    const focusableSelector = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

    function handleTrapKeyDown(e) {
      if (e.key !== 'Tab') return
      const focusable = Array.from(sidebar.querySelectorAll(focusableSelector))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    sidebar.addEventListener('keydown', handleTrapKeyDown)
    // Focus the first focusable element on open
    const firstBtn = sidebar.querySelector(focusableSelector)
    firstBtn?.focus()

    return () => sidebar.removeEventListener('keydown', handleTrapKeyDown)
  }, [sidebarOpen])

  useEffect(() => {
    document.title = 'Documentation — Kanvas'
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )
    const sections = contentRef.current?.querySelectorAll('[id]')
    sections?.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const tocIds = new Set()
    tocHeadings.forEach(h => {
      tocIds.add(h.id)
      h.children.forEach(c => tocIds.add(c.id))
    })
    if (tocIds.size === 0) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          )
          setActiveTocId(top.target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )
    const el = contentRef.current
    if (!el) return
    el.querySelectorAll('h2[id], h3[id]').forEach(h => {
      if (tocIds.has(h.id)) observer.observe(h)
    })
    return () => observer.disconnect()
  }, [tocHeadings])

  useEffect(() => {
    if (!activeSection) return
    const catId = findCategoryForItem(activeSection)
    if (catId && collapsed[catId]) {
      setCollapsed(prev => ({ ...prev, [catId]: false }))
    }
  }, [activeSection, collapsed, findCategoryForItem])

  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!els.length) return
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('doc-revealed')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.15 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="doc-page">
      {/* Skip to content link for keyboard users */}
      <a href="#doc-main-content" className="doc-skip-link">
        Skip to main content
      </a>
      <header className="doc-header">
        <div className="doc-header-inner">
          <div className="doc-header-left">
            <img className="doc-logo-icon" src={siteIcon} alt="Kanvas" />
            <span className="doc-brand">Kanvas</span>
            <span className="doc-tagline">Think. Draw. Create.</span>
          </div>
          <a href="#/" className="doc-back-btn">
            <NavIcon name="board" />
            <span>Open Whiteboard</span>
          </a>
        </div>
      </header>

      <div className="doc-hero">
        <span className="doc-hero-label">DOCUMENTATION</span>
        <h1 className="doc-hero-title">Learn Kanvas</h1>
        <p className="doc-hero-sub">Everything you need to know to start creating.</p>
        <p className="doc-hero-desc">Explore Kanvas tools and features and learn how to create, draw, design, organize, and export your ideas.</p>
      </div>

      <div className="doc-layout">
        <aside
          ref={sidebarRef}
          className={`doc-sidebar${sidebarOpen ? ' is-open' : ''}`}
          role="navigation"
          aria-label="Documentation navigation"
          onKeyDown={handleSidebarKeyDown}
        >
          <div className="doc-sidebar-scroll">
            <nav className="doc-sidebar-nav">
              {NAV.map(cat => {
                const isCollapsed = collapsed[cat.id]
                const hasActiveChild = cat.items.some(item => item.id === activeSection)
                return (
                  <div key={cat.id} className={`doc-sidebar-group${hasActiveChild ? ' has-active' : ''}`}>
                    <button
                      className="doc-sidebar-cat-btn"
                      onClick={() => toggleCategory(cat.id)}
                      aria-expanded={!isCollapsed}
                      type="button"
                    >
                      <span className="doc-sidebar-cat-label">{cat.label}</span>
                      <span className={`doc-sidebar-cat-chevron${isCollapsed ? '' : ' open'}`}>
                        <ChevronDown size={16} strokeWidth={2} />
                      </span>
                    </button>
                    {!isCollapsed && (
                      <div className="doc-sidebar-items" role="list">
                        {cat.items.map(item => (
                          <button
                            key={item.id}
                            className={`doc-sidebar-item-btn${activeSection === item.id ? ' active' : ''}`}
                            onClick={() => scrollTo(item.id)}
                            role="listitem"
                            tabIndex={0}
                            type="button"
                          >
                            <span className="doc-sidebar-item-indicator" aria-hidden="true" />
                            <span className="doc-sidebar-item-label">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </aside>

        <button className="doc-mobile-nav-toggle" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle navigation">
          <NavIcon name={sidebarOpen ? 'close' : 'menu'} />
          <span>Navigation</span>
        </button>

        <button
          className={`doc-mobile-toc-toggle${tocOpen ? ' is-open' : ''}`}
          onClick={() => setTocOpen(v => !v)}
          aria-label="Toggle on this page"
          aria-expanded={tocOpen}
        >
          <NavIcon name="layers" />
          <span>On this page</span>
        </button>

        {tocOpen && tocHeadings.length > 0 && (
          <div className="doc-mobile-toc-panel" role="navigation" aria-label="On this page">
            <nav className="doc-mobile-toc-nav">
              {tocHeadings.map(item => (
                <div key={item.id} className="doc-mobile-toc-group">
                  <button
                    className={`doc-mobile-toc-item doc-mobile-toc-item--h2${activeTocId === item.id ? ' active' : ''}`}
                    onClick={() => { scrollTo(item.id); setTocOpen(false) }}
                    type="button"
                  >
                    {item.text}
                  </button>
                  {item.children.length > 0 && (
                    <div className="doc-mobile-toc-children">
                      {item.children.map(child => (
                        <button
                          key={child.id}
                          className={`doc-mobile-toc-item doc-mobile-toc-item--h3${activeTocId === child.id ? ' active' : ''}`}
                          onClick={() => { scrollTo(child.id); setTocOpen(false) }}
                          type="button"
                        >
                          {child.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}

        <main className="doc-content" id="doc-main-content" ref={contentRef}>

          <section id="getting-started" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="play" /> Getting Started</h2>

            <div className="doc-editorial">
              <div className="doc-editorial-visual">
                <GettingStartedIllustration />
              </div>
              <div className="doc-editorial-text">
                <span className="doc-editorial-label">Quick start</span>
                <h3 className="doc-editorial-heading" id="how-to-start">How to start creating</h3>
                <ol className="doc-editorial-list">
                  <li><strong>Open</strong> Kanvas in your browser</li>
                  <li><strong>Choose</strong> a tool from the left toolbar</li>
                  <li><strong>Click and drag</strong> on the canvas to create shapes</li>
                  <li><strong>Switch back</strong> to Select to move and edit</li>
                  <li><strong>Use</strong> the Style panel to customize colors and strokes</li>
                </ol>
              </div>
            </div>
          </section>

          <WorkflowSection />

          <SectionBreak
            label="02"
            heading="Tools"
            description="Every tool you need to create, draw, and design — from selecting objects to freehand sketching."
            illustration={<ToolsBreakIllustration />}
            accent="green"
          />

          <section id="tools" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="cursor" /> Tools</h2>

            {/* Realistic product showcase — full Kanvas board */}
            <div className="doc-tool-showcase" data-reveal>
              <div className="doc-tool-showcase-toolbar">
                <ToolbarFrag activeTool="rectangle" />
              </div>
              <div className="doc-tool-showcase-canvas">
                <svg viewBox="0 0 640 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} aria-hidden="true">
                  {/* Canvas dot grid */}
                  {[0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340,360,380,400,420,440,460,480,500,520,540,560,580,600,620,640].map(x => (
                    [0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320].map(y => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="0.8" fill="var(--dot)" />
                    ))
                  )).flat()}

                  {/* Rectangle tool — product planning cards */}
                  <rect x="40" y="30" width="140" height="80" rx="8" fill="rgba(47,133,90,0.05)" stroke="#22c55e" strokeWidth="1.5" />
                  <text x="52" y="52" fontSize="10" fontWeight="700" fontFamily="system-ui" fill="#166534">User Research</text>
                  <text x="52" y="68" fontSize="8" fontFamily="system-ui" fill="#6b7280">Interviews, surveys, analytics</text>
                  <rect x="52" y="80" width="40" height="16" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.8" />
                  <text x="72" y="91" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#166534">Done</text>

                  <rect x="200" y="30" width="140" height="80" rx="8" fill="rgba(59,130,246,0.05)" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="212" y="52" fontSize="10" fontWeight="700" fontFamily="system-ui" fill="#1e40af">Wireframes</text>
                  <text x="212" y="68" fontSize="8" fontFamily="system-ui" fill="#6b7280">Low-fidelity layout drafts</text>
                  <rect x="212" y="80" width="52" height="16" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.8" />
                  <text x="238" y="91" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#1e40af">In Progress</text>

                  <rect x="360" y="30" width="140" height="80" rx="8" fill="rgba(139,92,246,0.05)" stroke="#8b5cf6" strokeWidth="1.5" />
                  <text x="372" y="52" fontSize="10" fontWeight="700" fontFamily="system-ui" fill="#5b21b6">Prototype</text>
                  <text x="372" y="68" fontSize="8" fontFamily="system-ui" fill="#6b7280">Interactive mockup flow</text>
                  <rect x="372" y="80" width="44" height="16" rx="4" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.8" />
                  <text x="394" y="91" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#5b21b6">Review</text>

                  {/* Ellipse tool — status indicators */}
                  <ellipse cx="560" cy="50" r="30" ry="24" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="560" y="47" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="system-ui" fill="#92400e">Sprint</text>
                  <text x="560" y="60" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill="#f59e0b">3</text>

                  {/* Arrow tool — connecting cards */}
                  <path d="M180 70 L200 70" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M195 67 L201 70 L195 73" fill="#64748b" stroke="#64748b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M340 70 L360 70" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M355 67 L361 70 L355 73" fill="#64748b" stroke="#64748b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Line tool — separator */}
                  <line x1="40" y1="136" x2="600" y2="136" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="6 4" />

                  {/* Diamond tool — decision node */}
                  <path d="M80 180 L110 200 L80 220 L50 200 Z" fill="rgba(236,72,153,0.06)" stroke="#ec4899" strokeWidth="1.5" />
                  <text x="80" y="203" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#be185d">Go?</text>

                  {/* Arrow from diamond */}
                  <path d="M110 200 L160 200" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M155 197 L161 200 L155 203" fill="#64748b" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
                  <text x="135" y="194" textAnchor="middle" fontSize="6" fontFamily="system-ui" fill="#9ca3af">yes</text>

                  {/* Rectangle — approval card */}
                  <rect x="168" y="180" width="120" height="52" rx="6" fill="rgba(47,133,90,0.04)" stroke="#22c55e" strokeWidth="1.2" />
                  <text x="180" y="200" fontSize="8" fontWeight="600" fontFamily="system-ui" fill="#166534">Ship It</text>
                  <text x="180" y="214" fontSize="7" fontFamily="system-ui" fill="#6b7280">Deploy to production</text>

                  {/* Pencil tool — freehand sketch */}
                  <path d="M340 170 C360 155, 390 180, 410 165 C430 150, 450 175, 470 160 C490 145, 510 170, 530 158" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
                  <text x="340" y="165" fontSize="7" fontWeight="500" fontFamily="system-ui" fill="#3b82f6">Trend line</text>

                  {/* Text tool — heading */}
                  <text x="340" y="220" fontSize="16" fontWeight="800" fontFamily="system-ui" fill="var(--text)">Product Roadmap Q4</text>
                  <text x="340" y="240" fontSize="9" fontFamily="system-ui" fill="#6b7280">Key milestones and deliverables for the next quarter</text>

                  {/* Sticky note — pen tool */}
                  <rect x="500" y="160" width="110" height="72" rx="3" fill="#fefce8" stroke="#eab308" strokeWidth="1" />
                  <text x="510" y="178" fontSize="8" fontWeight="600" fontFamily="system-ui" fill="#854d0e">Meeting Notes</text>
                  <text x="510" y="194" fontSize="7" fontFamily="system-ui" fill="#854d0e">- Review wireframes</text>
                  <text x="510" y="206" fontSize="7" fontFamily="system-ui" fill="#854d0e">- Finalize copy</text>
                  <text x="510" y="218" fontSize="7" fontFamily="system-ui" fill="#854d0e">- Schedule dev handoff</text>

                  {/* Line tool — connectors */}
                  <line x1="288" y1="206" x2="336" y2="212" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 3" />

                  {/* Selection state on a shape */}
                  <rect x="164" y="176" width="128" height="60" rx="8" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 2" />
                  <rect x="160" y="172" width="6" height="6" rx="1.5" fill="var(--accent)" />
                  <rect x="288" y="172" width="6" height="6" rx="1.5" fill="var(--accent)" />
                  <rect x="160" y="234" width="6" height="6" rx="1.5" fill="var(--accent)" />
                  <rect x="288" y="234" width="6" height="6" rx="1.5" fill="var(--accent)" />

                  {/* Cursor */}
                  <path d="M468 260 L468 276 L473 272 L478 280 L480 279 L475 271 L480 268Z" fill="var(--text)" />
                </svg>
              </div>
              <div className="doc-tool-showcase-panel">
                <StylePanelFrag />
              </div>
            </div>

            {/* Shapes showcase — realistic board composition */}
            <div className="doc-shapes-showcase" data-reveal>
              <div className="doc-shapes-canvas">
                <svg viewBox="0 0 720 420" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} aria-hidden="true">
                  {/* Canvas dot grid */}
                  {[0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340,360,380,400,420,440,460,480,500,520,540,560,580,600,620,640,660,680,700,720].map(x => (
                    [0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340,360,380,400,420].map(y => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="var(--dot)" />
                    ))
                  )).flat()}

                  {/* ── Row 1: Product roadmap cards ── */}
                  {/* Rectangle — large card */}
                  <rect x="40" y="30" width="180" height="100" rx="10" fill="rgba(47,133,90,0.04)" stroke="#22c55e" strokeWidth="1.5" />
                  <text x="56" y="56" fontSize="11" fontWeight="700" fontFamily="system-ui" fill="#166534">User Research</text>
                  <text x="56" y="72" fontSize="8" fontFamily="system-ui" fill="#6b7280">Interviews, surveys, analytics review</text>
                  <rect x="56" y="86" width="52" height="18" rx="5" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.8" />
                  <text x="82" y="98" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#166534">Done</text>
                  <rect x="116" y="86" width="68" height="18" rx="5" fill="rgba(34,197,94,0.08)" stroke="none" />
                  <text x="150" y="98" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill="#22c55e">+ 3 tasks</text>

                  {/* Rectangle — medium card */}
                  <rect x="240" y="30" width="160" height="100" rx="10" fill="rgba(59,130,246,0.04)" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="256" y="56" fontSize="11" fontWeight="700" fontFamily="system-ui" fill="#1e40af">Wireframes</text>
                  <text x="256" y="72" fontSize="8" fontFamily="system-ui" fill="#6b7280">Low-fidelity layout drafts</text>
                  <rect x="256" y="86" width="64" height="18" rx="5" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.8" />
                  <text x="288" y="98" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#1e40af">In Progress</text>

                  {/* Rectangle — small accent card */}
                  <rect x="420" y="30" width="140" height="100" rx="10" fill="rgba(139,92,246,0.04)" stroke="#8b5cf6" strokeWidth="1.5" />
                  <text x="436" y="56" fontSize="11" fontWeight="700" fontFamily="system-ui" fill="#5b21b6">Prototype</text>
                  <text x="436" y="72" fontSize="8" fontFamily="system-ui" fill="#6b7280">Interactive mockup flow</text>
                  <rect x="436" y="86" width="48" height="18" rx="5" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="0.8" />
                  <text x="460" y="98" textAnchor="middle" fontSize="7" fontWeight="600" fontFamily="system-ui" fill="#5b21b6">Review</text>

                  {/* Ellipse — sprint badge */}
                  <ellipse cx="620" cy="80" r="48" ry="38" fill="rgba(245,158,11,0.05)" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="620" y="74" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="system-ui" fill="#92400e">Sprint</text>
                  <text x="620" y="92" textAnchor="middle" fontSize="22" fontWeight="800" fontFamily="system-ui" fill="#f59e0b">3</text>

                  {/* Arrows connecting row 1 */}
                  <path d="M220 80 L240 80" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M235 77 L241 80 L235 83" fill="#94a3b8" />
                  <path d="M400 80 L420 80" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M415 77 L421 80 L415 83" fill="#94a3b8" />
                  <path d="M560 80 L572 80" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M569 77 L574 80 L569 83" fill="#94a3b8" />

                  {/* ── Separator line ── */}
                  <line x1="40" y1="155" x2="680" y2="155" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="6 4" />

                  {/* ── Row 2: Decision flow ── */}
                  {/* Diamond — decision node */}
                  <path d="M100 195 L140 225 L100 255 L60 225 Z" fill="rgba(236,72,153,0.05)" stroke="#ec4899" strokeWidth="1.5" />
                  <text x="100" y="222" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#be185d">Ready</text>
                  <text x="100" y="234" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill="#be185d">to ship?</text>

                  {/* Arrow from diamond — yes */}
                  <path d="M140 225 L200 225" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M195 222 L201 225 L195 228" fill="#22c55e" />
                  <text x="170" y="218" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill="#22c55e">yes</text>

                  {/* Arrow from diamond — no */}
                  <path d="M100 255 L100 310" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M97 305 L100 311 L103 305" fill="#ef4444" />
                  <text x="112" y="285" fontSize="7" fontWeight="500" fontFamily="system-ui" fill="#ef4444">no</text>

                  {/* Rectangle — ship card (selected) */}
                  <rect x="208" y="195" width="160" height="60" rx="8" fill="rgba(47,133,90,0.05)" stroke="#22c55e" strokeWidth="1.5" />
                  <text x="224" y="220" fontSize="10" fontWeight="700" fontFamily="system-ui" fill="#166534">Ship It</text>
                  <text x="224" y="238" fontSize="8" fontFamily="system-ui" fill="#6b7280">Deploy to production</text>
                  {/* Selection handles */}
                  <rect x="204" y="191" width="7" height="7" rx="2" fill="#3b82f6" />
                  <rect x="364" y="191" width="7" height="7" rx="2" fill="#3b82f6" />
                  <rect x="204" y="251" width="7" height="7" rx="2" fill="#3b82f6" />
                  <rect x="364" y="251" width="7" height="7" rx="2" fill="#3b82f6" />
                  <rect x="204" y="191" width="167" height="67" rx="10" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 2" />

                  {/* Rectangle — fix card */}
                  <rect x="80" y="318" width="130" height="52" rx="8" fill="rgba(239,68,68,0.04)" stroke="#ef4444" strokeWidth="1.5" />
                  <text x="96" y="342" fontSize="9" fontWeight="700" fontFamily="system-ui" fill="#dc2626">Fix Bugs</text>
                  <text x="96" y="358" fontSize="7" fontFamily="system-ui" fill="#6b7280">Address review feedback</text>

                  {/* Arrow from fix back to diamond */}
                  <path d="M80 344 L60 344 L60 255" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="4 3" />
                  <path d="M57 260 L60 254 L63 260" fill="#94a3b8" />

                  {/* ── Row 3: Shapes variety ── */}
                  {/* Ellipse — avatar */}
                  <circle cx="460" cy="225" r="28" fill="rgba(59,130,246,0.08)" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="460" y="221" textAnchor="middle" fontSize="18" fontFamily="system-ui" fill="#3b82f6">JD</text>
                  <text x="460" y="237" textAnchor="middle" fontSize="7" fontWeight="500" fontFamily="system-ui" fill="#6b7280">Jane D.</text>

                  {/* Ellipse — small status dot */}
                  <circle cx="486" cy="200" r="8" fill="#22c55e" stroke="white" strokeWidth="2" />

                  {/* Rectangle — label tag */}
                  <rect x="520" y="208" width="80" height="24" rx="12" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1" />
                  <text x="560" y="224" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill="#92400e">Design</text>

                  {/* Rectangle — label tag */}
                  <rect x="610" y="208" width="72" height="24" rx="12" fill="rgba(139,92,246,0.1)" stroke="#8b5cf6" strokeWidth="1" />
                  <text x="646" y="224" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="system-ui" fill="#5b21b6">Feature</text>

                  {/* Diamond — milestone */}
                  <path d="M580 280 L610 305 L580 330 L550 305 Z" fill="rgba(245,158,11,0.05)" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="580" y="302" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="system-ui" fill="#92400e">Beta</text>
                  <text x="580" y="314" textAnchor="middle" fontSize="7" fontFamily="system-ui" fill="#92400e">Launch</text>

                  {/* Lines — connectors */}
                  <line x1="488" y1="225" x2="518" y2="220" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                  <line x1="598" y1="220" x2="608" y2="220" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />

                  {/* Pencil — freehand annotation */}
                  <path d="M440 310 C460 295, 490 320, 510 300 C530 280, 550 305, 570 290" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
                  <text x="440" y="340" fontSize="7" fontWeight="500" fontFamily="system-ui" fill="#3b82f6">velocity trend</text>

                  {/* Sticky note */}
                  <rect x="620" y="280" width="90" height="80" rx="3" fill="#fefce8" stroke="#eab308" strokeWidth="1" />
                  <text x="630" y="298" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="#854d0e">Notes</text>
                  <text x="630" y="314" fontSize="7" fontFamily="system-ui" fill="#854d0e">- Review PR #42</text>
                  <text x="630" y="328" fontSize="7" fontFamily="system-ui" fill="#854d0e">- Update docs</text>
                  <text x="630" y="342" fontSize="7" fontFamily="system-ui" fill="#854d0e">- Schedule demo</text>

                  {/* Line — separator in sticky */}
                  <line x1="630" y1="304" x2="700" y2="304" stroke="#eab308" strokeWidth="0.5" opacity="0.4" />

                  {/* Text — heading */}
                  <text x="440" y="380" fontSize="14" fontWeight="800" fontFamily="system-ui" fill="var(--text)">Product Roadmap Q4</text>
                  <text x="440" y="398" fontSize="8" fontFamily="system-ui" fill="#9ca3af">Key milestones and deliverables</text>

                  {/* Cursor pointer */}
                  <path d="M380 370 L380 390 L387 384 L394 396 L397 394 L390 382 L397 378Z" fill="var(--text)" />
                </svg>
              </div>
              <div className="doc-shapes-label">
                <span className="doc-shapes-label-text">All shape types on one canvas — rectangles, ellipses, diamonds, arrows, lines, text, and freehand</span>
              </div>
            </div>

            {/* Shape reference cards */}
            <div className="doc-shape-ref-grid">
              {[
                { icon: 'square', name: 'Rectangle', key: 'R', desc: 'Cards, containers, labels', color: '#3b82f6' },
                { icon: 'circle', name: 'Ellipse', key: 'O', desc: 'Circles, avatars, badges', color: '#8b5cf6' },
                { icon: 'diamond', name: 'Diamond', key: 'D', desc: 'Decisions, milestones', color: '#ec4899' },
                { icon: 'arrow', name: 'Arrow', key: 'A', desc: 'Connect and relate shapes', color: '#ef4444' },
                { icon: 'line', name: 'Line', key: 'L', desc: 'Separators, guides', color: '#f59e0b' },
                { icon: 'pen', name: 'Pencil', key: 'P', desc: 'Freehand sketches', color: '#22c55e' },
                { icon: 'text', name: 'Text', key: 'T', desc: 'Headings, labels, notes', color: '#f59e0b' },
                { icon: 'image', name: 'Image', key: '9', desc: 'Upload PNG, SVG, WebP', color: '#8b5cf6' },
              ].map(tool => (
                <div key={tool.name} className="doc-shape-ref-card" style={{ '--shape-color': tool.color }}>
                  <span className="doc-shape-ref-icon" style={{ color: tool.color }}><KanvasIcon name={tool.icon} size={18} /></span>
                  <span className="doc-shape-ref-name">{tool.name}</span>
                  <kbd className="doc-shape-ref-key">{tool.key}</kbd>
                </div>
              ))}
            </div>
          </section>

          <section id="drawing" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="pen" /> Drawing</h2>

            <div className="doc-editorial">
              <div className="doc-editorial-visual">
                <div className="doc-drawing-showcase" data-reveal>
                  <div className="doc-drawing-canvas">
                    <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }} aria-hidden="true">
                      {/* Canvas dot grid */}
                      {[0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340,360,380,400,420,440,460,480,500,520,540,560,580,600].map(x => (
                        [0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340,360,380,400].map(y => (
                          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="var(--dot)" />
                        ))
                      )).flat()}

                      {/* ── Rough wireframe sketch — hand-drawn look ── */}
                      {/* Phone outline — wobbly rectangle */}
                      <path d="M60 60 C62 58, 158 56, 198 60 C202 62, 204 148, 200 198 C198 202, 102 204, 62 200 C58 198, 56 102, 60 60 Z"
                        stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      {/* Phone notch */}
                      <path d="M110 60 C112 52, 148 52, 150 60"
                        stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      {/* Phone screen area */}
                      <path d="M68 72 C70 70, 188 68, 192 72 C194 74, 196 188, 192 192 C190 194, 72 196, 68 192 C66 190, 64 74, 68 72 Z"
                        stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" fill="none" strokeDasharray="3 2" />

                      {/* App header bar — sketchy */}
                      <path d="M72 80 L188 79" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M72 80 C74 78, 120 77, 130 80" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M170 78 C172 76, 186 77, 188 80" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                      {/* Content blocks — rough sketchy rectangles */}
                      {/* Image placeholder */}
                      <path d="M76 92 C78 90, 140 89, 142 92 C144 94, 145 130, 142 132 C140 134, 78 135, 76 132 C74 130, 74 94, 76 92 Z"
                        stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" fill="rgba(156,163,175,0.06)" />
                      {/* Mountain sketch inside image */}
                      <path d="M80 128 L96 104 L108 118 L120 98 L138 128"
                        stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                      <circle cx="128" cy="100" r="5" stroke="#d1d5db" strokeWidth="1" fill="none" />

                      {/* Text lines — wobbly */}
                      <path d="M76 142 C78 140, 130 141, 140 142" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                      <path d="M76 152 C78 150, 110 151, 120 152" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M76 160 C78 158, 100 159, 108 160" stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                      {/* Button sketch */}
                      <path d="M76 172 C78 170, 120 169, 122 172 C124 174, 125 184, 122 186 C120 188, 78 189, 76 186 C74 184, 74 174, 76 172 Z"
                        stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" fill="rgba(59,130,246,0.06)" />
                      <path d="M82 180 C84 178, 112 179, 116 180" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                      {/* ── Right side: rough flow diagram ── */}
                      {/* Circle node */}
                      <path d="M320 80 C325 72, 365 71, 370 80 C375 89, 374 109, 370 118 C366 127, 326 128, 320 118 C314 109, 315 89, 320 80 Z"
                        stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" fill="rgba(139,92,246,0.04)" />
                      <path d="M334 94 C336 92, 352 93, 356 94" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M338 104 C340 102, 350 103, 352 104" stroke="#c4b5fd" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                      {/* Arrow down — wobbly */}
                      <path d="M345 122 C346 128, 344 140, 345 148" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M341 144 L345 150 L349 144" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                      {/* Rectangle node */}
                      <path d="M310 158 C312 155, 378 154, 380 158 C382 160, 383 198, 380 202 C378 205, 312 206, 310 202 C308 199, 308 161, 310 158 Z"
                        stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" fill="rgba(34,197,94,0.04)" />
                      <path d="M324 174 C326 172, 362 173, 366 174" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M328 184 C330 182, 350 183, 354 184" stroke="#86efac" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                      <path d="M328 192 C330 190, 342 191, 346 192" stroke="#86efac" strokeWidth="1" strokeLinecap="round" fill="none" />

                      {/* Arrow right — curved */}
                      <path d="M384 180 C396 178, 408 176, 418 180" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M414 176 L420 180 L414 184" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                      {/* Diamond node */}
                      <path d="M450 150 L480 180 L450 210 L420 180 Z"
                        stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="rgba(236,72,153,0.04)" />
                      <path d="M438 176 C440 174, 458 175, 462 176" stroke="#ec4899" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                      <path d="M440 186 C442 184, 456 185, 458 186" stroke="#f9a8d4" strokeWidth="1" strokeLinecap="round" fill="none" />

                      {/* Arrow down from diamond */}
                      <path d="M450 214 C451 220, 449 232, 450 240" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M446 236 L450 242 L454 236" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                      {/* Ellipse node */}
                      <path d="M420 252 C425 242, 475 241, 480 252 C485 263, 484 283, 480 292 C476 301, 426 302, 420 292 C414 283, 415 263, 420 252 Z"
                        stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" fill="rgba(245,158,11,0.04)" />
                      <path d="M438 268 C440 266, 460 267, 464 268" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                      <path d="M442 278 C444 276, 456 277, 458 278" stroke="#fcd34d" strokeWidth="1" strokeLinecap="round" fill="none" />

                      {/* ── Bottom: rough annotations ── */}
                      {/* Circle annotation */}
                      <path d="M80 240 C82 234, 118 233, 120 240 C122 247, 121 263, 120 268 C118 274, 82 275, 80 268 C78 262, 78 247, 80 240 Z"
                        stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="4 3" />
                      <path d="M124 254 L148 248" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" fill="none" />
                      <path d="M88 256 C90 254, 110 255, 112 256" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                      {/* Cross-out mark */}
                      <path d="M200 230 L240 270" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                      <path d="M200 270 L240 230" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

                      {/* Star / highlight */}
                      <path d="M280 240 L284 252 L296 252 L286 260 L290 272 L280 264 L270 272 L274 260 L264 252 L276 252 Z"
                        stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(245,158,11,0.08)" />

                      {/* Arrow annotation */}
                      <path d="M160 310 C162 306, 218 305, 220 310 C222 314, 223 330, 220 334 C218 338, 162 339, 160 334 C158 330, 158 314, 160 310 Z"
                        stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" fill="rgba(59,130,246,0.04)" />
                      <path d="M170 322 C172 320, 206 321, 210 322" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M172 330 C174 328, 196 329, 200 330" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                      {/* Rough underlines */}
                      <path d="M320 320 C322 318, 420 317, 424 320" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" fill="none" />
                      <path d="M320 336 C322 334, 380 333, 384 336" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M320 350 C322 348, 360 347, 364 350" stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                      {/* Pencil cursor */}
                      <path d="M520 340 L530 310 L534 312 L524 342 Z" fill="#374151" stroke="#374151" strokeWidth="1" strokeLinejoin="round" />
                      <path d="M520 340 L518 348 L524 342 Z" fill="#f59e0b" />
                      <path d="M530 310 L532 306 L536 308 L534 312 Z" fill="#9ca3af" />

                      {/* Pencil trail */}
                      <path d="M524 342 C520 350, 510 358, 498 362 C486 366, 470 364, 460 358"
                        stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" strokeDasharray="2 3" />
                    </svg>
                  </div>
                  <div className="doc-drawing-label">
                    <span className="doc-drawing-label-text">Freehand sketching with natural strokes — wireframes, flow diagrams, annotations</span>
                  </div>
                </div>
              </div>
              <div className="doc-editorial-text">
                <span className="doc-editorial-label">Freehand</span>
                <h3 className="doc-editorial-heading">Draw naturally on the canvas</h3>
                <ul className="doc-editorial-list">
                  <li><strong>Press P</strong> or click the pencil tool to start drawing</li>
                  <li><strong>Click and drag</strong> to sketch freehand strokes</li>
                  <li><strong>Adjust stroke width</strong> in the Style panel for thick or thin lines</li>
                  <li><strong>Combine with shapes</strong> — sketch over rectangles and arrows for a rough look</li>
                  <li><strong>Use for wireframes</strong> — quick, imperfect layouts before committing to precision</li>
                  <li><strong>Annotate</strong> — circle issues, cross out ideas, star important items</li>
                </ul>
              </div>
            </div>
          </section>

          <SectionBreak
            description="Move freely across your infinite canvas — zoom in for detail, pan to explore."
            illustration={<ZoomBreakIllustration />}
            accent="blue"
          />

          <section id="zoom" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="zoom" /> Zoom & Canvas Navigation</h2>

            <div className="doc-editorial doc-editorial--reversed">
              <div className="doc-editorial-visual">
                <ZoomDemo />
              </div>
              <div className="doc-editorial-text">
                <span className="doc-editorial-label">Navigation</span>
                <h3 className="doc-editorial-heading">Navigate the canvas</h3>
                <ul className="doc-editorial-list">
                  <li><strong>Zoom in</strong> — scroll wheel, <kbd>Ctrl</kbd>+<kbd>+</kbd>, or click +</li>
                  <li><strong>Zoom out</strong> — scroll wheel, <kbd>Ctrl</kbd>+<kbd>-</kbd>, or click −</li>
                  <li><strong>Reset</strong> — click percentage or <kbd>Ctrl</kbd>+<kbd>0</kbd></li>
                  <li><strong>Zoom to fit</strong> — <kbd>Shift</kbd>+<kbd>1</kbd> frames all content</li>
                  <li><strong>Pan</strong> — hold <kbd>Space</kbd> and drag</li>
                  <li><strong>Fullscreen</strong> — click the fullscreen button</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="undo-redo" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="undo" /> Undo & Redo</h2>

            <div className="doc-editorial doc-editorial--reversed">
              <div className="doc-editorial-visual">
                <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-illustration" aria-hidden="true" style={{ width: '100%', height: 'auto' }}>
                  <rect x="0" y="0" width="280" height="120" rx="10" fill="var(--surface-solid)" stroke="var(--border)" strokeWidth="1" />
                  {/* Before state: shapes scattered */}
                  <text x="20" y="18" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="var(--text-muted)">BEFORE</text>
                  <rect x="20" y="26" width="40" height="24" rx="3" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="0.8" />
                  <text x="40" y="42" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#ef4444">Moved</text>
                  <circle cx="100" cy="38" r="14" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth="0.8" />
                  <text x="100" y="41" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#3b82f6">Deleted</text>
                  <rect x="130" y="26" width="36" height="24" rx="3" fill="rgba(34,197,94,0.06)" stroke="#22c55e" strokeWidth="0.8" />
                  <text x="148" y="42" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#22c55e">Added</text>

                  {/* Arrow: undo */}
                  <path d="M180 38 L200 38" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
                  <path d="M196 35 L202 38 L196 41" fill="none" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />

                  {/* After state: shapes restored */}
                  <text x="210" y="18" fontSize="8" fontWeight="700" fontFamily="system-ui" fill="var(--text-muted)">AFTER</text>
                  <rect x="210" y="26" width="40" height="24" rx="3" fill="rgba(59,130,246,0.06)" stroke="#3b82f6" strokeWidth="0.8" />
                  <text x="230" y="42" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#3b82f6">Restored</text>
                  <circle cx="100" cy="80" r="14" fill="rgba(34,197,94,0.06)" stroke="#22c55e" strokeWidth="0.8" />
                  <text x="100" y="83" textAnchor="middle" fontSize="5" fontFamily="system-ui" fill="#22c55e">Redone</text>

                  {/* Keyboard shortcut badge */}
                  <rect x="20" y="80" width="60" height="20" rx="4" fill="var(--accent-soft)" />
                  <text x="50" y="94" textAnchor="middle" fontSize="6" fontWeight="700" fontFamily="system-ui" fill="var(--accent)">Ctrl + Z</text>
                  <text x="90" y="94" fontSize="5" fontFamily="system-ui" fill="var(--text-muted)">undo</text>
                </svg>
              </div>
              <div className="doc-editorial-text">
                <span className="doc-editorial-label">History</span>
                <h3 className="doc-editorial-heading">Never worry about mistakes</h3>
                <ul className="doc-editorial-list">
                  <li><strong>Undo</strong> — <kbd>Ctrl</kbd>+<kbd>Z</kbd></li>
                  <li><strong>Redo</strong> — <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd></li>
                  <li><strong>200 steps</strong> — generous history per session</li>
                  <li><strong>Session-based</strong> — preserved while the tab is open</li>
                </ul>
              </div>
            </div>
          </section>

          <SectionBreak
            label="04"
            heading="Color & Styling"
            description="Make every shape your own — colors, strokes, fills, opacity, and layer order."
            illustration={<StylingBreakIllustration />}
            accent="purple"
          />

          <section id="styling" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="palette" /> Color & Styling</h2>

            <div className="doc-editorial">
              <div className="doc-editorial-visual">
                <ColorLabHero />
              </div>
              <div className="doc-editorial-text">
                <span className="doc-editorial-label">Styling</span>
                <h3 className="doc-editorial-heading">Shape every detail</h3>
                <ul className="doc-editorial-list">
                  <li><strong>6 stroke colors</strong> — curated palette via the Style panel</li>
                  <li><strong>5 fill colors</strong> — solid backgrounds for shapes</li>
                  <li><strong>3 stroke widths</strong> — thin, medium, or thick</li>
                  <li><strong>3 stroke styles</strong> — solid, dashed, or dotted</li>
                  <li><strong>Opacity slider</strong> — transparent to opaque</li>
                  <li><strong>Corner radius</strong> — sharp or rounded</li>
                </ul>
              </div>
            </div>

            {/* Color Palette */}
            <h3 className="doc-section-subtitle">Color Palette</h3>
            <p className="doc-section-intro">Kanvas provides six curated stroke colors and five fill colors. Select any shape and pick a swatch from the Style panel.</p>
            <SwatchDisplay />

            {/* Demos grid — two columns on desktop */}
            <div className="doc-demos-grid">
              <div className="doc-demos-grid-item">
                <h4 className="doc-demos-grid-heading">Fill</h4>
                <p className="doc-demos-grid-desc">Fill applies a background color to rectangles, ellipses, and diamonds. Shapes start transparent — add a fill to make them solid.</p>
                <FillDemo />
              </div>
              <div className="doc-demos-grid-item">
                <h4 className="doc-demos-grid-heading">Stroke Width</h4>
                <p className="doc-demos-grid-desc">Control the thickness of shape outlines. Choose from Thin (1px), Medium (3px), or Thick (6px) in the Style panel.</p>
                <StrokeWidthDemo />
              </div>
              <div className="doc-demos-grid-item">
                <h4 className="doc-demos-grid-heading">Stroke Style</h4>
                <p className="doc-demos-grid-desc">Change how outlines render. Solid is the default, but dashed and dotted styles add visual variety.</p>
                <StrokeStyleDemo />
              </div>
              <div className="doc-demos-grid-item">
                <h4 className="doc-demos-grid-heading">Opacity</h4>
                <p className="doc-demos-grid-desc">Slide from 0% (fully transparent) to 100% (fully opaque). Useful for layering shapes and creating depth.</p>
                <OpacityDemo />
              </div>
              <div className="doc-demos-grid-item">
                <h4 className="doc-demos-grid-heading">Corner Style</h4>
                <p className="doc-demos-grid-desc">Rectangles support two corner modes: sharp (radius 0) and rounded (radius 8). Toggle from the Style panel.</p>
                <CornerStyleDemo />
              </div>
              <div className="doc-demos-grid-item">
                <h4 className="doc-demos-grid-heading">Font Size</h4>
                <p className="doc-demos-grid-desc">Text objects support ten preset sizes from 12px to 48px. Select a text shape and choose from the dropdown.</p>
                <FontSizeDemo />
              </div>
            </div>

            {/* Combined Styles */}
            <h3 className="doc-section-subtitle">Combined Styles</h3>
            <p className="doc-section-intro">Mix and match fill, stroke, width, style, and opacity to create polished compositions. Here are some common patterns.</p>
            <CombinedStylesDemo />

            {/* Quick reference */}
            <div className="doc-style-grid">
              <div className="doc-style-item">
                <h4>Layer Order</h4>
                <p>Arrange objects in front of or behind others using Bring Forward, Send Backward, Bring to Front, and Send to Back.</p>
              </div>
              <div className="doc-style-item">
                <h4>Image Controls</h4>
                <p>Flip images horizontally or vertically. Lock images to prevent accidental edits.</p>
              </div>
            </div>
          </section>

          <section id="themes" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="sun" /> Light & Dark Mode</h2>

            <div className="doc-editorial doc-editorial--reversed">
              <div className="doc-editorial-visual">
                <ThemesIllustration />
              </div>
              <div className="doc-editorial-text">
                <span className="doc-editorial-label">Themes</span>
                <h3 className="doc-editorial-heading">One toggle, every surface</h3>
                <ul className="doc-editorial-list">
                  <li><strong>Canvas background</strong> — white or dark gray</li>
                  <li><strong>Shape colors</strong> — auto-adjusted for readability</li>
                  <li><strong>All UI elements</strong> — toolbars, panels, menus</li>
                  <li><strong>Persistent</strong> — saved across sessions</li>
                </ul>
              </div>
            </div>

            <ThemeToggleDemo />
          </section>

          <SectionBreak
            label="05"
            heading="Export Your Board"
            description="Save, share, and export your work in any format — PNG, PDF, SVG, or JSON."
            illustration={<ExportBreakIllustration />}
            accent="coral"
          />

          <section id="export" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="download" /> Export Your Board</h2>

            <div className="doc-editorial">
              <div className="doc-editorial-visual">
                <ExportIllustration />
              </div>
              <div className="doc-editorial-text">
                <span className="doc-editorial-label">Export</span>
                <h3 className="doc-editorial-heading">From canvas to file</h3>
                <ul className="doc-editorial-list">
                  <li><strong>PNG / JPG</strong> — high-res images for sharing</li>
                  <li><strong>PDF</strong> — printable document</li>
                  <li><strong>SVG</strong> — vector, scales to any size</li>
                  <li><strong>JSON</strong> — save data, import later</li>
                  <li><strong>Copy Image</strong> — paste into other apps</li>
                  <li><strong>Print</strong> — system print dialog</li>
                </ul>
              </div>
            </div>

            <FeatureStory
              heading="Share Your Work"
              description="Export your board in any format — from PNG images to vector SVGs."
              diagram={<ExportStoryDiagram />}
              steps={['Create your board', 'Click the Export button', 'Choose your format', 'Download or copy to clipboard']}
            />

            {/* Export formats as compact reference */}
            <div className="doc-export-compact">
              <div className="doc-export-compact-item">
                <NavIcon name="image" />
                <div>
                  <strong>PNG</strong>
                  <span>High-res image with transparent background</span>
                </div>
              </div>
              <div className="doc-export-compact-item">
                <NavIcon name="camera" />
                <div>
                  <strong>JPG</strong>
                  <span>92% quality, smaller file size</span>
                </div>
              </div>
              <div className="doc-export-compact-item">
                <NavIcon name="pdf" />
                <div>
                  <strong>PDF</strong>
                  <span>Printable document for archiving</span>
                </div>
              </div>
              <div className="doc-export-compact-item">
                <NavIcon name="svg" />
                <div>
                  <strong>SVG</strong>
                  <span>Vector format, scales to any size</span>
                </div>
              </div>
              <div className="doc-export-compact-item">
                <NavIcon name="json" />
                <div>
                  <strong>JSON</strong>
                  <span>Save shape data, import later to resume</span>
                </div>
              </div>
              <div className="doc-export-compact-item">
                <NavIcon name="copy" />
                <div>
                  <strong>Copy Image</strong>
                  <span>Paste board directly into other apps</span>
                </div>
              </div>
              <div className="doc-export-compact-item">
                <NavIcon name="print" />
                <div>
                  <strong>Print</strong>
                  <span>Open system print dialog</span>
                </div>
              </div>
              <div className="doc-export-compact-item">
                <NavIcon name="json" />
                <div>
                  <strong>Import JSON</strong>
                  <span>Drag a JSON file onto the canvas to restore</span>
                </div>
              </div>
            </div>
          </section>

          <SectionBreak
            label="06"
            heading="Keyboard Shortcuts"
            description="Speed up your workflow — every tool and action has a shortcut."
            illustration={<ShortcutsBreakIllustration />}
            accent="coral"
          />

          <section id="shortcuts" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="code" /> Keyboard Shortcuts</h2>
            <p className="doc-section-intro">Speed up your workflow with keyboard shortcuts. Shortcuts are disabled while editing text.</p>

            <div className="doc-shortcut-section">
              <h3 className="doc-shortcut-heading">Tools</h3>
              <ShortcutRow keys={['V']} action="Select tool" />
              <ShortcutRow keys={['H']} action="Pan tool" />
              <ShortcutRow keys={['R']} action="Rectangle tool" />
              <ShortcutRow keys={['O']} action="Ellipse tool" />
              <ShortcutRow keys={['D']} action="Diamond tool" />
              <ShortcutRow keys={['A']} action="Arrow tool" />
              <ShortcutRow keys={['L']} action="Line tool" />
              <ShortcutRow keys={['P']} action="Pencil tool" />
              <ShortcutRow keys={['T']} action="Text tool" />
              <ShortcutRow keys={['E']} action="Eraser tool" />
              <ShortcutRow keys={['K']} action="Laser tool" />
            </div>

            <div className="doc-shortcut-section">
              <h3 className="doc-shortcut-heading">Actions</h3>
              <ShortcutRow keys={['Ctrl', 'Z']} action="Undo" />
              <ShortcutRow keys={['Ctrl', 'Shift', 'Z']} action="Redo" />
              <ShortcutRow keys={['Ctrl', 'Y']} action="Redo (alternative)" />
              <ShortcutRow keys={['Ctrl', 'D']} action="Duplicate selected" />
              <ShortcutRow keys={['Ctrl', 'C']} action="Copy selected" />
              <ShortcutRow keys={['Ctrl', 'V']} action="Paste" />
              <ShortcutRow keys={['Ctrl', 'A']} action="Select all" />
              <ShortcutRow keys={['Delete']} action="Delete selected" />
              <ShortcutRow keys={['Backspace']} action="Delete selected" />
              <ShortcutRow keys={['Escape']} action="Deselect / finish editing" />
              <ShortcutRow keys={['Ctrl', 'Enter']} action="Finish text editing" />
            </div>

            <div className="doc-shortcut-section">
              <h3 className="doc-shortcut-heading">Navigation</h3>
              <ShortcutRow keys={['Ctrl', '+']} action="Zoom in" />
              <ShortcutRow keys={['Ctrl', '-']} action="Zoom out" />
              <ShortcutRow keys={['Ctrl', '0']} action="Reset zoom to 100%" />
              <ShortcutRow keys={['Shift', '1']} action="Zoom to fit content" />
              <ShortcutRow keys={['Space']} action="Hold to temporarily pan" />
              <ShortcutRow keys={['9']} action="Open image file picker" />
            </div>

            <div className="doc-shortcut-section">
              <h3 className="doc-shortcut-heading">Nudging</h3>
              <ShortcutRow keys={['Arrow keys']} action="Nudge selected 1px" />
              <ShortcutRow keys={['Shift', 'Arrow keys']} action="Nudge selected 10px" />
            </div>
          </section>

          <section id="tips" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="zap" /> Tips for a Better Experience</h2>

            <div className="doc-editorial doc-editorial--reversed">
              <div className="doc-editorial-visual">
                <TipsIllustration />
              </div>
              <div className="doc-editorial-text">
                <span className="doc-editorial-label">Tips</span>
                <h3 className="doc-editorial-heading">Work smarter on the canvas</h3>
                <ul className="doc-editorial-list">
                  <li><strong>Stay in Select mode</strong> — switch back after drawing</li>
                  <li><strong>Scroll to zoom</strong> — fastest way to focus on detail</li>
                  <li><strong>Space + drag</strong> — pan without switching tools</li>
                  <li><strong>Export as JSON</strong> — resume editing later</li>
                  <li><strong>Try different styles</strong> — colors and strokes make boards scannable</li>
                  <li><strong>Undo freely</strong> — up to 200 steps per session</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="faq" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="info" /> FAQ</h2>

            <div className="doc-editorial">
              <div className="doc-editorial-visual">
                <FAQIllustration />
              </div>
              <div className="doc-editorial-text">
                <span className="doc-editorial-label">Questions</span>
                <h3 className="doc-editorial-heading">Common answers</h3>
                <ul className="doc-editorial-list">
                  <li><strong>Free to use</strong> — no account required</li>
                  <li><strong>Local storage</strong> — saves to your browser</li>
                  <li><strong>Export formats</strong> — PNG, JPG, PDF, SVG, JSON</li>
                  <li><strong>Offline capable</strong> — core tools work without internet</li>
                  <li><strong>Image support</strong> — PNG, JPEG, SVG, WebP up to 20 MB</li>
                </ul>
              </div>
            </div>

            <div className="doc-faq-list">
              <FAQItem
                index={0}
                question="Is Kanvas free to use?"
                answer="Yes. Kanvas is free to use directly in your browser with no account required."
              />
              <FAQItem
                index={1}
                question="Do I need an account?"
                answer="No. You can start creating immediately without creating an account. Your boards are saved locally in your browser."
              />
              <FAQItem
                index={2}
                question="Where is my work saved?"
                answer="Your boards are automatically saved to your browser's local storage. This means your work persists across page refreshes, but it is tied to the browser and device you're using. Clearing browser data will remove saved boards."
              />
              <FAQItem
                index={3}
                question="Can I share my board?"
                answer="You can export your board as PNG, JPG, PDF, SVG, or JSON and share the file. JSON files can be imported back into Kanvas. There is no cloud sharing or collaborative editing in the current version."
              />
              <FAQItem
                index={4}
                question="What image formats are supported?"
                answer="Kanvas supports PNG, JPEG, SVG, and WebP image formats. The maximum file size is 20 MB. Images are automatically resized if they exceed 2048px on any side."
              />
              <FAQItem
                index={5}
                question="Does Kanvas work offline?"
                answer="Kanvas runs entirely in your browser. Once loaded, the core drawing tools work without an internet connection. However, you need an internet connection to initially load the application."
              />
            </div>
          </section>

          <section className="doc-section doc-showcase">
            <h2 className="doc-section-title"><NavIcon name="zap" /> Play with Kanvas</h2>
            <p className="doc-showcase-intro">See what you can create. These compositions were made using Kanvas tools — shapes, lines, text, and colors on an infinite canvas.</p>

            <div className="doc-showcase-grid" data-reveal>

              {/* 1 — Colorful shapes composition (large) */}
              <div className="doc-showcase-item doc-showcase-item--large">
                <div className="doc-showcase-canvas">
                  <svg viewBox="0 0 440 340" fill="none">
                    <rect x="20" y="20" width="160" height="120" rx="12" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                    <rect x="30" y="30" width="60" height="40" rx="6" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5" transform="rotate(-3 30 30)" />
                    <text x="60" y="56" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700" fontFamily="system-ui">UI Card</text>
                    <circle cx="320" cy="80" r="60" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="310" cy="70" r="28" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="320" y="85" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="700" fontFamily="system-ui">Idea</text>
                    <path d="M200 160 L280 160" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4" />
                    <path d="M275 155 L285 160 L275 165" fill="#a855f7" />
                    <rect x="60" y="200" width="120" height="80" rx="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                    <text x="120" y="235" textAnchor="middle" fill="#15803d" fontSize="10" fontWeight="600" fontFamily="system-ui">Features</text>
                    <rect x="72" y="248" width="96" height="6" rx="3" fill="#bbf7d0" />
                    <rect x="72" y="260" width="64" height="6" rx="3" fill="#bbf7d0" />
                    <rect x="280" y="200" width="130" height="90" rx="10" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
                    <path d="M310 230 L345 205 L380 225 L400 210" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="310" cy="230" r="4" fill="#ec4899" />
                    <circle cx="345" cy="205" r="4" fill="#ec4899" />
                    <circle cx="380" cy="225" r="4" fill="#ec4899" />
                    <circle cx="400" cy="210" r="4" fill="#ec4899" />
                    <text x="345" y="270" textAnchor="middle" fill="#be185d" fontSize="10" fontWeight="600" fontFamily="system-ui">Growth</text>
                    <line x1="190" y1="100" x2="260" y2="160" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
                  </svg>
                </div>
                <div className="doc-showcase-label">
                  <span className="doc-showcase-label-title">Colorful shapes</span>
                  <span className="doc-showcase-label-badge">Made in Kanvas</span>
                </div>
              </div>

              {/* 2 — Flowchart */}
              <div className="doc-showcase-item">
                <div className="doc-showcase-canvas">
                  <svg viewBox="0 0 200 160" fill="none">
                    <rect x="60" y="10" width="80" height="30" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="100" y="29" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="600" fontFamily="system-ui">Start</text>
                    <line x1="100" y1="40" x2="100" y2="55" stroke="var(--text-muted)" strokeWidth="1.5" />
                    <path d="M95 52 L100 58 L105 52" fill="var(--text-muted)" />
                    <rect x="55" y="58" width="90" height="28" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="100" y="76" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="600" fontFamily="system-ui">Design</text>
                    <line x1="100" y1="86" x2="100" y2="100" stroke="var(--text-muted)" strokeWidth="1.5" />
                    <path d="M95 97 L100 103 L105 97" fill="var(--text-muted)" />
                    <rect x="55" y="103" width="90" height="28" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
                    <text x="100" y="121" textAnchor="middle" fill="#166534" fontSize="9" fontWeight="600" fontFamily="system-ui">Build</text>
                    <line x1="100" y1="133" x2="100" y2="145" stroke="var(--text-muted)" strokeWidth="1.5" />
                    <circle cx="100" cy="150" r="6" fill="#22c55e" stroke="#166534" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="doc-showcase-label">
                  <span className="doc-showcase-label-title">Flowchart</span>
                  <span className="doc-showcase-label-badge">Made in Kanvas</span>
                </div>
              </div>

              {/* 3 — Mind map */}
              <div className="doc-showcase-item">
                <div className="doc-showcase-canvas">
                  <svg viewBox="0 0 200 160" fill="none">
                    <circle cx="100" cy="80" r="24" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
                    <text x="100" y="84" textAnchor="middle" fill="#7c3aed" fontSize="10" fontWeight="700" fontFamily="system-ui">Topic</text>
                    <line x1="76" y1="72" x2="35" y2="40" stroke="#8b5cf6" strokeWidth="1.5" />
                    <rect x="8" y="28" width="54" height="24" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="35" y="44" textAnchor="middle" fill="#1d4ed8" fontSize="9" fontWeight="600" fontFamily="system-ui">Idea A</text>
                    <line x1="76" y1="88" x2="30" y2="120" stroke="#8b5cf6" strokeWidth="1.5" />
                    <rect x="4" y="108" width="52" height="24" rx="6" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
                    <text x="30" y="124" textAnchor="middle" fill="#166534" fontSize="9" fontWeight="600" fontFamily="system-ui">Idea B</text>
                    <line x1="124" y1="72" x2="165" y2="40" stroke="#8b5cf6" strokeWidth="1.5" />
                    <rect x="140" y="28" width="54" height="24" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="167" y="44" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="600" fontFamily="system-ui">Idea C</text>
                    <line x1="124" y1="88" x2="168" y2="118" stroke="#8b5cf6" strokeWidth="1.5" />
                    <rect x="142" y="106" width="54" height="24" rx="6" fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
                    <text x="169" y="122" textAnchor="middle" fill="#be185d" fontSize="9" fontWeight="600" fontFamily="system-ui">Idea D</text>
                  </svg>
                </div>
                <div className="doc-showcase-label">
                  <span className="doc-showcase-label-title">Mind map</span>
                  <span className="doc-showcase-label-badge">Made in Kanvas</span>
                </div>
              </div>

              {/* 4 — UI Wireframe (wide) */}
              <div className="doc-showcase-item doc-showcase-item--wide">
                <div className="doc-showcase-canvas">
                  <svg viewBox="0 0 400 160" fill="none">
                    <rect x="10" y="10" width="380" height="140" rx="8" fill="var(--surface-muted)" stroke="var(--border)" strokeWidth="1.5" />
                    <rect x="20" y="20" width="360" height="28" rx="4" fill="var(--surface-solid)" stroke="var(--border)" strokeWidth="1" />
                    <rect x="28" y="26" width="40" height="16" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
                    <rect x="76" y="26" width="32" height="16" rx="3" fill="var(--surface-muted)" stroke="var(--border)" strokeWidth="1" />
                    <rect x="116" y="26" width="36" height="16" rx="3" fill="var(--surface-muted)" stroke="var(--border)" strokeWidth="1" />
                    <rect x="330" y="24" width="50" height="20" rx="4" fill="#22c55e" stroke="#166534" strokeWidth="1" />
                    <text x="355" y="37" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600" fontFamily="system-ui">Sign in</text>
                    <rect x="20" y="58" width="180" height="84" rx="6" fill="var(--surface-solid)" stroke="var(--border)" strokeWidth="1" />
                    <rect x="30" y="68" width="100" height="10" rx="2" fill="var(--border)" />
                    <rect x="30" y="84" width="140" height="6" rx="2" fill="var(--surface-muted)" />
                    <rect x="30" y="94" width="120" height="6" rx="2" fill="var(--surface-muted)" />
                    <rect x="30" y="110" width="70" height="22" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
                    <text x="65" y="124" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600" fontFamily="system-ui">Get started</text>
                    <rect x="210" y="58" width="170" height="84" rx="6" fill="var(--surface-solid)" stroke="var(--border)" strokeWidth="1" />
                    <rect x="226" y="72" width="48" height="36" rx="4" fill="var(--surface-muted)" stroke="var(--border)" strokeWidth="0.8" />
                    <rect x="234" y="80" width="32" height="4" rx="2" fill="var(--border)" />
                    <rect x="234" y="88" width="24" height="4" rx="2" fill="var(--surface-muted)" />
                    <rect x="286" y="78" width="80" height="6" rx="2" fill="var(--border)" />
                    <rect x="286" y="90" width="60" height="6" rx="2" fill="var(--surface-muted)" />
                  </svg>
                </div>
                <div className="doc-showcase-label">
                  <span className="doc-showcase-label-title">UI Wireframe</span>
                  <span className="doc-showcase-label-badge">Made in Kanvas</span>
                </div>
              </div>

              {/* 5 — Study notes */}
              <div className="doc-showcase-item">
                <div className="doc-showcase-canvas">
                  <svg viewBox="0 0 200 160" fill="none">
                    <rect x="10" y="10" width="180" height="140" rx="8" fill="#fefce8" stroke="#eab308" strokeWidth="1.5" />
                    <text x="24" y="32" fill="#854d0e" fontSize="12" fontWeight="800" fontFamily="system-ui">Study Notes</text>
                    <line x1="24" y1="38" x2="100" y2="38" stroke="#eab308" strokeWidth="1.5" />
                    <rect x="20" y="48" width="70" height="20" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
                    <text x="55" y="62" textAnchor="middle" fill="#1d4ed8" fontSize="8" fontWeight="600" fontFamily="system-ui">Key concept</text>
                    <line x1="20" y1="78" x2="170" y2="78" stroke="#eab308" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.4" />
                    <circle cx="28" cy="92" r="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
                    <text x="38" y="95" fill="#166534" fontSize="8" fontFamily="system-ui">Important point</text>
                    <circle cx="28" cy="108" r="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="1" />
                    <text x="38" y="111" fill="#166534" fontSize="8" fontFamily="system-ui">Another detail</text>
                    <circle cx="28" cy="124" r="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
                    <text x="38" y="127" fill="#92400e" fontSize="8" fontFamily="system-ui">Remember this</text>
                    <rect x="120" y="48" width="60" height="50" rx="4" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1" />
                    <text x="150" y="68" textAnchor="middle" fill="#7c3aed" fontSize="8" fontWeight="600" fontFamily="system-ui">Diagram</text>
                    <circle cx="140" cy="82" r="6" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="1" />
                    <circle cx="160" cy="82" r="6" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="1" />
                    <line x1="146" y1="82" x2="154" y2="82" stroke="#8b5cf6" strokeWidth="1" />
                  </svg>
                </div>
                <div className="doc-showcase-label">
                  <span className="doc-showcase-label-title">Study notes</span>
                  <span className="doc-showcase-label-badge">Made in Kanvas</span>
                </div>
              </div>

              {/* 6 — Brainstorm board (tall) */}
              <div className="doc-showcase-item doc-showcase-item--tall">
                <div className="doc-showcase-canvas">
                  <svg viewBox="0 0 200 340" fill="none">
                    <rect x="10" y="10" width="180" height="320" rx="10" fill="var(--surface-muted)" stroke="var(--border)" strokeWidth="1.5" />
                    <text x="100" y="32" textAnchor="middle" fill="var(--text)" fontSize="11" fontWeight="800" fontFamily="system-ui">Brainstorm</text>
                    <rect x="20" y="44" width="72" height="52" rx="6" fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
                    <text x="56" y="64" textAnchor="middle" fill="#be185d" fontSize="8" fontWeight="600" fontFamily="system-ui">Color</text>
                    <circle cx="40" cy="80" r="6" fill="#ec4899" />
                    <circle cx="56" cy="80" r="6" fill="#8b5cf6" />
                    <circle cx="72" cy="80" r="6" fill="#3b82f6" />
                    <rect x="100" y="44" width="80" height="52" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="140" y="64" textAnchor="middle" fill="#1d4ed8" fontSize="8" fontWeight="600" fontFamily="system-ui">Layout</text>
                    <rect x="110" y="74" width="28" height="16" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
                    <rect x="142" y="74" width="28" height="16" rx="2" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" />
                    <rect x="20" y="108" width="160" height="44" rx="6" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
                    <text x="100" y="128" textAnchor="middle" fill="#166534" fontSize="8" fontWeight="600" fontFamily="system-ui">Timeline</text>
                    <line x1="30" y1="140" x2="170" y2="140" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="50" cy="140" r="4" fill="#22c55e" />
                    <circle cx="100" cy="140" r="4" fill="#22c55e" />
                    <circle cx="150" cy="140" r="4" fill="#22c55e" />
                    <rect x="20" y="164" width="76" height="68" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="58" y="184" textAnchor="middle" fill="#92400e" fontSize="8" fontWeight="600" fontFamily="system-ui">Ideas</text>
                    <rect x="28" y="192" width="60" height="5" rx="2" fill="#fde68a" />
                    <rect x="28" y="201" width="44" height="5" rx="2" fill="#fde68a" />
                    <rect x="28" y="210" width="52" height="5" rx="2" fill="#fde68a" />
                    <rect x="104" y="164" width="76" height="68" rx="6" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" />
                    <text x="142" y="184" textAnchor="middle" fill="#7c3aed" fontSize="8" fontWeight="600" fontFamily="system-ui">Tasks</text>
                    <rect x="112" y="192" width="8" height="8" rx="2" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="1" />
                    <text x="126" y="199" fill="#7c3aed" fontSize="7" fontFamily="system-ui">Design</text>
                    <rect x="112" y="206" width="8" height="8" rx="2" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="1" />
                    <text x="126" y="213" fill="#7c3aed" fontSize="7" fontFamily="system-ui">Build</text>
                    <rect x="112" y="220" width="8" height="8" rx="2" fill="#fef9c3" stroke="#eab308" strokeWidth="1" />
                    <text x="126" y="227" fill="#854d0e" fontSize="7" fontFamily="system-ui">Ship</text>
                    <rect x="20" y="248" width="160" height="52" rx="6" fill="#fff" stroke="var(--border)" strokeWidth="1.5" />
                    <text x="100" y="268" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontWeight="600" fontFamily="system-ui">Notes</text>
                    <rect x="30" y="278" width="100" height="4" rx="2" fill="var(--surface-muted)" />
                    <rect x="30" y="286" width="70" height="4" rx="2" fill="var(--surface-muted)" />
                  </svg>
                </div>
                <div className="doc-showcase-label">
                  <span className="doc-showcase-label-title">Brainstorm board</span>
                  <span className="doc-showcase-label-badge">Made in Kanvas</span>
                </div>
              </div>

            </div>
          </section>

          {(() => {
            const sections = NAV.flatMap(cat => cat.items)
            const currentIdx = sections.findIndex(s => s.id === activeSection)
            const prev = currentIdx > 0 ? sections[currentIdx - 1] : null
            const next = currentIdx >= 0 && currentIdx < sections.length - 1 ? sections[currentIdx + 1] : null
            if (!prev && !next) return null
            return (
              <nav className="doc-prev-next" aria-label="Section navigation">
                {prev ? (
                  <button className="doc-prev-btn" onClick={() => scrollTo(prev.id)} type="button">
                    <span className="doc-prev-next-label">Previous</span>
                    <span className="doc-prev-next-title">{prev.label}</span>
                  </button>
                ) : <span />}
                {next ? (
                  <button className="doc-next-btn" onClick={() => scrollTo(next.id)} type="button">
                    <span className="doc-prev-next-label">Next</span>
                    <span className="doc-prev-next-title">{next.label}</span>
                  </button>
                ) : <span />}
              </nav>
            )
          })()}

        </main>

        <aside className="doc-toc" aria-label="On this page">
          {tocHeadings.length > 0 && (
            <>
              <span className="doc-toc-label">ON THIS PAGE</span>
              <nav className="doc-toc-nav">
                {tocHeadings.map(item => {
                  const isActive = activeTocId === item.id
                  return (
                    <div key={item.id} className="doc-toc-group">
                      <button
                        className={`doc-toc-item doc-toc-item--h2${isActive ? ' active' : ''}`}
                        onClick={() => scrollTo(item.id)}
                        type="button"
                      >
                        <span className={`doc-toc-dot doc-toc-dot--h2${isActive ? ' active' : ''}`} />
                        <span className="doc-toc-text">{item.text}</span>
                      </button>
                      {item.children.length > 0 && (
                        <div className="doc-toc-children">
                          {item.children.map(child => {
                            const isChildActive = activeTocId === child.id
                            return (
                              <button
                                key={child.id}
                                className={`doc-toc-item doc-toc-item--h3${isChildActive ? ' active' : ''}`}
                                onClick={() => scrollTo(child.id)}
                                type="button"
                              >
                                <span className={`doc-toc-dot doc-toc-dot--h3${isChildActive ? ' active' : ''}`} />
                                <span className="doc-toc-text">{child.text}</span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </>
          )}
        </aside>
      </div>

      <footer className="doc-footer">
        <div className="doc-footer-canvas" aria-hidden="true">
          <svg viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-footer-svg">
            {/* Mini canvas board with realistic content */}
            <rect x="8" y="8" width="76" height="64" rx="6" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
            <rect x="16" y="16" width="28" height="16" rx="3" fill="rgba(69,133,209,0.12)" stroke="var(--accent-blue)" strokeWidth="1.2" />
            <text x="30" y="27" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="var(--accent-blue)">Plan</text>
            <path d="M48 24 L58 24" stroke="var(--muted)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M55 22 L59 24 L55 26" fill="none" stroke="var(--muted)" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="70" cy="24" r="8" fill="rgba(212,148,58,0.1)" stroke="var(--accent-coral)" strokeWidth="1.2" />
            <text x="70" y="27" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="var(--accent-coral)">Do</text>
            <rect x="16" y="44" width="36" height="18" rx="2" fill="rgba(234,179,8,0.08)" stroke="var(--accent-yellow, #eab308)" strokeWidth="0.8" />
            <text x="22" y="55" fontSize="5" fontFamily="system-ui" fill="var(--accent-yellow, #854d0e)">Notes</text>
            <rect x="58" y="44" width="20" height="18" rx="3" fill="rgba(139,92,246,0.1)" stroke="var(--accent-purple)" strokeWidth="1" />
            <text x="68" y="56" textAnchor="middle" fontSize="5" fontWeight="600" fontFamily="system-ui" fill="var(--accent-purple)">Ship</text>

            {/* Arrow to second board */}
            <path d="M92 40 L112 40" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
            <path d="M108 37 L114 40 L108 43" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Second mini board */}
            <rect x="120" y="8" width="68" height="64" rx="6" fill="var(--surface-solid)" stroke="var(--border)" strokeWidth="1.5" />
            <rect x="128" y="16" width="52" height="14" rx="3" fill="rgba(47,133,90,0.1)" stroke="var(--accent)" strokeWidth="1" />
            <text x="154" y="26" textAnchor="middle" fontSize="6" fontWeight="600" fontFamily="system-ui" fill="var(--accent)">Project board</text>
            <rect x="128" y="36" width="22" height="12" rx="2" fill="rgba(69,133,209,0.08)" stroke="var(--accent-blue)" strokeWidth="0.8" />
            <rect x="154" y="36" width="22" height="12" rx="2" fill="rgba(82,189,107,0.08)" stroke="var(--accent)" strokeWidth="0.8" />
            <rect x="128" y="54" width="48" height="12" rx="2" fill="rgba(234,179,8,0.06)" stroke="var(--accent-yellow, #eab308)" strokeWidth="0.6" />
            <text x="134" y="63" fontSize="5" fontFamily="system-ui" fill="var(--accent-yellow, #854d0e)">Sprint notes</text>

            {/* Small shapes cluster */}
            <rect x="204" y="16" width="22" height="14" rx="3" fill="rgba(69,133,209,0.1)" stroke="var(--accent-blue)" strokeWidth="1" />
            <circle cx="244" cy="24" r="8" fill="rgba(82,189,107,0.1)" stroke="var(--accent)" strokeWidth="1" />
            <rect x="264" y="16" width="18" height="14" rx="3" fill="rgba(139,92,246,0.08)" stroke="var(--accent-purple)" strokeWidth="1" />
            {/* Connecting arrows */}
            <path d="M230 24 L234 24" stroke="var(--muted)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M254 24 L262 24" stroke="var(--muted)" strokeWidth="0.8" strokeLinecap="round" />
            {/* Bottom row */}
            <rect x="204" y="40" width="36" height="24" rx="3" fill="rgba(234,179,8,0.06)" stroke="var(--accent-yellow, #eab308)" strokeWidth="0.8" />
            <text x="212" y="52" fontSize="5" fontFamily="system-ui" fill="var(--accent-yellow, #854d0e)">Idea</text>
            <rect x="248" y="40" width="34" height="24" rx="3" fill="rgba(220,69,69,0.06)" stroke="var(--accent-coral)" strokeWidth="0.8" />
            <text x="256" y="52" fontSize="5" fontFamily="system-ui" fill="var(--accent-coral)">Review</text>
            <path d="M242 52 L246 52" stroke="var(--muted)" strokeWidth="0.6" strokeLinecap="round" />
          </svg>
        </div>

        <div className="doc-footer-content">
          <h2 className="doc-footer-title">Ready to create?</h2>
          <p className="doc-footer-desc">Open Kanvas and start turning your ideas into something visual.</p>
          <a href="#/" className="doc-footer-btn">
            <NavIcon name="board" />
            <span>Open Whiteboard</span>
          </a>
        </div>

        <div className="doc-footer-bottom">
          <span className="doc-footer-tagline">Kanvas — Think. Draw. Create.</span>
        </div>
      </footer>

      <BackToTop />
    </div>
  )
}
