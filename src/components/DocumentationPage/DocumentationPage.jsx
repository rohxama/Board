import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../../context/ThemeContext'
import siteIcon from '../../assets/images/site-logo-removebg-preview.png'
import {
  GettingStartedIllustration,
  ToolsIllustration,
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
  GettingStartedDiagram,
  StylingStoryDiagram,
  ExportStoryDiagram,
  NavigationStoryDiagram,
} from './FeatureStories'
import {
  SectionBreak,
  ToolsBreakIllustration,
  ZoomBreakIllustration,
  StylingBreakIllustration,
  ExportBreakIllustration,
  ShortcutsBreakIllustration,
} from './SectionBreaks'

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

function NavIcon({ name }) {
  const icons = {
    logo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 12h6M12 9v6" /></svg>,
    board: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>,
    chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>,
    menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>,
    close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6 6 18" /></svg>,
    cursor: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="m5 3 6 17 2-7 7-2L5 3Z" /></svg>,
    hand: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M8 10V5a1.5 1.5 0 0 1 3 0v5V3.5a1.5 1.5 0 0 1 3 0V10V5a1.5 1.5 0 0 1 3 0v6" /><path d="M8 11 6.8 8.3a1.5 1.5 0 0 0-2.1 2.1l4.4 6a3.8 3.8 0 0 0 3.2 1.6h2.2a4 4 0 0 0 4-4V11" /></svg>,
    square: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>,
    circle: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /></svg>,
    diamond: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 21 12 12 21 3 12 12 3" /></svg>,
    arrow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19 19 5M8 5h11v11" /></svg>,
    line: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M5 19 19 5" /></svg>,
    pen: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="m4 20 4-1 10-10-3-3L5 16l-1 4Z" /><path d="m13 8 3 3" /></svg>,
    laser: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V5h2M18 5h2v2M20 17v2h-2M6 19H4v-2M5 12h14" /></svg>,
    text: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6V4h16v2M12 4v16M8 20h8" /></svg>,
    eraser: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="m7 19-3-3a2 2 0 0 1 0-3l7-7a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-5 5H7Z" /></svg>,
    image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8" cy="9" r="1" /><path d="m21 15-5-5L5 20" /></svg>,
    download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>,
    zoom: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6M8 11h6" /></svg>,
    undo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M9 7 4 12l5 5M4 12h10a5 5 0 0 1 5 5" /></svg>,
    redo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="m15 7 5 5-5 5M20 12H10a5 5 0 0 0-5 5" /></svg>,
    palette: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2" /><circle cx="17.5" cy="10.5" r="2" /><circle cx="8.5" cy="7.5" r="2" /><circle cx="6.5" cy="12" r="2" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.75 1.5-1.5 0-.39-.15-.74-.39-1.04-.23-.29-.38-.63-.38-1.02 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-9.96-10-9.96Z" /></svg>,
    sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>,
    moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>,
    file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8l-5-5Z" /><path d="M13 3v5h5" /></svg>,
    code: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 5l-2 14" /></svg>,
    copy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>,
    print: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V4h12v5M6 18H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1M6 14h12v6H6v-6Z" /></svg>,
    camera: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.5" /></svg>,
    pdf: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8l-5-5Z" /><path d="M13 3v5h5" /><path d="M9 13h6M9 17h4" /></svg>,
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5Z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
    json: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1" /><path d="M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1" /></svg>,
    lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    flip: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" /><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" /><path d="m7 12 5-5 5 5" /><path d="M12 17V7" /></svg>,
    layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 8 4.5-8 4.5-8-4.5L12 2Z" /><path d="m2 15 8 4.5 8-4.5" /><path d="m2 10 8 4.5 8-4.5" /></svg>,
    info: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>,
    play: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
    zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  }
  return <span className="doc-nav-icon">{icons[name] || null}</span>
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
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
                <p className="doc-editorial-desc">Go from idea to first shape in under a minute.</p>
                <ol className="doc-editorial-list">
                  <li><strong>Open</strong> Kanvas in your browser</li>
                  <li><strong>Choose</strong> a tool from the left toolbar</li>
                  <li><strong>Click and drag</strong> on the canvas to create shapes</li>
                  <li><strong>Switch back</strong> to Select to move and edit</li>
                  <li><strong>Use</strong> the Style panel to customize colors and strokes</li>
                </ol>
                <p className="doc-editorial-note">The canvas is infinite — zoom and pan to explore as much space as you need.</p>
              </div>
            </div>

            <FeatureStory
              heading="From Idea to Board"
              description="Create your first board in four simple steps."
              diagram={<GettingStartedDiagram />}
              steps={['Open Kanvas in your browser', 'Choose a tool from the toolbar', 'Click and drag to create shapes', 'Select, move, and style your work']}
            />
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

            <div className="doc-editorial doc-editorial--reversed">
              <div className="doc-editorial-visual">
                <ToolsIllustration />
              </div>
              <div className="doc-editorial-text">
                <span className="doc-editorial-label">Toolbar</span>
                <h3 className="doc-editorial-heading">Every tool, one click away</h3>
                <p className="doc-editorial-desc">Kanvas provides a focused set of tools for creating and editing on the canvas. Each tool is accessible from the left toolbar.</p>
                <ul className="doc-editorial-list">
                  <li><strong>Select (V)</strong> — select, move, resize, and rotate shapes</li>
                  <li><strong>Pan (H)</strong> — navigate the infinite canvas without editing</li>
                  <li><strong>Rectangle (R)</strong> — draw rectangles with fill, stroke, and rounded corners</li>
                  <li><strong>Ellipse (O)</strong> — draw ellipses and circles</li>
                  <li><strong>Diamond (D)</strong> — draw diamond shapes</li>
                  <li><strong>Arrow (A)</strong> — connect shapes with snappable arrows</li>
                  <li><strong>Line (L)</strong> — draw straight lines at any angle</li>
                  <li><strong>Pencil (P)</strong> — freehand drawing for organic sketches</li>
                  <li><strong>Text (T)</strong> — add labels, notes, and headings</li>
                  <li><strong>Eraser (E)</strong> — click to remove any shape</li>
                  <li><strong>Laser (K)</strong> — temporary pointer for presentations</li>
                  <li><strong>Image (9)</strong> — upload PNG, JPEG, SVG, or WebP files</li>
                </ul>
                <p className="doc-editorial-note">Hold Space at any time to temporarily switch to Pan mode.</p>
              </div>
            </div>
          </section>

          <SectionBreak
            label="03"
            heading="Zoom & Canvas Navigation"
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
                <p className="doc-editorial-desc">Move freely across your infinite canvas with zoom and pan controls. The canvas has no boundaries — explore freely.</p>
                <ul className="doc-editorial-list">
                  <li><strong>Zoom in</strong> — scroll wheel, press <kbd>Ctrl</kbd>+<kbd>+</kbd>, or click +</li>
                  <li><strong>Zoom out</strong> — scroll wheel, press <kbd>Ctrl</kbd>+<kbd>-</kbd>, or click −</li>
                  <li><strong>Reset to 100%</strong> — click the percentage display or press <kbd>Ctrl</kbd>+<kbd>0</kbd></li>
                  <li><strong>Zoom to fit</strong> — press <kbd>Shift</kbd>+<kbd>1</kbd> to frame all content</li>
                  <li><strong>Pan</strong> — hold <kbd>Space</kbd> and drag, or use two-finger trackpad drag</li>
                  <li><strong>Fullscreen</strong> — click the fullscreen button for an immersive view</li>
                </ul>
                <p className="doc-editorial-note">Presets: 25% · 50% · 75% · 100% · 150% — click the percentage to open the menu.</p>
              </div>
            </div>

            <FeatureStory
              heading="Navigate the Canvas"
              description="Move freely across your infinite canvas with zoom and pan."
              diagram={<NavigationStoryDiagram />}
              steps={['Scroll to zoom in and out', 'Hold Space and drag to pan', 'Press Shift+1 to zoom to fit', 'Explore without boundaries']}
            />
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
                <p className="doc-editorial-desc">Kanvas keeps a history of your actions so you can easily undo mistakes or redo changes.</p>
                <ul className="doc-editorial-list">
                  <li><strong>Undo</strong> — reverses the last action. Press <kbd>Ctrl</kbd>+<kbd>Z</kbd></li>
                  <li><strong>Redo</strong> — re-applies an undone action. Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd></li>
                  <li><strong>200 steps</strong> — generous history per session</li>
                  <li><strong>Session-based</strong> — history is preserved while the tab stays open</li>
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
                <p className="doc-editorial-desc">Kanvas gives you precise control over every shape on the canvas. Choose colors, adjust strokes, add fills, and fine-tune opacity to make your boards visually distinct.</p>
                <ul className="doc-editorial-list">
                  <li><strong>6 stroke colors</strong> — pick from a curated palette via the Style panel</li>
                  <li><strong>5 fill colors</strong> — add solid backgrounds to rectangles, ellipses, and diamonds</li>
                  <li><strong>3 stroke widths</strong> — thin, medium, or thick outlines</li>
                  <li><strong>3 stroke styles</strong> — solid, dashed, or dotted lines</li>
                  <li><strong>Opacity slider</strong> — from fully transparent to fully opaque</li>
                  <li><strong>Corner radius</strong> — sharp or rounded rectangle corners</li>
                </ul>
                <p className="doc-editorial-note">Select any shape to reveal its properties in the Style panel.</p>
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
                <p className="doc-editorial-desc">Switch between light and dark themes from the Appearance panel. The same board content adapts instantly — no manual restyle needed.</p>
                <ul className="doc-editorial-list">
                  <li><strong>Canvas background</strong> — white in light mode, dark gray in dark mode</li>
                  <li><strong>Shape colors</strong> — automatically adjusted for readability on each theme</li>
                  <li><strong>All UI elements</strong> — toolbars, panels, and menus follow the theme</li>
                  <li><strong>Persistent preference</strong> — your choice is saved across sessions</li>
                  <li><strong>Dot grid</strong> — adapts contrast to stay subtle on both backgrounds</li>
                </ul>
                <p className="doc-editorial-note">Try the interactive toggle below to see the effect.</p>
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
                <p className="doc-editorial-desc">Save your work in multiple formats. Click the Export Board button in the top toolbar to see all options.</p>
                <ul className="doc-editorial-list">
                  <li><strong>PNG / JPG</strong> — high-resolution images for sharing and presentations</li>
                  <li><strong>PDF</strong> — printable document with the board rendered as an image</li>
                  <li><strong>SVG</strong> — vector format that scales to any size without quality loss</li>
                  <li><strong>JSON</strong> — save all shape data; import later to resume editing</li>
                  <li><strong>Copy Image</strong> — paste the board directly into other apps</li>
                  <li><strong>Print</strong> — open the system print dialog with the board</li>
                </ul>
                <p className="doc-editorial-note">JSON import validates file size (max 25 MB) and shape count (max 10,000 shapes).</p>
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
                <p className="doc-editorial-desc">A few habits that make Kanvas faster and more productive.</p>
                <ul className="doc-editorial-list">
                  <li><strong>Stay in Select mode</strong> — it's the most-used tool; switch back after drawing</li>
                  <li><strong>Zoom for detail</strong> — scroll wheel is the fastest way to focus on small areas</li>
                  <li><strong>Space + drag to pan</strong> — navigate large boards without switching tools</li>
                  <li><strong>Export your work</strong> — save as JSON to resume editing later</li>
                  <li><strong>Try different styles</strong> — stroke colors, widths, and fills make boards scannable</li>
                  <li><strong>Use undo freely</strong> — Ctrl+Z supports up to 200 steps per session</li>
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
                <p className="doc-editorial-desc">Everything you need to know about using Kanvas.</p>
                <ul className="doc-editorial-list">
                  <li><strong>Free to use</strong> — no account required, start immediately</li>
                  <li><strong>Local storage</strong> — boards save to your browser automatically</li>
                  <li><strong>Export formats</strong> — PNG, JPG, PDF, SVG, and JSON</li>
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

            <div className="doc-showcase-grid">

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
