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
import { clearDiagram, loadDiagram, saveDiagram, moveDiagramToTrash } from './lib/storage'
import { sanitizeShape, updateBoundArrows } from './lib/geometry'
import { clampScale, zoomAtPoint } from './lib/viewport'

function Workspace({ splashDone }) {
  const stageRef = useRef()
  const imageInputRef = useRef()
  const clipboard = useRef([])
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 })
  const { state, dispatch } = useAppState()
  const { shapes, commit, replace, undo, redo } = useHistory()

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
  const [pendingBoard, setPendingBoard] = useState(null)
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const isPageRefresh = usePageRefresh()
  // Temporary routing: '#/home' and '#/docs' each render the 404 page until the
  // real Home / Documentation pages exist; any other hash path also falls back
  // to the 404. No hash = the board (root route). Swap the route matches below
  // for real page routing when those pages are built.
  const resolveRoute = () => {
    const hash = window.location.hash
    if (hash === '#/docs') return 'docs'
    if (hash === '#/thank-you') return 'thankyou'
    if (hash === '#/waitlist') return 'waitlist'
    if (hash.startsWith('#/')) return 'notfound'
    return 'board'
  }
  const [route, setRoute] = useState(resolveRoute)
  useEffect(() => {
    const onHash = () => setRoute(resolveRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    const titles = {
      board: null,
      docs: '404 — Page Not Found',
      notfound: '404 — Page Not Found',
      thankyou: 'Thank You',
      waitlist: 'Waitlist',
    }
    const title = titles[route]
    if (title) document.title = title
  }, [route])
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
    if (pendingBoard.fileName) dispatch({ type: 'SET_FILENAME', fileName: pendingBoard.fileName })
    setLastSavedAt(pendingBoard.savedAt || null)
    hydrated.current = true
    setPendingBoard(null)
  }, [pendingBoard, replace, dispatch])

  const startFresh = useCallback(() => {
    clearDiagram()
    setLastSavedAt(null)
    hydrated.current = true
    setPendingBoard(null)
  }, [])

  const duplicateBoard = useCallback(() => {
    const nextName = `${state.fileName || 'Untitled board'} copy`
    dispatch({ type: 'SET_FILENAME', fileName: nextName })
    saveDiagram(shapes, nextName)
  }, [state.fileName, shapes, dispatch])

  const deleteBoard = useCallback(() => {
    moveDiagramToTrash(shapes, state.fileName)
    replace([])
    dispatch({ type: 'SET_SELECTION', ids: [] })
    dispatch({ type: 'SET_FILENAME', fileName: 'Untitled board' })
    setLastSavedAt(null)
  }, [shapes, state.fileName, replace, dispatch])

  // Debounced autosave: persist every change ~500ms after the last edit.
  const latestRef = useRef({ shapes, fileName: state.fileName })
  latestRef.current = { shapes, fileName: state.fileName }
  useEffect(() => {
    if (!hydrated.current) return
    const id = window.setTimeout(() => saveDiagram(latestRef.current.shapes, latestRef.current.fileName), 500)
    return () => window.clearTimeout(id)
  }, [shapes, state.fileName])

  // Flush a final synchronous save on unload. Skipped until the user has made
  // a startup choice, so closing early can never overwrite the saved board.
  useEffect(() => {
    const onUnload = () => { if (hydrated.current) saveDiagram(latestRef.current.shapes, latestRef.current.fileName) }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])

  useKeyboardShortcuts({ enabled: !pendingBoard, dispatch, undo, redo, remove, nudge, duplicate, copy, paste, selectAll, deselect, openImage, zoomIn, zoomOut, zoomToFit, resetZoom })

  return (
    <main>
      <CanvasStage stageRef={stageRef} view={view} setView={setView} onImageDrop={addImage} />
      <Toolbar stageRef={stageRef} onImageUpload={addImage} imageInputRef={imageInputRef} view={view} onZoomReset={resetZoom} lastSavedAt={lastSavedAt} onDuplicateBoard={duplicateBoard} onDeleteBoard={deleteBoard} />
      <StylePanel />
      <ZoomControls view={view} setView={setView} />
      {splashDone && pendingBoard && <PreviousBoardModal onRestore={restorePrevious} onFresh={startFresh} />}
      {route === 'notfound' && <NotFoundPage />}
      {route === 'docs' && <NotFoundPage title="404 — Page Not Found" message="The Documentation page is not available yet." buttonLabel="Back to Board" />}
      {route === 'thankyou' && <ThankYouPage />}
      {route === 'waitlist' && <WaitlistPage />}
    </main>
  )
}

// Splash timing: the loader bar animation (splash-fill) is the designed
// delay — the splash stays up for its full run, then exits smoothly.
const SPLASH_MIN_MS = 6200
const SPLASH_EXIT_MS = 600

export default function App() {
  const [splash, setSplash] = useState('visible')
  useEffect(() => {
    const id = window.setTimeout(() => setSplash('leaving'), SPLASH_MIN_MS)
    return () => window.clearTimeout(id)
  }, [])
  useEffect(() => {
    if (splash !== 'leaving') return
    const id = window.setTimeout(() => setSplash('done'), SPLASH_EXIT_MS)
    return () => window.clearTimeout(id)
  }, [splash])
  return (
    <AppStateProvider>
      <HistoryProvider>
        <Workspace splashDone={splash === 'done'} />
        <CookieConsent />
        {splash !== 'done' && <SplashScreen leaving={splash === 'leaving'} onHidden={() => setSplash('done')} />}
      </HistoryProvider>
    </AppStateProvider>
  )
}
