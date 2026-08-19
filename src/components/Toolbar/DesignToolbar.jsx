import { memo, useEffect, useRef, useState } from 'react'
import { useAppState } from '../../context/AppStateContext'
import { useHistory } from '../../context/HistoryContext'
import { exportJSON, exportPNG, exportSVG, importJSON } from '../../lib/io'
import { IMAGE_ACCEPT } from '../../lib/images'
import siteIcon from '../../assets/images/site_icon.png'

const tools = [['select', 'cursor', 'Select', 'V'], ['pan', 'hand', 'Hand', 'H'], ['rectangle', 'square', 'Rectangle', 'R'], ['ellipse', 'circle', 'Ellipse', 'O'], ['diamond', 'diamond', 'Diamond', 'D'], ['arrow', 'arrow', 'Arrow', 'A'], ['line', 'line', 'Line', 'L'], ['pen', 'pen', 'Pencil', 'P'], ['laser', 'laser', 'Laser', 'K'], ['eraser', 'eraser', 'Eraser', 'E'], ['text', 'text', 'Text', 'T']]

function Icon({ name }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.85, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const icons = {
    cursor: <path d="m5 3 6 17 2-7 7-2L5 3Z" {...common}/>, hand: <><path d="M5 12h14M8 10V5a1.5 1.5 0 0 1 3 0v5V3.5a1.5 1.5 0 0 1 3 0V10V5a1.5 1.5 0 0 1 3 0v6" {...common}/><path d="M8 11 6.8 8.3a1.5 1.5 0 0 0-2.1 2.1l4.4 6a3.8 3.8 0 0 0 3.2 1.6h2.2a4 4 0 0 0 4-4V11" {...common}/></>,
    square: <rect x="4" y="4" width="16" height="16" rx="2" {...common}/>, circle: <circle cx="12" cy="12" r="8" {...common}/>, diamond: <path d="M12 3 21 12 12 21 3 12 12 3" {...common}/>, arrow: <path d="M5 19 19 5M8 5h11v11" {...common}/>, line: <path d="M5 19 19 5" {...common}/>, pen: <><path d="m4 20 4-1 10-10-3-3L5 16l-1 4Z" {...common}/><path d="m13 8 3 3" {...common}/></>, laser: <><path d="M4 7V5h2M18 5h2v2M20 17v2h-2M6 19H4v-2M5 12h14" {...common}/></>,
    text: <><path d="M4 6V4h16v2M12 4v16M8 20h8" {...common}/></>, eraser: <path d="m7 19-3-3a2 2 0 0 1 0-3l7-7a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-5 5H7Z" {...common}/>, image: <><rect x="3" y="4" width="18" height="16" rx="2" {...common}/><circle cx="8" cy="9" r="1" {...common}/><path d="m21 15-5-5L5 20" {...common}/></>,
    undo: <path d="M9 7 4 12l5 5M4 12h10a5 5 0 0 1 5 5" {...common}/>, redo: <path d="m15 7 5 5-5 5M20 12H10a5 5 0 0 0-5 5" {...common}/>, upload: <><path d="M12 15V3M7 8l5-5 5 5M5 21h14" {...common}/></>, download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14" {...common}/></>, more: <path d="M12 5.5h.01M12 12h.01M12 18.5h.01" strokeWidth="3.2" {...common}/>, menu: <path d="M4 7h16M4 12h16M4 17h16" {...common}/>, chevron: <path d="m9 18 6-6-6-6" {...common}/>, moon: <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" {...common}/>, sun: <><circle cx="12" cy="12" r="4" {...common}/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" {...common}/></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>
}

function DesignToolbar({ stageRef, onImageUpload, imageInputRef, view, onZoomReset }) {

  const { state, dispatch } = useAppState()
  const { shapes, commit, undo, redo, revision } = useHistory()
    const [darkMode, setDarkMode] = useState(() => { try { return localStorage.getItem('diagram-board-theme') !== 'light' } catch { return true } })

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const themeDefaultStrokeRef = useRef('#1e293b')
  const inputRef = useRef(null)
  const localImageInputRef = useRef(null)
  const nameRef = useRef(null)
  const revisionRef = useRef(revision)
  const importToken = useRef(0)
  const imageInput = imageInputRef || localImageInputRef

  useEffect(() => { document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'; try { localStorage.setItem('diagram-board-theme', darkMode ? 'dark' : 'light') } catch {} }, [darkMode])
  useEffect(() => { const nextStroke = darkMode ? '#e2e8f0' : '#1e293b'; if (!state.selectedShapeIds.length && state.activeStyle.stroke === themeDefaultStrokeRef.current) dispatch({ type: 'SET_STYLE', style: { stroke: nextStroke } }); themeDefaultStrokeRef.current = nextStroke }, [darkMode, state.selectedShapeIds.length, state.activeStyle.stroke, dispatch])
  useEffect(() => { revisionRef.current = revision }, [revision])
  useEffect(() => { document.title = `${state.fileName} - Diagram board` }, [state.fileName])
  useEffect(() => { const close = event => { if (!menuRef.current?.contains(event.target)) setMenuOpen(false) }; if (menuOpen) window.addEventListener('pointerdown', close); return () => window.removeEventListener('pointerdown', close) }, [menuOpen])

  const importDiagram = async event => { const token = ++importToken.current; const baseline = revisionRef.current; try { const imported = await importJSON(event.target.files?.[0]); if (token === importToken.current && revisionRef.current === baseline) commit(() => imported) } catch (error) { if (token === importToken.current) window.alert(error.message) } finally { event.target.value = '' } }
  const importImage = async event => { try { const file = event.target.files?.[0]; if (file) await onImageUpload(file) } catch (error) { window.alert(error.message) } finally { event.target.value = '' } }
    const toolsFor = items => items.map(([tool, icon, label, shortcut]) => <button key={tool} className={state.activeTool === tool ? 'active' : ''} title={`${label} (${shortcut})`} aria-label={`${label} (${shortcut})`} onClick={() => dispatch({ type: 'SET_TOOL', tool })}><Icon name={icon}/><span className="tool-label">{label}</span></button>)

  const action = (icon, title, onClick) => <button title={title} aria-label={title} onClick={onClick}><Icon name={icon}/></button>
  const saveName = () => { const value = nameRef.current.value.trim(); if (value && value !== state.fileName) dispatch({ type: 'SET_FILENAME', fileName: value }); else nameRef.current.value = state.fileName }
  const setTheme = value => { setDarkMode(value); setMenuOpen(false) }

    return <>
    <nav className="top-toolbar" aria-label="Document actions">
      <div className="top-toolbar-left">
        <button className={`sidebar-toggle ${sidebarOpen ? 'is-open' : ''}`} title={sidebarOpen ? 'Collapse tools' : 'Open tools'} aria-label={sidebarOpen ? 'Collapse tools' : 'Open tools'} onClick={() => setSidebarOpen(value => !value)}><Icon name={sidebarOpen ? 'chevron' : 'menu'}/></button>
        <span className="board-label"><img className="board-mark" src={siteIcon} alt="Board icon"/><input ref={nameRef} className="board-name-input" aria-label="Board name" defaultValue={state.fileName} onBlur={saveName} onKeyDown={event => { if (event.key === 'Enter') event.currentTarget.blur() }}/></span>
      </div>
      <div className="top-toolbar-center">
        <div className="history-actions">{action('undo', 'Undo (Ctrl+Z)', undo)}{action('redo', 'Redo (Ctrl+Shift+Z)', redo)}</div>
        <span className="divider"/>
        <button className="zoom-display" title="Reset zoom" aria-label="Reset zoom" onClick={onZoomReset}><span>{Math.round((view?.scale || 1) * 100)}%</span><Icon name="chevron"/></button>
        <span className="divider"/>
        <div className="file-actions">{action('upload', 'Import diagram', () => inputRef.current?.click())}{action('download', 'Export JSON', () => exportJSON(shapes, state.fileName))}{action('download', 'Export SVG', () => exportSVG(shapes, state.fileName))}{action('image', 'Export PNG', () => exportPNG(stageRef.current, state.fileName))}</div>
        <input ref={inputRef} type="file" accept="application/json" hidden onChange={importDiagram}/>
      </div>
      <div className="top-toolbar-right">
        <button className="theme-toggle" title={darkMode ? 'Light mode' : 'Dark mode'} aria-label={darkMode ? 'Light mode' : 'Dark mode'} onClick={() => setDarkMode(value => !value)}><Icon name={darkMode ? 'moon' : 'sun'}/></button>
        <div className="overflow-menu-wrap" ref={menuRef}><button className="overflow-trigger" title="More options" aria-label="More options" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}><Icon name="more"/></button>{menuOpen && <div className="overflow-menu" role="menu" aria-label="Board options"><span className="menu-label">Appearance</span><button className={!darkMode ? 'selected' : ''} role="menuitemradio" aria-checked={!darkMode} onClick={() => setTheme(false)}><Icon name="sun"/><span>Light mode</span></button><button className={darkMode ? 'selected' : ''} role="menuitemradio" aria-checked={darkMode} onClick={() => setTheme(true)}><Icon name="moon"/><span>Dark mode</span></button></div>}</div>
      </div>
    </nav>
    <nav className={`left-toolbar ${sidebarOpen ? 'is-open' : 'is-collapsed'}`} aria-label="Drawing tools">{toolsFor(tools.slice(0, 2))}<span className="tool-divider"/>{toolsFor(tools.slice(2, 7))}<span className="tool-divider"/>{toolsFor(tools.slice(7))}<span className="tool-divider"/><button title="Insert image" aria-label="Insert image" onClick={() => imageInput.current?.click()}><Icon name="image"/><span className="tool-label">Image</span></button><button className="more-tool" title="More options" aria-label="More options" onClick={() => setMenuOpen(value => !value)}><Icon name="more"/><span className="tool-label">More</span></button><input ref={imageInput} type="file" accept={IMAGE_ACCEPT} hidden onChange={importImage}/></nav>
  </>

}

export default memo(DesignToolbar)
