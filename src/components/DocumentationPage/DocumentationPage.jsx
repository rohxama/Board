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
    question: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>,
    rocket: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>,
    lightbulb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>,
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
            <NavIcon name="lightbulb" />
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

function Star({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8l-6.4 4.4 2.4-7.2-6-4.8h7.6z" />
    </svg>
  )
}

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Think',
    desc: 'Start with an idea. Every great board begins with a single thought — a concept, a problem, a spark.',
    color: '#10b981',
    illustration: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-workflow-illust" aria-hidden="true">
        <circle cx="32" cy="24" r="14" stroke="#10b981" strokeWidth="2" fill="rgba(16,185,129,0.08)" />
        <path d="M26 22c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="22" r="2" fill="#10b981" />
        <path d="M28 38h8M26 42h12" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 4v4M20 8l2 3.5M44 8l-2 3.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
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
        <rect x="8" y="12" width="16" height="12" rx="2" stroke="#3b82f6" strokeWidth="1.5" fill="rgba(59,130,246,0.08)" />
        <circle cx="44" cy="18" r="7" stroke="#3b82f6" strokeWidth="1.5" fill="rgba(59,130,246,0.08)" />
        <rect x="30" y="36" width="10" height="10" rx="1" stroke="#3b82f6" strokeWidth="1.5" fill="rgba(59,130,246,0.08)" transform="rotate(45 35 41)" />
        <path d="M12 44l8-8 4 4 8-10" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="32" r="2" fill="#3b82f6" opacity="0.4" />
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
        <path d="M12 52L48 12" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
        <path d="M48 12l-6 2 2-6" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="10" y="30" width="20" height="14" rx="2" stroke="#8b5cf6" strokeWidth="1.5" fill="rgba(139,92,246,0.08)" />
        <circle cx="42" cy="40" r="8" stroke="#8b5cf6" strokeWidth="1.5" fill="rgba(139,92,246,0.08)" />
        <path d="M16 18c2-4 6-2 8 0s6 4 8 0" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
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
        <rect x="10" y="14" width="22" height="16" rx="3" stroke="#f97066" strokeWidth="2" fill="rgba(249,112,102,0.12)" />
        <rect x="32" y="14" width="22" height="16" rx="3" stroke="#f97066" strokeWidth="2" strokeDasharray="4 3" fill="rgba(249,112,102,0.06)" />
        <circle cx="18" cy="46" r="6" fill="#f97066" opacity="0.25" />
        <circle cx="32" cy="46" r="6" fill="#f97066" opacity="0.5" />
        <circle cx="46" cy="46" r="6" fill="#f97066" opacity="0.8" />
        <path d="M14 36h14" stroke="#f97066" strokeWidth="1.5" strokeLinecap="round" />
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
        <rect x="6" y="8" width="18" height="12" rx="2" stroke="#f59e0b" strokeWidth="1.5" fill="rgba(245,158,11,0.08)" />
        <rect x="40" y="8" width="18" height="12" rx="2" stroke="#f59e0b" strokeWidth="1.5" fill="rgba(245,158,11,0.08)" />
        <rect x="22" y="32" width="20" height="12" rx="2" stroke="#f59e0b" strokeWidth="1.5" fill="rgba(245,158,11,0.08)" />
        <rect x="6" y="48" width="16" height="10" rx="2" stroke="#f59e0b" strokeWidth="1.5" fill="rgba(245,158,11,0.08)" />
        <rect x="42" y="48" width="16" height="10" rx="2" stroke="#f59e0b" strokeWidth="1.5" fill="rgba(245,158,11,0.08)" />
        <path d="M15 20v4l17 8M49 20v4L32 32" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3" />
        <path d="M32 44v4M14 58h16M50 58H34" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeDasharray="3 3" />
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
        <rect x="12" y="8" width="40" height="48" rx="4" stroke="#ec4899" strokeWidth="1.5" fill="rgba(236,72,153,0.06)" />
        <path d="M20 20h24M20 28h24M20 36h16" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="48" cy="48" r="10" fill="rgba(236,72,153,0.12)" stroke="#ec4899" strokeWidth="1.5" />
        <path d="M48 42v12M42 48h12" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M44 42l4-4 4 4" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
        <NavIcon name="rocket" /> From Idea to Canvas
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
          <div className="doc-theme-demo-triangle" />
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
          <div className="doc-zoom-demo-shape doc-zoom-demo-shape--diamond" />
          <div className="doc-zoom-demo-shape doc-zoom-demo-shape--arrow" />
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
            <h2 className="doc-section-title"><NavIcon name="rocket" /> Getting Started</h2>
            <GettingStartedIllustration />
            <FeatureStory
              heading="From Idea to Board"
              description="Create your first board in four simple steps."
              diagram={<GettingStartedDiagram />}
              steps={['Open Kanvas in your browser', 'Choose a tool from the toolbar', 'Click and drag to create shapes', 'Select, move, and style your work']}
            />
            <div className="doc-card">
              <h3 id="how-to-start" className="doc-card-title">How to Start Creating</h3>
              <ol className="doc-start-steps">
                <li><strong>Open</strong> Kanvas in your browser.</li>
                <li><strong>Choose</strong> a tool from the toolbar on the left side of the screen.</li>
                <li><strong>Click and drag</strong> on the canvas to create shapes, lines, or drawings.</li>
                <li><strong>Switch back</strong> to the <strong>Select</strong> tool to move and edit objects.</li>
                <li><strong>Use</strong> the toolbar and style controls to customize your work.</li>
              </ol>
              <p className="doc-note">The canvas is infinite — zoom and pan to explore as much space as you need.</p>
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
            <ToolsIllustration />
            <p className="doc-section-intro">Kanvas provides a focused set of tools for creating and editing on the canvas. Each tool is accessible from the left toolbar.</p>

            <ToolCard
              icon="cursor"
              name="Select"
              shortcut="V"
              description="The primary tool for interacting with objects on the canvas. Use it to select, move, resize, and rotate shapes."
              className="doc-tool-card--blue"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <rect x="30" y="22" width="56" height="40" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                  <rect x="26" y="18" width="8" height="8" rx="1.5" fill="#3b82f6" />
                  <rect x="82" y="18" width="8" height="8" rx="1.5" fill="#3b82f6" />
                  <rect x="26" y="58" width="8" height="8" rx="1.5" fill="#3b82f6" />
                  <rect x="82" y="58" width="8" height="8" rx="1.5" fill="#3b82f6" />
                  <line x1="58" y1="10" x2="58" y2="18" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="58" cy="7" r="4" fill="#3b82f6" />
                  <circle cx="140" cy="45" r="22" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                  <rect x="118" y="38" width="8" height="8" rx="1.5" fill="#f59e0b" />
                  <rect x="154" y="38" width="8" height="8" rx="1.5" fill="#f59e0b" />
                  <rect x="118" y="44" width="8" height="8" rx="1.5" fill="#f59e0b" />
                  <rect x="154" y="44" width="8" height="8" rx="1.5" fill="#f59e0b" />
                  <path d="M136 100 L140 90 L144 100" fill="var(--text-muted)" opacity="0.4" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">click to select · drag to move</text>
                </svg>
              }
              howToUse={[
                'Click the Select tool in the toolbar (or press V).',
                'Click on any shape to select it — resize handles and a rotation anchor appear.',
                'Drag the shape to move it around the canvas.',
                'Drag any corner handle to resize. Hold Shift to maintain proportions.',
                'Drag the rotation handle above the shape to rotate it.',
                'Click on an empty area to deselect. Hold Shift and click to add shapes to the selection.',
              ]}
              tips="Double-click a text shape to edit its content."
            />

            <ToolCard
              icon="hand"
              name="Pan"
              shortcut="H"
              description="Move around the infinite canvas without affecting any shapes. Panning lets you navigate large boards and focus on different areas."
              className="doc-tool-card--purple"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <g opacity="0.15">
                    {[0,20,40,60,80,100,120,140,160,180,200].map(x => (
                      <line key={`v${x}`} x1={x} y1="0" x2={x} y2="120" stroke="var(--text-muted)" strokeWidth="0.5" />
                    ))}
                    {[0,20,40,60,80,100,120].map(y => (
                      <line key={`h${y}`} x1="0" y1={y} x2="200" y2={y} stroke="var(--text-muted)" strokeWidth="0.5" />
                    ))}
                  </g>
                  <rect x="15" y="30" width="40" height="28" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                  <rect x="55" y="20" width="32" height="22" rx="3" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  <rect x="100" y="40" width="36" height="26" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
                  <path d="M155 35 L175 35" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M168 29 L175 35 L168 41" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M155 85 L135 85" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M142 79 L135 85 L142 91" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">hold Space + drag to pan</text>
                </svg>
              }
              howToUse={[
                'Select the Pan tool from the toolbar (or press H).',
                'Click and drag anywhere on the canvas to move your view.',
                'Release to stop panning.',
              ]}
              tips="Hold the Space bar at any time to temporarily activate Pan mode, then release to return to your previous tool."
            />

            <ToolCard
              icon="square"
              name="Rectangle"
              shortcut="R"
              description="Draw rectangular shapes on the canvas. Rectangles support fill colors, stroke styles, rounded corners, and opacity."
              className="doc-tool-card--blue"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <rect x="25" y="20" width="65" height="50" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                  <rect x="105" y="30" width="55" height="40" rx="12" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                  <rect x="40" y="75" width="50" height="30" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" opacity="0.7" />
                  <rect x="115" y="78" width="40" height="24" rx="2" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">click + drag to draw</text>
                </svg>
              }
              howToUse={[
                'Select the Rectangle tool (or press R).',
                'Click and drag on the canvas to create a rectangle.',
                'After drawing, you return to Select mode automatically.',
                'Select the rectangle again to move, resize, or style it.',
              ]}
              tips="Use the Style panel to switch between sharp and rounded corners."
            />

            <ToolCard
              icon="circle"
              name="Ellipse"
              shortcut="O"
              description="Draw ellipses and circles on the canvas. Ellipses support fill colors, stroke styles, and opacity."
              className="doc-tool-card--coral"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <ellipse cx="65" cy="50" rx="35" ry="28" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                  <ellipse cx="140" cy="45" rx="22" ry="22" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                  <ellipse cx="130" cy="85" rx="30" ry="18" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" opacity="0.7" />
                  <ellipse cx="55" cy="88" rx="18" ry="14" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 2" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">hold Shift for perfect circle</text>
                </svg>
              }
              howToUse={[
                'Select the Ellipse tool (or press O).',
                'Click and drag on the canvas to create an ellipse.',
                'After drawing, you return to Select mode automatically.',
                'Select the ellipse again to move, resize, or style it.',
              ]}
              tips="Hold Shift while dragging to create a perfect circle."
            />

            <ToolCard
              icon="diamond"
              name="Diamond"
              shortcut="D"
              description="Draw diamond shapes on the canvas. Diamonds support fill colors, stroke styles, and opacity."
              className="doc-tool-card--purple"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <path d="M55 15 L85 50 L55 85 L25 50 Z" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                  <path d="M150 20 L175 50 L150 80 L125 50 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                  <path d="M95 70 L115 85 L95 100 L75 85 Z" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" opacity="0.7" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">click + drag to draw</text>
                </svg>
              }
              howToUse={[
                'Select the Diamond tool (or press D).',
                'Click and drag on the canvas to create a diamond.',
                'After drawing, you return to Select mode automatically.',
                'Select the diamond again to move, resize, or style it.',
              ]}
            />

            <ToolCard
              icon="arrow"
              name="Arrow"
              shortcut="A"
              description="Draw arrows to connect shapes or point to specific areas. Arrows can bind to nearby shapes and follow them when moved."
              className="doc-tool-card--coral"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <rect x="20" y="25" width="45" height="32" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                  <rect x="135" y="30" width="45" height="28" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  <path d="M68 41 L132 44" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  <path d="M122 38 L135 44 L124 50" fill="#ef4444" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="68" cy="41" r="3.5" fill="#dbeafe" stroke="#ef4444" strokeWidth="1.5" />
                  <path d="M40 70 L100 85" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M92 80 L102 85 L93 91" fill="#22c55e" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M40 70 L40 82" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M36 76 L40 82 L44 76" fill="#22c55e" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">arrows snap to shapes</text>
                </svg>
              }
              howToUse={[
                'Select the Arrow tool (or press A).',
                'Click and drag from a starting point to an ending point.',
                'Arrows have an arrowhead at the end by default.',
                'Select the arrow to move its endpoints or change its style.',
              ]}
              tips="When you drag an arrow endpoint close to a shape, it snaps to the shape boundary and stays connected when the shape moves."
            />

            <ToolCard
              icon="line"
              name="Line"
              shortcut="L"
              description="Draw straight lines on the canvas. Lines support different stroke widths and styles."
              className="doc-tool-card--blue"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <line x1="30" y1="85" x2="170" y2="30" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="30" y1="55" x2="170" y2="55" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                  <line x1="80" y1="20" x2="140" y2="100" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 3" />
                  <line x1="30" y1="20" x2="170" y2="100" stroke="var(--text-muted)" strokeWidth="0.5" opacity="0.3" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">hold Shift for 45° angles</text>
                </svg>
              }
              howToUse={[
                'Select the Line tool (or press L).',
                'Click and drag to draw a straight line.',
                'Select the line to move its endpoints or change its style.',
              ]}
              tips="Hold Shift while drawing to constrain the line to 45-degree angles."
            />

            <ToolCard
              icon="pen"
              name="Pencil"
              shortcut="P"
              description="Draw freehand on the canvas. Create organic shapes, sketches, and handwritten notes."
              className="doc-tool-card--green"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <path d="M25 80 C35 30, 55 90, 75 50 C95 10, 110 70, 130 40 C150 10, 165 60, 180 35" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M30 95 C50 85, 65 100, 85 90 C105 80, 120 95, 140 88" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
                  <path d="M100 65 C110 60, 120 68, 135 62" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">click + drag freely</text>
                </svg>
              }
              howToUse={[
                'Select the Pencil tool (or press P).',
                'Click and drag to draw freely on the canvas.',
                'Release to finish a stroke. You can create multiple strokes.',
                'Switch to another tool when finished drawing.',
              ]}
              tips="Use the Stroke Width control in the Style panel to adjust pencil thickness."
            />

            <ToolCard
              icon="laser"
              name="Laser"
              shortcut="K"
              description="A temporary pointer that draws a glowing beam across the canvas. Perfect for presentations and pointing things out without leaving permanent marks."
              className="doc-tool-card--pink"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <defs>
                    <filter id="laser-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path d="M25 85 C45 20, 80 90, 110 35 C130 0, 155 50, 180 20" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" filter="url(#laser-glow)" />
                  <circle cx="180" cy="20" r="5" fill="#ef4444" filter="url(#laser-glow)" />
                  <path d="M180 20 L180 20" stroke="#ff6666" strokeWidth="1" filter="url(#laser-glow)" opacity="0.5" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">temporary · disappears after 1s</text>
                </svg>
              }
              howToUse={[
                'Select the Laser tool (or press K).',
                'Click and drag across the canvas to draw a beam.',
                'The laser beam glows with a neon effect while you draw.',
                'After releasing, the beam stays visible for 1 second.',
                'The beam then retracts and disappears automatically.',
              ]}
              tips="The laser is completely non-interactive — it cannot be selected or edited. Multiple laser strokes can overlap simultaneously."
            />

            <ToolCard
              icon="eraser"
              name="Eraser"
              shortcut="E"
              description="Remove shapes from the canvas by clicking on them."
              className="doc-tool-card--coral"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <rect x="25" y="25" width="50" height="35" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" opacity="0.35" />
                  <rect x="15" y="18" width="8" height="8" rx="1.5" fill="#3b82f6" opacity="0.35" />
                  <rect x="67" y="18" width="8" height="8" rx="1.5" fill="#3b82f6" opacity="0.35" />
                  <rect x="15" y="55" width="8" height="8" rx="1.5" fill="#3b82f6" opacity="0.35" />
                  <rect x="67" y="55" width="8" height="8" rx="1.5" fill="#3b82f6" opacity="0.35" />
                  <ellipse cx="135" cy="40" rx="25" ry="18" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" opacity="0.35" />
                  <path d="M95 30 L115 55" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
                  <path d="M95 55 L115 30" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" opacity="0.25" />
                  <path d="M85 75 L105 95" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="105" cy="95" r="3" fill="#ef4444" opacity="0.4" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">click shape to erase</text>
                </svg>
              }
              howToUse={[
                'Select the Eraser tool (or press E).',
                'Click on any shape to erase it.',
                'Shapes are removed immediately — use Undo (Ctrl+Z) if you make a mistake.',
              ]}
              tips="The eraser works on all shape types including images and text."
            />

            <ToolCard
              icon="text"
              name="Text"
              shortcut="T"
              description="Add text labels, notes, and headings directly on the canvas."
              className="doc-tool-card--yellow"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <text x="40" y="45" fill="var(--text)" fontSize="28" fontWeight="800" fontFamily="system-ui, sans-serif">Aa</text>
                  <line x1="40" y1="52" x2="105" y2="52" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                  <rect x="115" y="22" width="70" height="24" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
                  <text x="150" y="38" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="600" fontFamily="system-ui, sans-serif">Label</text>
                  <rect x="30" y="70" width="60" height="18" rx="3" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="60" y="83" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="500" fontFamily="system-ui, sans-serif">Note</text>
                  <rect x="115" y="68" width="70" height="22" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
                  <text x="150" y="83" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">Heading</text>
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">click to place · type to write</text>
                </svg>
              }
              howToUse={[
                'Select the Text tool (or press T).',
                'Click on the canvas where you want to place text.',
                'Start typing. Press Enter for new lines.',
                'Click outside or press Ctrl+Enter to finish editing.',
                'Select the text object to move or style it.',
              ]}
              tips="Double-click existing text to edit it. Use the Style panel to change font size."
            />

            <ToolCard
              icon="image"
              name="Image"
              description="Upload and place images on the canvas. Supported formats include PNG, JPEG, SVG, and WebP."
              className="doc-tool-card--purple"
              visual={
                <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="doc-tool-canvas">
                  <rect x="0" y="0" width="200" height="120" rx="8" fill="var(--surface-muted)" />
                  <rect x="25" y="15" width="80" height="60" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="50" cy="35" r="8" fill="#3b82f6" opacity="0.6" />
                  <path d="M25 60 L55 40 L80 55 L95 42 L105 52 L105 75 L25 75 Z" fill="#3b82f6" opacity="0.3" />
                  <rect x="120" y="20" width="60" height="45" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                  <path d="M120 50 L140 35 L155 45 L165 38 L180 48 L180 65 L120 65 Z" fill="#f59e0b" opacity="0.3" />
                  <circle cx="135" cy="32" r="5" fill="#f59e0b" opacity="0.5" />
                  <text x="100" y="112" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">PNG · JPEG · SVG · WebP</text>
                </svg>
              }
              howToUse={[
                'Click the Image button in the toolbar (or press 9).',
                'Select an image file from your computer.',
                'The image is placed in the center of your current view.',
                'Select the image to move, resize, flip, or adjust its opacity.',
              ]}
              tips="You can also drag and drop image files directly onto the canvas. Maximum file size is 20 MB."
            />
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
            <FeatureStory
              heading="Navigate the Canvas"
              description="Move freely across your infinite canvas with zoom and pan."
              diagram={<NavigationStoryDiagram />}
              steps={['Scroll to zoom in and out', 'Hold Space and drag to pan', 'Press Shift+1 to zoom to fit', 'Explore without boundaries']}
            />
            <p className="doc-section-intro">Navigate the infinite canvas with zoom and pan controls. The canvas has no boundaries — explore freely.</p>

            <div className="doc-zoom-grid">
              <div className="doc-zoom-item">
                <h4>Zoom In</h4>
                <p>Click the + button in the zoom controls, use the scroll wheel, or press <kbd>Ctrl</kbd>+<kbd>+</kbd>.</p>
              </div>
              <div className="doc-zoom-item">
                <h4>Zoom Out</h4>
                <p>Click the − button, scroll the wheel, or press <kbd>Ctrl</kbd>+<kbd>-</kbd>.</p>
              </div>
              <div className="doc-zoom-item">
                <h4>Reset to 100%</h4>
                <p>Click the percentage display or press <kbd>Ctrl</kbd>+<kbd>0</kbd> to reset zoom to 100%.</p>
              </div>
              <div className="doc-zoom-item">
                <h4>Zoom to Fit</h4>
                <p>Press <kbd>Shift</kbd>+<kbd>1</kbd> to zoom to fit all content on screen.</p>
              </div>
            </div>

            <ZoomDemo />

            <div className="doc-card">
              <h3 id="preset-zoom" className="doc-card-title">Preset Zoom Levels</h3>
              <p>Click the zoom percentage in the bottom-right controls to open the preset zoom menu:</p>
              <div className="doc-zoom-presets">
                <span>25%</span><span>50%</span><span>75%</span><span>100%</span><span>150%</span>
              </div>
              <p className="doc-note">The canvas supports zoom from 25% to 300% via scroll wheel.</p>
            </div>

            <div className="doc-card">
              <h3 id="panning" className="doc-card-title">Panning</h3>
              <p>There are multiple ways to pan the canvas:</p>
              <ul className="doc-list">
                <li>Select the <strong>Pan tool</strong> (H) and drag to move around.</li>
                <li>Hold <kbd>Space</kbd> and drag to temporarily pan regardless of the active tool.</li>
                <li>On trackpads, use two-finger drag to pan.</li>
              </ul>
            </div>

            <div className="doc-card">
              <h3 id="fullscreen" className="doc-card-title">Fullscreen</h3>
              <p>Click the fullscreen button in the zoom controls bar to enter fullscreen mode for an immersive drawing experience. Press Esc to exit.</p>
            </div>
          </section>

          <section id="undo-redo" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="undo" /> Undo & Redo</h2>
            <p className="doc-section-intro">Kanvas keeps a history of your actions so you can easily undo mistakes or redo changes.</p>

            <div className="doc-card">
              <h3 id="how-undo-works" className="doc-card-title">How It Works</h3>
              <ul className="doc-list">
                <li><strong>Undo:</strong> Reverses the last action. Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> (or <kbd>Cmd</kbd>+<kbd>Z</kbd> on Mac).</li>
                <li><strong>Redo:</strong> Re-applies an action that was undone. Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> or <kbd>Ctrl</kbd>+<kbd>Y</kbd>.</li>
              </ul>
              <p className="doc-note">Kanvas stores up to 200 undo steps. History is preserved during your session.</p>
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
            <ColorLabHero />

            <p className="doc-section-intro">Kanvas gives you precise control over every shape on the canvas. Choose colors, adjust strokes, add fills, and fine-tune opacity to make your boards visually distinct.</p>

            {/* Color Palette */}
            <div className="doc-colorlab-block">
              <h3 className="doc-colorlab-heading">Color Palette</h3>
              <p className="doc-colorlab-desc">Kanvas provides six curated stroke colors and five fill colors. Select any shape and pick a swatch from the Style panel.</p>
              <SwatchDisplay />
            </div>

            {/* Fill */}
            <div className="doc-colorlab-block">
              <h3 className="doc-colorlab-heading">Fill</h3>
              <p className="doc-colorlab-desc">Fill applies a background color to rectangles, ellipses, and diamonds. Shapes start transparent — add a fill to make them solid.</p>
              <FillDemo />
            </div>

            {/* Stroke Width */}
            <div className="doc-colorlab-block">
              <h3 className="doc-colorlab-heading">Stroke Width</h3>
              <p className="doc-colorlab-desc">Control the thickness of shape outlines. Choose from Thin (1px), Medium (3px), or Thick (6px) in the Style panel.</p>
              <StrokeWidthDemo />
            </div>

            {/* Stroke Style */}
            <div className="doc-colorlab-block">
              <h3 className="doc-colorlab-heading">Stroke Style</h3>
              <p className="doc-colorlab-desc">Change how outlines render. Solid is the default, but dashed and dotted styles add visual variety.</p>
              <StrokeStyleDemo />
            </div>

            {/* Opacity */}
            <div className="doc-colorlab-block">
              <h3 className="doc-colorlab-heading">Opacity</h3>
              <p className="doc-colorlab-desc">Slide from 0% (fully transparent) to 100% (fully opaque). Useful for layering shapes and creating depth.</p>
              <OpacityDemo />
            </div>

            {/* Corner Style */}
            <div className="doc-colorlab-block">
              <h3 className="doc-colorlab-heading">Corner Style</h3>
              <p className="doc-colorlab-desc">Rectangles support two corner modes: sharp (radius 0) and rounded (radius 8). Toggle from the Style panel.</p>
              <CornerStyleDemo />
            </div>

            {/* Font Size */}
            <div className="doc-colorlab-block">
              <h3 className="doc-colorlab-heading">Font Size</h3>
              <p className="doc-colorlab-desc">Text objects support ten preset sizes from 12px to 48px. Select a text shape and choose from the dropdown.</p>
              <FontSizeDemo />
            </div>

            {/* Combined Styles */}
            <div className="doc-colorlab-block">
              <h3 className="doc-colorlab-heading">Combined Styles</h3>
              <p className="doc-colorlab-desc">Mix and match fill, stroke, width, style, and opacity to create polished compositions. Here are some common patterns.</p>
              <CombinedStylesDemo />
            </div>

            {/* Quick reference grid */}
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
            <ThemesIllustration />
            <p className="doc-section-intro">Kanvas supports both light and dark themes. Switch between them from the Appearance panel in the account menu.</p>

            <div className="doc-theme-grid">
              <div className="doc-theme-card">
                <div className="doc-theme-preview doc-theme-light">
                  <NavIcon name="sun" />
                </div>
                <h4>Light Mode</h4>
                <p>Clean white canvas with dark text and subtle dot grid. The default theme for Kanvas.</p>
              </div>
              <div className="doc-theme-card">
                <div className="doc-theme-preview doc-theme-dark">
                  <NavIcon name="moon" />
                </div>
                <h4>Dark Mode</h4>
                <p>Dark canvas with light text and muted dot grid. Easier on the eyes in low-light environments.</p>
              </div>
            </div>

            <ThemeToggleDemo />

            <div className="doc-card">
              <h3 id="how-themes-adapt" className="doc-card-title">How Themes Adapt</h3>
              <ul className="doc-list">
                <li>The canvas background and dot grid change to match the active theme.</li>
                <li>All toolbars, panels, and UI elements follow the theme instantly.</li>
                <li>Shape colors are automatically adjusted for readability — dark colors become lighter on dark backgrounds, and light colors become darker on light backgrounds.</li>
                <li>Your theme preference is saved and persists across sessions.</li>
              </ul>
            </div>
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
            <ExportIllustration />
            <FeatureStory
              heading="Share Your Work"
              description="Export your board in any format — from PNG images to vector SVGs."
              diagram={<ExportStoryDiagram />}
              steps={['Create your board', 'Click the Export button', 'Choose your format', 'Download or copy to clipboard']}
            />
            <p className="doc-section-intro">Save your work in multiple formats. Click the Export Board button in the top toolbar to see all options.</p>

            <div className="doc-export-grid">
              <div className="doc-export-item doc-export-item--blue">
                <div className="doc-export-icon"><NavIcon name="image" /></div>
                <h4>Download PNG</h4>
                <p>Exports the board as a high-resolution PNG image with a transparent or themed background. Best for sharing and presentations.</p>
              </div>
              <div className="doc-export-item doc-export-item--coral">
                <div className="doc-export-icon"><NavIcon name="camera" /></div>
                <h4>Download JPG</h4>
                <p>Exports as a JPEG image at 92% quality. Good for smaller file sizes when sharing online.</p>
              </div>
              <div className="doc-export-item doc-export-item--pink">
                <div className="doc-export-icon"><NavIcon name="pdf" /></div>
                <h4>Download PDF</h4>
                <p>Generates a PDF document containing the board image. Ideal for printing or archiving.</p>
              </div>
              <div className="doc-export-item doc-export-item--purple">
                <div className="doc-export-icon"><NavIcon name="svg" /></div>
                <h4>Export SVG</h4>
                <p>Exports shape data as an SVG file. Preserves vector quality at any scale.</p>
              </div>
              <div className="doc-export-item doc-export-item--yellow">
                <div className="doc-export-icon"><NavIcon name="json" /></div>
                <h4>Export JSON</h4>
                <p>Saves all shape data as JSON. Can be imported back into Kanvas later to restore your board.</p>
              </div>
              <div className="doc-export-item doc-export-item--blue">
                <div className="doc-export-icon"><NavIcon name="copy" /></div>
                <h4>Copy Image</h4>
                <p>Copies the board as a PNG image to your clipboard. Paste directly into other apps.</p>
              </div>
              <div className="doc-export-item doc-export-item--coral">
                <div className="doc-export-icon"><NavIcon name="print" /></div>
                <h4>Print Board</h4>
                <p>Opens the print dialog with the board rendered as an image. Print directly or save as PDF from your system.</p>
              </div>
            </div>

            <div className="doc-card">
              <h3 id="importing-boards" className="doc-card-title">Importing Boards</h3>
              <p>You can import previously exported JSON files to restore a board. Use the import option from the board menu or drag a JSON file onto the canvas. Import validates file size (max 25 MB) and shape count (max 10,000 shapes).</p>
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
            <h2 className="doc-section-title"><NavIcon name="lightbulb" /> Tips for a Better Experience</h2>
            <TipsIllustration />
            <div className="doc-tips-grid">
              <div className="doc-tip-card doc-tip-card--purple">
                <span className="doc-tip-number">01</span>
                <h4>Use Select Mode</h4>
                <p>Always switch back to Select mode to move, resize, and edit objects. It's the most-used tool.</p>
              </div>
              <div className="doc-tip-card doc-tip-card--blue">
                <span className="doc-tip-number">02</span>
                <h4>Zoom for Detail</h4>
                <p>Use zoom when working with small details or precise alignment. The scroll wheel is the fastest way.</p>
              </div>
              <div className="doc-tip-card doc-tip-card--coral">
                <span className="doc-tip-number">03</span>
                <h4>Pan to Navigate</h4>
                <p>Hold Space and drag to quickly navigate large boards without switching tools.</p>
              </div>
              <div className="doc-tip-card doc-tip-card--yellow">
                <span className="doc-tip-number">04</span>
                <h4>Export Your Work</h4>
                <p>Save your finished boards as PNG, PDF, or JSON. JSON lets you import and continue editing later.</p>
              </div>
              <div className="doc-tip-card doc-tip-card--pink">
                <span className="doc-tip-number">05</span>
                <h4>Experiment with Styles</h4>
                <p>Try different stroke colors, widths, and fill options to make your boards visually distinct.</p>
              </div>
              <div className="doc-tip-card doc-tip-card--green">
                <span className="doc-tip-number">06</span>
                <h4>Use Undo Freely</h4>
                <p>Don't worry about mistakes — Ctrl+Z supports up to 200 undo steps per session.</p>
              </div>
            </div>
          </section>

          <section id="faq" className="doc-section">
            <h2 className="doc-section-title"><NavIcon name="question" /> FAQ</h2>
            <FAQIllustration />
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
            <h2 className="doc-section-title"><NavIcon name="lightbulb" /> Play with Kanvas</h2>
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
                    <circle cx="220" cy="300" r="14" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="1.5" />
                    <text x="220" y="304" textAnchor="middle" fill="#7c3aed" fontSize="9" fontWeight="700" fontFamily="system-ui">+</text>
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
                    <circle cx="250" cy="88" r="20" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                    <path d="M242 88 L250 80 L258 88" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    <line x1="250" y1="88" x2="250" y2="100" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                    <rect x="280" y="78" width="80" height="6" rx="2" fill="var(--border)" />
                    <rect x="280" y="90" width="60" height="6" rx="2" fill="var(--surface-muted)" />
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
