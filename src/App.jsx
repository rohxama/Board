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
import CookieConsent from './components/CookieConsent/CookieConsent'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { usePreviousBoard } from './hooks/useVisitorStatus'
import { usePageRefresh } from './hooks/usePageRefresh'
import { newId } from './lib/idGenerator'
import { INITIAL_IMAGE_WIDTH, readImageFile } from './lib/images'
import { activateBoard, createBoard, loadDiagram, saveDiagram, moveDiagramToTrash } from './lib/storage'
import { sanitizeShape, updateBoundArrows } from './lib/geometry'
import { clampScale, zoomAtPoint } from './lib/viewport'

const resolveRoute = () => {
  const hash = window.location.hash
  if (hash === '#/docs') return 'docs'
  if (hash === '#/thank-you') return 'thankyou'
  if (hash === '#/waitlist') return 'waitlist'
  if (hash.startsWith('#/')) return 'notfound'
  return 'board'
}

function Workspace({ splashDone, active = true, onStartupReady }) {
  const stageRef = useRef()
  const imageInputRef = useRef()
  const clipboard = useRef([])
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 })
  const { state, dispatch } = useAppState()
  const { shapes, commit, replace, undo, redo } = useHistory()

  // The workspace is ready once its providers, state, restoration hooks, and
  // canvas have mounted. Optional restoration remains non-blocking and can
  // present the existing previous-board choice after the splash exits.
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
    dispatch({ type: 'SET_SELECTION', ids: copies.map(shape => shape.id) })
    dispatch({ type: 'SET_TOOL', tool: 'select' })
  }, [commit, dispatch])

  const viewRef = useRef(view); viewRef.current = view
  const addImage = useCallback(async file => {
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
  }, [commit, dispatch])

  const selectAll = useCallback(() => dispatch({ type: 'SET_SELECTION', ids: shapes.map(s => s.id) }), [shapes, dispatch])
  const deselect = useCallback(() => dispatch({ type: 'SET_SELECTION', ids: [] }), [dispatch])
  const openImage = useCallback(() => imageInputRef.current?.click(), [])
  const zoomIn = useCallback(() => setView(current => { const next = clampScale(current.scale * 1.15); return next === current.scale ? current : zoomAtPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, current, next) }), [])
  const zoomOut = useCallback(() => setView(current => { const next = clampScale(current.scale / 1.15); return next === current.scale ? current : zoomAtPoint({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, current, next) }), [])
  const resetZoom = useCallback(() => setView({ x: 0, y: 0, scale: 1 }), [])
  const zoomToFit = useCallback(() => { const next = fitViewToContent(shapes, window.innerWidth, window.innerHeight); if (next) setView(next) }, [shapes])

  // Startup: only a returning visitor with a saved board is offered the
  // previous board (first-time users and returning users without saved data
  // open the blank canvas immediately). Hydration stays held until the
  // startup choice is made so autosave cannot touch the saved board.
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
        // Skip only the corrupted shape; preserve the rest of the saved board.
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

  // Debounced autosave: persist every change ~500ms after the last edit.
  const latestRef = useRef({ shapes, fileName: state.fileName })
  latestRef.current = { shapes, fileName: state.fileName }
  useEffect(() => {
    if (!hydrated.current) return
    const id = window.setTimeout(() => saveCurrentBoard(), 500)
    return () => window.clearTimeout(id)
  }, [shapes, state.fileName, saveCurrentBoard])

  // Flush a final synchronous save on unload. Skipped until the user has made
  // a startup choice, so closing early can never overwrite the saved board.
  useEffect(() => {
    const onUnload = () => { if (hydrated.current) saveCurrentBoard() }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [saveCurrentBoard])

  useKeyboardShortcuts({ enabled: active && !pendingBoard, dispatch, undo, redo, remove, nudge, duplicate, copy, paste, selectAll, deselect, openImage, zoomIn, zoomOut, zoomToFit, resetZoom })

  return (
    <main>
      <CanvasStage stageRef={stageRef} view={view} setView={setView} onImageDrop={addImage} />
      <Toolbar stageRef={stageRef} onImageUpload={addImage} imageInputRef={imageInputRef} view={view} onZoomReset={resetZoom} lastSavedAt={lastSavedAt} onNewBoard={startFresh} onSaveBoard={saveCurrentBoard} onSaveAsBoard={saveAsBoard} onDeleteBoard={deleteBoard} />
      <StylePanel />
      <ZoomControls view={view} setView={setView} />
      {splashDone && pendingBoard && <PreviousBoardModal onRestore={restorePrevious} onFresh={startFresh} />}
    </main>
  )
}

// The splash exits only after the mounted workspace reports that the required
// synchronous startup state is ready. SplashScreen owns the short exit
// transition fallback, not application initialization.
const SPLASH_EXIT_MS = 600
const SPLASH_HARD_LIMIT_MS = 4000

function BoardExperience({ splashDone, active, onStartupReady }) {
  return (
    <AppStateProvider>
      <HistoryProvider>
        <Workspace splashDone={splashDone} active={active} onStartupReady={onStartupReady} />
        <CookieConsent />
      </HistoryProvider>
    </AppStateProvider>
  )
}

export default function App() {
  // The route the app actually loaded with decides whether this is a genuine
  // application start (splash + board) or a deep link to a standalone page.
  const initialRouteRef = useRef(resolveRoute())
  const [route, setRoute] = useState(initialRouteRef.current)
  // Splash plays once per genuine load, and only when the session began on
  // the board. Browser Back/Forward only changes the hash, so this state
  // survives history navigation and the splash never replays.
  const [splash, setSplash] = useState(() => initialRouteRef.current === 'board' ? 'visible' : 'done')

  // Stable callback for Workspace to signal that the board is ready.
  const markStartupReady = useCallback(() => {
    setSplash(current => current === 'visible' ? 'leaving' : current)
  }, [])

  // Stable callback for SplashScreen to signal that the exit transition is
  // complete. Wrapped in useCallback so the SplashScreen fallback timeout
  // is never invalidated by a new function reference.
  const hideSplash = useCallback(() => setSplash('done'), [])

  // SAFETY: If the splash is stuck in 'visible' (onStartupReady was never
  // called — e.g. a render error in Workspace), force it to start leaving
  // after a hard limit. This is NOT the primary exit path.
  useEffect(() => {
    if (splash !== 'visible') return
    const id = window.setTimeout(() => {
      setSplash(current => current === 'visible' ? 'leaving' : current)
    }, SPLASH_HARD_LIMIT_MS)
    return () => window.clearTimeout(id)
  }, [splash])

  // Once the splash is leaving, give the CSS transition time to finish,
  // then remove the splash unconditionally.
  useEffect(() => {
    if (splash !== 'leaving') return
    const id = window.setTimeout(() => setSplash('done'), SPLASH_EXIT_MS)
    return () => window.clearTimeout(id)
  }, [splash])

  useEffect(() => {
    const onHash = () => setRoute(resolveRoute())
    window.addEventListener('hashchange', onHash)
    window.addEventListener('popstate', onHash)
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('popstate', onHash) }
  }, [])
  useEffect(() => {
    const titles = {
      board: 'Board — Collaborative Whiteboard & Diagram Tool',
      docs: '404 — Page Not Found',
      notfound: '404 — Page Not Found',
      thankyou: 'Thank You',
      waitlist: 'Waitlist',
    }
    document.title = titles[route]
  }, [route])

  // Standalone routes must not keep any Whiteboard components mounted beneath
  // their page. The board tree exists only while the active route is the board.
  const boardMounted = route === 'board'
  return (
    <>
      {boardMounted && <BoardExperience splashDone={splash === 'done'} active={route === 'board'} onStartupReady={markStartupReady} />}
      {splash !== 'done' && route === 'board' && <SplashScreen leaving={splash === 'leaving'} onHidden={hideSplash} />}
      {route === 'notfound' && <NotFoundPage />}
      {route === 'docs' && <NotFoundPage message="The Documentation page is not available yet." />}
      {route === 'thankyou' && <ThankYouPage />}
      {route === 'waitlist' && <WaitlistPage />}
    </>
  )
}
