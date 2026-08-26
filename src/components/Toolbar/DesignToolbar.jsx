import { memo, useEffect, useRef, useState } from 'react'
import { useAppState } from '../../context/AppStateContext'
import { useHistory } from '../../context/HistoryContext'
import { exportJSON, exportJPG, exportPDF, exportPNG, exportSVG, copyBoardAsImage, printBoard, importJSON } from '../../lib/io'
import { IMAGE_ACCEPT, readImageFile } from '../../lib/images'
import siteIcon from '../../assets/images/site-logo-removebg-preview.png'
import ShareModal from '../ShareModal/ShareModal'
import FeedbackModal from '../FeedbackModal/FeedbackModal'

/* Temporary Home destination: renders the 404 Not Found page until the real
   Home page exists. Replace this with the real Home page URL when built. */
const HOME_URL = '#/home'

/* Temporary Learn destination: renders the 404 Not Found page until the real
   Documentation page exists. Replace this with the real docs URL when built. */
const DOCS_URL = '#/docs'

/* Signed-in user (frontend only): editable in the Profile side panel and
   persisted locally so the header reflects the saved identity. */
const USER_EMAIL_FALLBACK = 'yourname@gmail.com'
const USER_NAME_FALLBACK = 'Your Name'
const PROFILE_IMAGE_KEY = 'diagram-board-profile-image'

/* Account side panels: opened from the profile dropdown instead of routing
   away from the board, so the canvas stays alive behind them. */
const ACCOUNT_PANELS = { profile: 'Profile', settings: 'Settings', appearance: 'Appearance', help: 'Help & Support' }
const DEFAULT_STROKES = ['#1e293b', '#dc4545', '#d4943a', '#eab308', '#45b05f', '#4585d1']
const DEFAULT_WIDTHS = [[1, 'Thin'], [2, 'Regular'], [4, 'Medium'], [8, 'Thick']]

const tools = [['select', 'cursor', 'Select', 'V'], ['pan', 'hand', 'Hand', 'H'], ['rectangle', 'square', 'Rectangle', 'R'], ['ellipse', 'circle', 'Ellipse', 'O'], ['diamond', 'diamond', 'Diamond', 'D'], ['arrow', 'arrow', 'Arrow', 'A'], ['line', 'line', 'Line', 'L'], ['pen', 'pen', 'Pencil', 'P'], ['laser', 'laser', 'Laser', 'K'], ['eraser', 'eraser', 'Eraser', 'E'], ['text', 'text', 'Text', 'T']]

function Icon({ name }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.85, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const icons = {
    cursor: <path d="m5 3 6 17 2-7 7-2L5 3Z" {...common} />, x: <path d="M6 6l12 12M18 6 6 18" {...common} />, hand: <><path d="M5 12h14M8 10V5a1.5 1.5 0 0 1 3 0v5V3.5a1.5 1.5 0 0 1 3 0V10V5a1.5 1.5 0 0 1 3 0v6" {...common} /><path d="M8 11 6.8 8.3a1.5 1.5 0 0 0-2.1 2.1l4.4 6a3.8 3.8 0 0 0 3.2 1.6h2.2a4 4 0 0 0 4-4V11" {...common} /></>,
    square: <rect x="4" y="4" width="16" height="16" rx="2" {...common} />, circle: <circle cx="12" cy="12" r="8" {...common} />, diamond: <path d="M12 3 21 12 12 21 3 12 12 3" {...common} />, arrow: <path d="M5 19 19 5M8 5h11v11" {...common} />, line: <path d="M5 19 19 5" {...common} />, pen: <><path d="m4 20 4-1 10-10-3-3L5 16l-1 4Z" {...common} /><path d="m13 8 3 3" {...common} /></>, laser: <><path d="M4 7V5h2M18 5h2v2M20 17v2h-2M6 19H4v-2M5 12h14" {...common} /></>,
    text: <><path d="M4 6V4h16v2M12 4v16M8 20h8" {...common} /></>, eraser: <path d="m7 19-3-3a2 2 0 0 1 0-3l7-7a2 2 0 0 1 3 0l5 5a2 2 0 0 1 0 3l-5 5H7Z" {...common} />, image: <><rect x="3" y="4" width="18" height="16" rx="2" {...common} /><circle cx="8" cy="9" r="1" {...common} /><path d="m21 15-5-5L5 20" {...common} /></>,
    undo: <path d="M9 7 4 12l5 5M4 12h10a5 5 0 0 1 5 5" {...common} />, redo: <path d="m15 7 5 5-5 5M20 12H10a5 5 0 0 0-5 5" {...common} />, upload: <><path d="M12 15V3M7 8l5-5 5 5M5 21h14" {...common} /></>, download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14" {...common} /></>, home: <><path d="m4 11 8-7 8 7" {...common} /><path d="M6.5 10.5V20h11v-9.5M10 20v-5h4v5" {...common} /></>, info: <><circle cx="12" cy="12" r="9" {...common} /><path d="M12 11v5M12 8h.01" strokeWidth="2.2" {...common} /></>, feedback: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...common} /></>, user: <><circle cx="12" cy="8" r="3" {...common} /><path d="M5 20a7 7 0 0 1 14 0" {...common} /></>, more: <path d="M12 5.5h.01M12 12h.01M12 18.5h.01" strokeWidth="3.2" {...common} />, menu: <path d="M4 7h16M4 12h16M4 17h16" {...common} />,     chevron: <path d="m9 18 6-6-6-6" {...common} />, 'chevron-left': <path d="m15 18-6-6 6-6" {...common} />, dropdown: <path d="m7 9 5 5 5-5Z" fill="currentColor" stroke="none" />, camera: <><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" {...common} /><circle cx="12" cy="13" r="3.5" {...common} /></>, file: <><path d="M13 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8l-5-5Z" {...common} /><path d="M13 3v5h5" {...common} /></>, code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M13 5l-2 14" {...common} /></>, print: <><path d="M6 9V4h12v5M6 18H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1M6 14h12v6H6v-6Z" {...common} /></>, copy: <><rect x="9" y="9" width="11" height="11" rx="2" {...common} /><path d="M5 15V5a2 2 0 0 1 2-2h10" {...common} /></>, folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" {...common} />, trash: <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13M10 11v6M14 11v6" {...common} /></>, moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" {...common} />, sun: <><circle cx="12" cy="12" r="4" {...common} /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l-1.41 1.41M17.66 6.34l1.41-1.41" {...common} /></>, settings: <><circle cx="12" cy="12" r="3" {...common} /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" {...common} /></>, logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...common} /><path d="m16 17 5-5-5-5" {...common} /><path d="M21 12H9" {...common} /></>,

  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>
}

function DesignToolbar({ stageRef, onImageUpload, imageInputRef, view, onZoomReset, lastSavedAt, onDuplicateBoard, onDeleteBoard }) {

  const { state, dispatch } = useAppState()
  const { shapes, commit, undo, redo, revision } = useHistory()
  const [darkMode, setDarkMode] = useState(() => { try { return localStorage.getItem('diagram-board-theme') === 'dark' } catch { return false } })

const [sidebarOpen, setSidebarOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [boardMenuOpen, setBoardMenuOpen] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [accountPanel, setAccountPanel] = useState(null)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [userName, setUserName] = useState(() => { try { return localStorage.getItem('diagram-board-user-name') || USER_NAME_FALLBACK } catch { return USER_NAME_FALLBACK } })
  const [userEmail, setUserEmail] = useState(() => { try { return localStorage.getItem('diagram-board-user-email') || USER_EMAIL_FALLBACK } catch { return USER_EMAIL_FALLBACK } })
  const [profileImage, setProfileImage] = useState(() => { try { return localStorage.getItem(PROFILE_IMAGE_KEY) || '' } catch { return '' } })
  const [profileImageError, setProfileImageError] = useState('')
  const [profileSaved, setProfileSaved] = useState(false)
  const profileNameRef = useRef(null)
  const profileEmailRef = useRef(null)
  const profileImageInputRef = useRef(null)
  const accountPanelRef = useRef(null)
  const [folderName, setFolderName] = useState(() => { try { return localStorage.getItem('diagram-board-folder') || '' } catch { return '' } })
  const [, setClockTick] = useState(0)
  const menuRef = useRef(null)
  const boardMenuRef = useRef(null)
  const logoRef = useRef(null)
  const exportMenuRef = useRef(null)
  const themeDefaultStrokeRef = useRef('#1e293b')
  const inputRef = useRef(null)
  const localImageInputRef = useRef(null)
  const nameRef = useRef(null)
  const nameDraftRef = useRef(state.fileName)
  const revisionRef = useRef(revision)
  const importToken = useRef(0)
  const imageInput = imageInputRef || localImageInputRef

  useEffect(() => { document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'; try { localStorage.setItem('diagram-board-theme', darkMode ? 'dark' : 'light') } catch { } }, [darkMode])
  useEffect(() => { const nextStroke = darkMode ? '#e2e8f0' : '#1e293b'; if (!state.selectedShapeIds.length && state.activeStyle.stroke === themeDefaultStrokeRef.current) dispatch({ type: 'SET_STYLE', style: { stroke: nextStroke } }); themeDefaultStrokeRef.current = nextStroke }, [darkMode, state.selectedShapeIds.length, state.activeStyle.stroke, dispatch])
  useEffect(() => { revisionRef.current = revision }, [revision])
  useEffect(() => { document.title = `${state.fileName} - Diagram board` }, [state.fileName])
  useEffect(() => { const close = event => { if (!menuRef.current?.contains(event.target)) { setMenuOpen(false); setAccountMenuOpen(false) } if (!boardMenuRef.current?.contains(event.target)) { setBoardMenuOpen(false); setDetailsOpen(false) } if (!exportMenuRef.current?.contains(event.target)) setExportMenuOpen(false) }; if (menuOpen || boardMenuOpen || detailsOpen || exportMenuOpen || accountMenuOpen) window.addEventListener('pointerdown', close); return () => window.removeEventListener('pointerdown', close) }, [menuOpen, boardMenuOpen, detailsOpen, exportMenuOpen, accountMenuOpen])
  useEffect(() => { if (!(menuOpen || boardMenuOpen || detailsOpen || exportMenuOpen || accountMenuOpen)) return; const onKey = event => { if (event.key === 'Escape') { setMenuOpen(false); setBoardMenuOpen(false); setDetailsOpen(false); setExportMenuOpen(false); setAccountMenuOpen(false) } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [menuOpen, boardMenuOpen, detailsOpen, exportMenuOpen, accountMenuOpen])
  useEffect(() => { if (!logoutOpen) return; const onKey = event => { if (event.key === 'Escape') setLogoutOpen(false) }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [logoutOpen])
  useEffect(() => { if (!feedbackOpen) return; const onKey = event => { if (event.key === 'Escape') setFeedbackOpen(false) }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [feedbackOpen])
  useEffect(() => { if (!accountPanel) return; const close = event => { if (!accountPanelRef.current?.contains(event.target)) setAccountPanel(null) }; const onKey = event => { if (event.key === 'Escape') setAccountPanel(null) }; window.addEventListener('pointerdown', close); window.addEventListener('keydown', onKey); return () => { window.removeEventListener('pointerdown', close); window.removeEventListener('keydown', onKey) } }, [accountPanel])
  useEffect(() => { const id = window.setInterval(() => setClockTick(Date.now()), 30000); return () => window.clearInterval(id) }, [])
  useEffect(() => {
    const updateToolbarPosition = () => {
      const logo = logoRef.current
      const toolbar = document.querySelector('.left-toolbar')
      if (!logo || !toolbar) return
      const logoRect = logo.getBoundingClientRect()
      const toolbarWidth = toolbar.getBoundingClientRect().width || 54
      document.documentElement.style.setProperty('--logo-toolbar-left', `${logoRect.left + (logoRect.width / 2) - (toolbarWidth / 2)}px`)
      document.documentElement.style.setProperty('--logo-toolbar-top', `${logoRect.bottom + 20}px`)
    }
    updateToolbarPosition()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateToolbarPosition) : null
    const logo = logoRef.current
    const toolbar = document.querySelector('.left-toolbar')
    if (observer) { if (logo) observer.observe(logo); if (toolbar) observer.observe(toolbar) }
    if (logo) logo.addEventListener('load', updateToolbarPosition)
    window.addEventListener('resize', updateToolbarPosition)
    return () => { observer?.disconnect(); logo?.removeEventListener('load', updateToolbarPosition); window.removeEventListener('resize', updateToolbarPosition) }
  }, [sidebarOpen])
  useEffect(() => { if (nameRef.current && document.activeElement !== nameRef.current) nameRef.current.value = state.fileName }, [state.fileName])

  const importDiagram = async event => { const token = ++importToken.current; const baseline = revisionRef.current; try { const imported = await importJSON(event.target.files?.[0]); if (token === importToken.current && revisionRef.current === baseline) commit(() => imported) } catch (error) { if (token === importToken.current) window.alert(error.message) } finally { event.target.value = '' } }
  const importImage = async event => { try { const file = event.target.files?.[0]; if (file) await onImageUpload(file) } catch (error) { window.alert(error.message) } finally { event.target.value = '' } }
  const toolsFor = items => items.map(([tool, icon, label, shortcut]) => <button key={tool} className={state.activeTool === tool ? 'active' : ''} title={`${label} (${shortcut})`} aria-label={`${label} (${shortcut})`} onClick={() => dispatch({ type: 'SET_TOOL', tool })}><Icon name={icon} /><span className="tool-label">{label}</span></button>)

  const action = (icon, title, onClick) => <button title={title} aria-label={title} onClick={onClick}><Icon name={icon} /></button>
  const menuAction = (icon, label, onClick) => <button role="menuitem" onClick={() => { onClick(); setMenuOpen(false) }}><Icon name={icon} /><span>{label}</span></button>
  const openAccountPanel = key => { setAccountMenuOpen(false); setAccountPanel(key) }
  const closeAccountPanel = () => setAccountPanel(null)
  const backToAccountMenu = () => { setAccountPanel(null); setAccountMenuOpen(true) }
  const saveProfile = () => {
    const name = profileNameRef.current?.value.trim()
    const email = profileEmailRef.current?.value.trim()
    const nextName = name || USER_NAME_FALLBACK
    const nextEmail = email || USER_EMAIL_FALLBACK
    setUserName(nextName); setUserEmail(nextEmail); setProfileSaved(true)
    try { localStorage.setItem('diagram-board-user-name', nextName); localStorage.setItem('diagram-board-user-email', nextEmail) } catch { }
    window.setTimeout(() => setProfileSaved(false), 1800)
  }
  const handleProfileImage = async event => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const image = await readImageFile(file)
      setProfileImage(image.src)
      setProfileImageError('')
      try { localStorage.setItem(PROFILE_IMAGE_KEY, image.src) } catch { }
      setProfileSaved(true)
      window.setTimeout(() => setProfileSaved(false), 1800)
    } catch (error) {
      setProfileImageError(error.message || 'Unable to use that image.')
    } finally {
      event.target.value = ''
    }
  }
  const removeProfileImage = () => {
    setProfileImage('')
    setProfileImageError('')
    try { localStorage.removeItem(PROFILE_IMAGE_KEY) } catch { }
  }

  const saveName = () => { const value = nameRef.current?.value.trim(); if (value && value !== state.fileName) dispatch({ type: 'SET_FILENAME', fileName: value }); else if (nameRef.current) nameRef.current.value = state.fileName; nameDraftRef.current = value || state.fileName }
  const cancelName = () => { if (nameRef.current) { nameRef.current.value = nameDraftRef.current || state.fileName; nameRef.current.blur() } }
  const beginNameEdit = () => { nameDraftRef.current = nameRef.current?.value || state.fileName }
  const finishNameKey = event => { if (event.key === 'Enter') { event.preventDefault(); saveName(); event.currentTarget.blur() } else if (event.key === 'Escape') { event.preventDefault(); cancelName() } }
  const setTheme = value => { setDarkMode(value); setMenuOpen(false) }
  const relativeSavedTime = value => { if (!value) return 'just now'; const seconds = Math.max(0, Math.floor((Date.now() - value) / 1000)); if (seconds < 60) return 'just now'; const minutes = Math.floor(seconds / 60); if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`; const hours = Math.floor(minutes / 60); return `${hours} hour${hours === 1 ? '' : 's'} ago` }
  const renameBoard = () => { setBoardMenuOpen(false); nameRef.current?.focus(); nameRef.current?.select() }
  const doExport = run => { run(); setExportMenuOpen(false) }
  const moveToFolder = () => { const next = window.prompt('Folder name', folderName); if (next === null) return; const clean = next.trim(); setFolderName(clean); try { if (clean) localStorage.setItem('diagram-board-folder', clean); else localStorage.removeItem('diagram-board-folder') } catch {} setBoardMenuOpen(false) }
  const showDetails = () => { setBoardMenuOpen(false); setDetailsOpen(true) }
  const closeDetails = () => { setDetailsOpen(false); setBoardMenuOpen(false) }

  return <>
    <nav className="top-toolbar" aria-label="Document actions">
      <div className="top-toolbar-left">
        <div className="board-identity" ref={boardMenuRef}><span className="board-label"><img ref={logoRef} className="board-mark" src={siteIcon} alt="Board icon" /><span className="board-name-stack"><input ref={nameRef} className="board-name-input" aria-label="Board name" defaultValue={state.fileName} onFocus={beginNameEdit} onBlur={saveName} onKeyDown={finishNameKey} /><span className="last-saved">Last saved: {relativeSavedTime(lastSavedAt)}</span><button className="board-dropdown" title="Board options" aria-label="Board options" aria-expanded={boardMenuOpen} onClick={() => setBoardMenuOpen(value => !value)}><Icon name="dropdown" /></button>{boardMenuOpen && <div className="board-management-menu" role="menu" aria-label="Board management"><button role="menuitem" onClick={renameBoard}><Icon name="pen" /><span>Rename</span></button><button role="menuitem" onClick={() => { onDuplicateBoard?.(); setBoardMenuOpen(false) }}><Icon name="copy" /><span>Duplicate</span></button><button role="menuitem" onClick={moveToFolder}><Icon name="folder" /><span>Move to folder</span></button><button role="menuitem" onClick={showDetails}><Icon name="info" /><span>Board details</span></button><button className="danger" role="menuitem" onClick={() => { onDeleteBoard?.(); setBoardMenuOpen(false) }}><Icon name="trash" /><span>Move to trash</span></button></div>}{detailsOpen && <div className="board-details-popover" role="dialog" aria-label="Board details"><strong>Board details</strong><span>{shapes.length} object{shapes.length === 1 ? '' : 's'}</span><span>{folderName ? `Folder: ${folderName}` : 'Folder: none'}</span><span>Last saved: {relativeSavedTime(lastSavedAt)}</span><button onClick={closeDetails}>Close</button></div>}</span></span></div>
        <div className="header-export-wrap" ref={exportMenuRef}><button className="header-export" title="Export board" aria-label="Export board" aria-haspopup="menu" aria-expanded={exportMenuOpen} onClick={() => setExportMenuOpen(value => !value)}><Icon name="download" /><span>Export board</span><Icon name="dropdown" /></button>{exportMenuOpen && <div className="export-menu" role="menu" aria-label="Export options"><button role="menuitem" onClick={() => doExport(() => exportPNG(stageRef.current, state.fileName))}><Icon name="image" /><span>Download PNG</span></button><button role="menuitem" onClick={() => doExport(() => exportJPG(stageRef.current, state.fileName))}><Icon name="camera" /><span>Download JPG</span></button><button role="menuitem" onClick={() => doExport(() => exportPDF(stageRef.current, state.fileName))}><Icon name="file" /><span>Download PDF</span></button><span className="menu-separator" role="separator" /><button role="menuitem" onClick={() => doExport(() => exportSVG(shapes, state.fileName))}><Icon name="pen" /><span>Export SVG</span></button><button role="menuitem" onClick={() => doExport(() => exportJSON(shapes, state.fileName))}><Icon name="code" /><span>Export JSON</span></button><span className="menu-separator" role="separator" /><button role="menuitem" onClick={() => doExport(() => { copyBoardAsImage(stageRef.current).then(ok => { if (!ok) window.alert('Image copy is not supported in this browser. Use Download PNG instead.') }) })}><Icon name="copy" /><span>Copy Image</span></button><button role="menuitem" onClick={() => doExport(() => printBoard(stageRef.current, state.fileName))}><Icon name="print" /><span>Print Board</span></button></div>}</div>
        <button type="button" className="header-invite" title="Invite collaborators" aria-label="Invite collaborators" onClick={() => setInviteOpen(true)}><Icon name="user" /><span>Invite</span></button>
      </div>
      <div className="top-toolbar-center" aria-hidden="true"></div>
      <div className="top-toolbar-right">
        <button type="button" className="header-home" title="Home" aria-label="Home" onClick={() => { window.location.href = HOME_URL }}><Icon name="home" /></button>
        <button type="button" className="header-learn" title="Learn more" aria-label="Learn more" onClick={() => { window.location.href = DOCS_URL }}><Icon name="info" /><span>Learn more</span></button>
        <div className="overflow-menu-wrap" ref={menuRef}><button type="button" className="account-button" title="Account menu" aria-label="Account menu" aria-haspopup="menu" aria-expanded={accountMenuOpen} onClick={() => setAccountMenuOpen(value => !value)}><span className="account-avatar">{profileImage ? <img src={profileImage} alt="Profile" onError={() => setProfileImage('')} /> : (userName.trim().charAt(0).toUpperCase() || '?')}</span><span>{userName}</span><Icon name="chevron" /></button>{accountMenuOpen && <div className="overflow-menu account-menu" role="menu" aria-label="Account"><span className="account-menu-head"><span className="account-menu-avatar">{profileImage ? <img src={profileImage} alt="Profile" onError={() => setProfileImage('')} /> : (userName.trim().charAt(0).toUpperCase() || '?')}</span><span className="account-menu-user"><strong>{userName}</strong><span>{userEmail}</span></span></span><button role="menuitem" onClick={() => openAccountPanel('profile')}><Icon name="user" /><span>Profile</span></button><button role="menuitem" onClick={() => openAccountPanel('settings')}><Icon name="settings" /><span>Settings</span></button><button role="menuitem" onClick={() => openAccountPanel('appearance')}><Icon name="sun" /><span>Appearance</span></button><button role="menuitem" onClick={() => openAccountPanel('help')}><Icon name="info" /><span>Help & Support</span></button><span className="menu-separator" role="separator" /><button className="danger" role="menuitem" onClick={() => { setAccountMenuOpen(false); setLogoutOpen(true) }}><Icon name="logout" /><span>Log out</span></button></div>}{menuOpen && <div className="overflow-menu" role="menu" aria-label="Board actions"><span className="menu-label">Board actions</span>{menuAction('undo', 'Undo', undo)}{menuAction('redo', 'Redo', redo)}{menuAction('upload', 'Import diagram', () => inputRef.current?.click())}{menuAction('download', 'Export JSON', () => exportJSON(shapes, state.fileName))}{menuAction('download', 'Export SVG', () => exportSVG(shapes, state.fileName))}{menuAction('download', 'Export PNG', () => exportPNG(stageRef.current, state.fileName))}<span className="menu-label">Appearance</span><button className={!darkMode ? 'selected' : ''} role="menuitemradio" aria-checked={!darkMode} onClick={() => setTheme(false)}><Icon name="sun" /><span>Light mode</span></button><button className={darkMode ? 'selected' : ''} role="menuitemradio" aria-checked={darkMode} onClick={() => setTheme(true)}><Icon name="moon" /><span>Dark mode</span></button></div>}</div>
        <input ref={inputRef} type="file" accept="application/json" hidden onChange={importDiagram} />
      </div>
    </nav>
    <nav className={`left-toolbar ${sidebarOpen ? 'is-open' : 'is-collapsed'}`} aria-label="Drawing tools">{toolsFor(tools.slice(0, 2))}<span className="tool-divider" />{toolsFor(tools.slice(2, 7))}<span className="tool-divider" />{toolsFor(tools.slice(7))}<span className="tool-divider" /><button title="Insert image" aria-label="Insert image" onClick={() => imageInput.current?.click()}><Icon name="image" /><span className="tool-label">Image</span></button><button className="toolbar-collapse-btn" title="Collapse toolbar" aria-label="Collapse toolbar" onClick={() => setSidebarOpen(false)}><Icon name="chevron" /></button><input ref={imageInput} type="file" accept={IMAGE_ACCEPT} hidden onChange={importImage} /></nav>
    {!sidebarOpen && <button className="toolbar-expand-btn" title="Open tools" aria-label="Open tools" onClick={() => setSidebarOpen(true)}><Icon name="chevron" /></button>}
    {accountPanel && <aside className="side-panel" ref={accountPanelRef} role="dialog" aria-label={ACCOUNT_PANELS[accountPanel]}>
      <header className="side-panel-head">
        <button type="button" className="side-panel-back" title="Back to account menu" aria-label="Back to account menu" onClick={backToAccountMenu}><Icon name="chevron-left" /></button>
        <strong>{ACCOUNT_PANELS[accountPanel]}</strong>
      </header>
      <div className="side-panel-body">
        {accountPanel === 'profile' && <>
          <div className="side-panel-profile-card">
            <div className="side-panel-avatar-wrap">
              <span className="side-panel-avatar">{profileImage ? <img src={profileImage} alt="Profile" onError={() => setProfileImage('')} /> : (userName.trim().charAt(0).toUpperCase() || '?')}</span>
              <button type="button" className="side-avatar-upload" title="Change profile picture" aria-label="Change profile picture" onClick={() => profileImageInputRef.current?.click()}><Icon name="image" /></button>
              {profileImage && <button type="button" className="side-avatar-delete" title="Remove profile picture" aria-label="Remove profile picture" onClick={removeProfileImage}><Icon name="trash" /></button>}
              <input ref={profileImageInputRef} className="profile-image-input" type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={handleProfileImage} />
            </div>
            <span className="side-panel-profile-meta"><strong>{userName}</strong><span>{userEmail}</span></span>
          </div>
          {profileImageError && <span className="side-avatar-error" role="alert">{profileImageError}</span>}
          <label className="side-field"><span>Display name</span><input ref={profileNameRef} defaultValue={userName} maxLength={48} placeholder="Your name" /></label>
          <label className="side-field"><span>Email</span><input ref={profileEmailRef} defaultValue={userEmail} type="email" placeholder="you@example.com" /></label>
          <div className="side-panel-actions">
            <button type="button" className="side-save" onClick={saveProfile}>Save changes</button>
            <span className={`side-saved-note${profileSaved ? ' visible' : ''}`}>Saved</span>
          </div>
        </>}
        {accountPanel === 'settings' && <>
          <p className="side-section-label">Canvas defaults</p>
          <p className="side-hint">Applied to shapes you draw next.</p>
          <p className="side-sub">Stroke color</p>
          <div className="side-swatches">{DEFAULT_STROKES.map(color => <button key={color} type="button" className={`swatch${state.activeStyle.stroke === color ? ' is-selected' : ''}`} style={{ background: color }} title={color} aria-label={`Default stroke ${color}`} onClick={() => dispatch({ type: 'SET_STYLE', style: { stroke: color } })} />)}</div>
          <p className="side-sub">Stroke width</p>
          <div className="side-widths">{DEFAULT_WIDTHS.map(([value, label]) => <button key={value} type="button" className={state.activeStyle.strokeWidth === value ? 'is-selected' : ''} onClick={() => dispatch({ type: 'SET_STYLE', style: { strokeWidth: value } })}><i data-width={value} /><span>{label}</span></button>)}</div>
        </>}
        {accountPanel === 'appearance' && <>
          <p className="side-section-label">Theme</p>
          <div className="side-theme-row">
            <button type="button" role="radio" aria-checked={!darkMode} className={!darkMode ? 'is-selected' : ''} onClick={() => setDarkMode(false)}><span className="side-theme-chip"><Icon name="sun" /></span><span>Light</span></button>
            <button type="button" role="radio" aria-checked={darkMode} className={darkMode ? 'is-selected' : ''} onClick={() => setDarkMode(true)}><span className="side-theme-chip"><Icon name="moon" /></span><span>Dark</span></button>
          </div>
          <p className="side-hint side-theme-hint">The canvas, toolbars, and panels all follow this theme instantly.</p>
        </>}
        {accountPanel === 'help' && <>
          <p className="side-section-label">Resources</p>
          <div className="side-links">
            <a href={DOCS_URL} onClick={closeAccountPanel}><Icon name="file" /><span>Documentation</span><Icon name="chevron" /></a>
            <a href={HOME_URL} onClick={closeAccountPanel}><Icon name="home" /><span>Home</span><Icon name="chevron" /></a>
            <a href="mailto:support@example.com?subject=Board%20feedback"><Icon name="info" /><span>Contact support</span><Icon name="chevron" /></a>
            <button type="button" onClick={() => { setFeedbackOpen(true); closeAccountPanel() }}><Icon name="feedback" /><span>Send Feedback</span><Icon name="chevron" /></button>
          </div>
          <p className="side-section-label">Keyboard shortcuts</p>
          <div className="side-shortcuts">{tools.map(([tool, , label, shortcut]) => <span key={tool} className="side-shortcut"><kbd>{shortcut}</kbd>{label}</span>)}</div>
        </>}
      </div>
    </aside>}
    {inviteOpen && <ShareModal fileName={state.fileName} onClose={() => setInviteOpen(false)} />}
    {logoutOpen && <div className="logout-dialog-backdrop" onPointerDown={() => setLogoutOpen(false)}><div className="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title" onPointerDown={event => event.stopPropagation()}><span className="logout-dialog-icon"><Icon name="logout" /></span><h2 id="logout-title">Log out?</h2><p>You're about to log out. You can sign back in anytime to access your boards and settings.</p><div className="logout-dialog-actions"><button type="button" className="logout-cancel" onClick={() => setLogoutOpen(false)}>Cancel</button><button type="button" className="logout-confirm" onClick={() => setLogoutOpen(false)}>Log out</button></div></div></div>}
    {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
  </>

}

export default memo(DesignToolbar)
