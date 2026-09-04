import { useCallback, useEffect, useRef, useState } from 'react'
import { AppStateProvider, useAppState } from './context/AppStateContext'
import { HistoryProvider, useHistory } from './context/HistoryContext'
import CanvasStage from './components/Canvas/CanvasStage'
import Toolbar from './components/Toolbar/DesignToolbar'
import StylePanel from './components/StylePanel/StylePanel'
import ZoomControls, { fitViewToContent } from './components/ZoomControls/ZoomControls'
import SplashScreen from './components/SplashScreen/SplashScreen'
import PreviousBoardModal from './components/PreviousBoardModal/PreviousBoardModal'
import NotFoundPage from './components/NotFoundPage/NotFoundPage'
import ThankYouPage from './components/ThankYouPage/ThankYouPage'
import WaitlistPage from './components/WaitlistPage/WaitlistPage'
import DocumentationPage from './components/DocumentationPage/DocumentationPage'
import './components/DocumentationPage/DocumentationPage.css'
import LandingPage from './components/LandingPage/LandingPage'
import CookieConsent from './components/CookieConsent/CookieConsent'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { usePreviousBoard } from './hooks/useVisitorStatus'
import { usePageRefresh } from './hooks/usePageRefresh'
import { ThemeProvider } from './context/ThemeContext'
import { newId } from './lib/idGenerator'
import { INITIAL_IMAGE_WIDTH, readImageFile } from './lib/images'
import { activateBoard, createBoard, loadDiagram, saveDiagram, moveDiagramToTrash } from './lib/storage'
import { sanitizeShape, updateBoundArrows } from './lib/geometry'
import { clampScale, zoomAtPoint } from './lib/viewport'

const resolveRoute = () => {
  const hash = window.location.hash
  if (hash === '#/board') return 'board'
  if (hash === '#/docs') return 'docs'
  if (hash === '#/thank-you') return 'thankyou'
  if (hash === '#/waitlist') return 'waitlist'
  if (hash === '#/' || hash === '') return 'landing'
  if (hash.startsWith('#/')) return 'notfound'
  return 'landing'
}

const SPLASH_MIN_MS = 5000

function Workspace({ splashDone, active = true, onStartupReady, beginProcessing, finishProcessing, showUserMessage }) {
  const stageRef = useRef()
  const imageInputRef = useRef()
  const clipboard = useRef([])
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 })
  const { state, dispatch } = useAppState()
  const { shapes, commit, replace, undo, redo } = useHistory()

  useEffect(() => {
    if (active) onStartupReady?.()
  }, [active, onStartupReady])

  const remove = useCallback(() => {
    if (!state.selectedShapeIds.length) return
    const selected = new Set(state.selectedShapeIds)
    const removable = new Set(shapes.filter(shape => selected.has(shape.id) && !shape.locked).map(shape => shape.id))
    if (!removable.size) return
    commit(prev => updateBoundArrows(prev.filter(shape => !removable.has(shape.id))))
    dispatch({ type: 'SET_SELECTION', ids: state.selectedShapeIds.filter(id => !removable.has(id)) })
  }, [shapes, state.selectedShapeIds, commit, dispatch])

  const nudge = useCallback((dx, dy) => {
    if (!state.selectedShapeIds.length) return
    const set = new Set(state.selectedShapeIds)
    commit(prev => updateBoundArrows(prev.map(s => set.has(s.id) && !s.locked ? { ...s, x: Math.round(s.x + dx), y: Math.round(s.y + dy) } : s)))
  }, [state.selectedShapeIds, commit])

  const duplicate = useCallback(() => {
    if (!state.selectedShapeIds.length) return
    const set = new Set(state.selectedShapeIds)
    const copies = shapes.filter(s => set.has(s.id)).map(s => ({ ...s, id: newId(), x: s.x + 20, y: s.y + 20, locked: s.type === 'image' ? false : s.locked }))
    commit(prev => [...prev, ...copies])
    dispatch({ type: 'SET_SELECTION', ids: copies.map(s => s.id) })
  }, [shapes, state.selectedShapeIds, commit, dispatch])

  const copy = useCallback(() => {
    const selected = new Set(state.selectedShapeIds)
    clipboard.current = shapes.filter(shape => selected.has(shape.id)).map(shape => ({ ...shape }))
  }, [shapes, state.selectedShapeIds])

  const paste = useCallback(() => {
    if (!clipboard.current.length) return
    const copies = clipboard.current.map(shape => ({ ...shape, id: newId(), x: shape.x + 20, y: shape.y + 20, locked: false }))
    commit(prev => [...prev, ...copies])
    dispatch({ type: 'SET_SELECTION', ids: copies.map(s => s.id) })
    dispatch({ type: 'SET_TOOL', tool: 'select' })
  }, [commit, dispatch])

  const viewRef = useRef(view); viewRef.current = view
  const addImage = useCallback(async file => {
    beginProcessing('Processing image...')
    try {
      const { src, width: naturalWidth, height: naturalHeight } = await readImageFile(file)
      const stage = stageRef.current
      const currentView = viewRef.current
      const viewport = { width: stage?.width() || window.innerWidth, height: stage?.height() || window.innerHeight }
      const width = INITIAL_IMAGE_WIDTH
      const height = Math.max(20, width * naturalHeight / naturalWidth)
      const image = {
        id: newId(),
        type: 'image',
        src,
        x: (viewport.width / 2 - currentView.x) / currentView.scale - width / 2,
        y: (viewport.height / 2 - currentView.y) / currentView.scale - height / 2,
        width, height, rotation: 0, opacity: 1, flipX: false, flipY: false, locked: false,
      }
      commit(prev => [...prev, image])
      dispatch({ type: 'SET_SELECTION', ids: [image.id] })
      dispatch({ type: 'SET_TOOL', tool: 'select' })
    } finally {
      finishProcessing()
    }
  }, [beginProcessing, commit, dispatch, finishProcessing])

  const selectAll = useCallback(() => dispatch({ type: 'SET_SELECTION', ids: shapes.map(s => s.id) }), [shapes, dispatch])
  const deselect = useCallback(() => dispatch({ type: 'SET_SELECTION', ids: [] }), [dispatch])
  const openImage = useCallback(() => imageInputRef.current?.click(), [])
  const zoomIn = useCallback(() => setView(current => { const next = clampScale(current.scale * 1.15); return next === current.scale ? current : zoomAtPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, current, next) }), [])
  const zoomOut = useCallback(() => setView(current => { const next = clampScale(current.scale / 1.15); return next === current.scale ? current : zoomAtPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, current, next) }), [])
  const resetZoom = useCallback(() => setView({ x: 0, y: 0, scale: 1 }), [])
  const zoomToFit = useCallback(() => { const next = fitViewToContent(shapes, window.innerWidth, window.innerHeight); if (next) setView(next) }, [shapes])

  const hydrated = useRef(false)
  const boardIdRef = useRef(null)
  const [pendingBoard, setPendingBoard] = useState(null)
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const isPageRefresh = usePageRefresh()
  const { previousBoardAvailable, savedBoard } = usePreviousBoard(splashDone)
  useEffect(() => {
    if (splashDone && isPageRefresh && previousBoardAvailable && savedBoard) {
      setPendingBoard(savedBoard)
      return
    }
    if (splashDone) {
      hydrated.current = true
    }
  }, [splashDone, isPageRefresh, previousBoardAvailable, savedBoard])
  useEffect(() => { if (savedBoard?.savedAt) setLastSavedAt(savedBoard.savedAt) }, [savedBoard])
  useEffect(() => { const onSaved = event => setLastSavedAt(event.detail?.savedAt || Date.now()); window.addEventListener('diagram:saved', onSaved); return () => window.removeEventListener('diagram:saved', onSaved) }, [])

  const restorePrevious = useCallback(() => {
    if (!pendingBoard) return
    const clean = pendingBoard.shapes.reduce((valid, shape) => {
      try {
        const sanitized = sanitizeShape(shape)
        if (sanitized) valid.push(sanitized)
      } catch (_error) {
      }
      return valid
    }, [])
    replace(clean)
    if (pendingBoard.boardId) {
      boardIdRef.current = pendingBoard.boardId
      activateBoard(pendingBoard.boardId)
    }
    if (pendingBoard.fileName) dispatch({ type: 'SET_FILENAME', fileName: pendingBoard.fileName })
    setLastSavedAt(pendingBoard.savedAt || null)
    hydrated.current = true
    setPendingBoard(null)
  }, [pendingBoard, replace, dispatch])

  const saveCurrentBoard = useCallback(() => {
    const saved = saveDiagram(latestRef.current.shapes, latestRef.current.fileName, boardIdRef.current)
    if (saved && !boardIdRef.current) {
      const record = loadDiagram()
      boardIdRef.current = record?.boardId || boardIdRef.current
    }
    return saved
  }, [])

  const startFresh = useCallback(() => {
    if (hydrated.current && !saveCurrentBoard()) return
    const fresh = createBoard([], 'Untitled board')
    if (!fresh) return
    boardIdRef.current = fresh.boardId
    replace([])
    dispatch({ type: 'SET_SELECTION', ids: [] })
    dispatch({ type: 'SET_FILENAME', fileName: fresh.fileName })
    setLastSavedAt(fresh.savedAt)
    hydrated.current = true
    setPendingBoard(null)
  }, [saveCurrentBoard, replace, dispatch])

  const saveAsBoard = useCallback(name => {
    const copy = createBoard(latestRef.current.shapes, name || `${latestRef.current.fileName || 'Untitled board'} copy`)
    if (!copy) return false
    boardIdRef.current = copy.boardId
    dispatch({ type: 'SET_FILENAME', fileName: copy.fileName })
    setLastSavedAt(copy.savedAt)
    return true
  }, [dispatch])

  const deleteBoard = useCallback(() => {
    if (!saveCurrentBoard()) return
    if (!moveDiagramToTrash(latestRef.current.shapes, latestRef.current.fileName, boardIdRef.current)) return
    const fresh = createBoard([], 'Untitled board')
    if (!fresh) {
      boardIdRef.current = null
      replace([])
      dispatch({ type: 'SET_SELECTION', ids: [] })
      dispatch({ type: 'SET_FILENAME', fileName: 'Untitled board' })
      setLastSavedAt(null)
      return
    }
    boardIdRef.current = fresh.boardId
    replace([])
    dispatch({ type: 'SET_SELECTION', ids: [] })
    dispatch({ type: 'SET_FILENAME', fileName: fresh.fileName })
    setLastSavedAt(fresh.savedAt)
  }, [saveCurrentBoard, replace, dispatch])

  const latestRef = useRef({ shapes, fileName: state.fileName })
  latestRef.current = { shapes, fileName: state.fileName }
  useEffect(() => {
    if (!hydrated.current) return
    const id = window.setTimeout(() => saveCurrentBoard(), 500)
    return () => window.clearTimeout(id)
  }, [shapes, state.fileName, saveCurrentBoard])

  useEffect(() => {
    const onUnload = () => { if (hydrated.current) saveCurrentBoard() }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [saveCurrentBoard])

  useKeyboardShortcuts({ enabled: active && !pendingBoard, dispatch, undo, redo, remove, nudge, duplicate, copy, paste, selectAll, deselect, openImage, zoomIn, zoomOut, zoomToFit, resetZoom })

  return (
    <main>
      <CanvasStage stageRef={stageRef} view={view} setView={setView} onImageDrop={addImage} onUserMessage={showUserMessage} />
      <Toolbar
        stageRef={stageRef}
        onImageUpload={addImage}
        imageInputRef={imageInputRef}
        view={view}
        onZoomReset={resetZoom}
        lastSavedAt={lastSavedAt}
        onNewBoard={startFresh}
        onSaveBoard={saveCurrentBoard}
        onSaveAsBoard={saveAsBoard}
        onDeleteBoard={deleteBoard}
        beginProcessing={beginProcessing}
        finishProcessing={finishProcessing}
        showUserMessage={showUserMessage}
      />
      <StylePanel />
      <ZoomControls view={view} setView={setView} />
      {splashDone && pendingBoard && <PreviousBoardModal onRestore={restorePrevious} onFresh={startFresh} />}
    </main>
  )
}

function BoardExperience({ splashDone, active, onStartupReady, beginProcessing, finishProcessing, showUserMessage }) {
  return (
    <AppStateProvider>
      <HistoryProvider>
        <Workspace
          splashDone={splashDone}
          active={active}
          onStartupReady={onStartupReady}
          beginProcessing={beginProcessing}
          finishProcessing={finishProcessing}
          showUserMessage={showUserMessage}
        />
        <CookieConsent />
      </HistoryProvider>
    </AppStateProvider>
  )
}

export default function App() {
  const initialRouteRef = useRef(resolveRoute())
  const [route, setRoute] = useState(initialRouteRef.current)
  const [splash, setSplash] = useState(() => initialRouteRef.current === 'board' ? 'visible' : 'done')
  const [processing, setProcessing] = useState({ active: false, label: 'Processing...' })
  const [userMessage, setUserMessage] = useState('')
  const userMessageTimer = useRef(0)
  const showUserMessage = useCallback(message => {
    if (!message) return
    setUserMessage(message)
    window.clearTimeout(userMessageTimer.current)
    userMessageTimer.current = window.setTimeout(() => setUserMessage(''), 2800)
  }, [])
  const beginProcessing = useCallback((label = 'Processing...') => {
    setProcessing({ active: true, label })
  }, [])
  const finishProcessing = useCallback(() => {
    setProcessing({ active: false, label: '' })
  }, [])

  // The splash is the ONLY visible UI during startup. After the minimum
  // duration elapses it begins a short fade-out; when the fade completes the
  // SplashScreen calls onHidden and the whiteboard is mounted. The whiteboard
  // (and all of its panels, modals and floating UI) is never rendered while the
  // splash is showing, so no element can flash on screen during initialization.
  useEffect(() => {
    if (initialRouteRef.current !== 'board') return
    const id = window.setTimeout(() => setSplash('fading'), SPLASH_MIN_MS)
    return () => window.clearTimeout(id)
  }, [])


  useEffect(() => {
    const onHash = () => setRoute(resolveRoute())
    window.addEventListener('hashchange', onHash)
    window.addEventListener('popstate', onHash)
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('popstate', onHash) }
  }, [])
  useEffect(() => {
    const titles = {
      landing: 'Kanvas — Your ideas deserve a canvas.',
      board: 'Kanvas — Think. Draw. Create.',
      docs: 'Documentation — Kanvas',
      notfound: '404 — Page Not Found',
      thankyou: 'Thank You',
      waitlist: 'Waitlist',
    }
    document.title = titles[route]
  }, [route])

  const showBoard = route === 'board' && splash === 'done'
  const showSplash = route === 'board' && splash !== 'done'
  return (
    <ThemeProvider>
      {route === 'landing' && <LandingPage />}
      {showBoard && (
        <>
          <BoardExperience
            splashDone
            active={route === 'board'}
            onStartupReady={() => { }}
            beginProcessing={beginProcessing}
            finishProcessing={finishProcessing}
            showUserMessage={showUserMessage}
          />
          {processing.active && (
            <div className="processing-banner" aria-live="polite" aria-busy="true">
              <span className="processing-spinner" aria-hidden="true" />
              <span>{processing.label}</span>
            </div>
          )}
          {userMessage && (
            <div className="app-toast" role="status" aria-live="polite">{userMessage}</div>
          )}
        </>
      )}
      {showSplash && <SplashScreen canHide={splash === 'fading'} onHidden={() => setSplash('done')} />}
      {route === 'notfound' && <NotFoundPage />}
      {route === 'docs' && <DocumentationPage />}
      {route === 'thankyou' && <ThankYouPage />}
      {route === 'waitlist' && <WaitlistPage />}
    </ThemeProvider>
  )
}
