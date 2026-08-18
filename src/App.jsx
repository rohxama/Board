import { useCallback, useEffect, useRef, useState } from 'react'
import { AppStateProvider, useAppState } from './context/AppStateContext'
import { HistoryProvider, useHistory } from './context/HistoryContext'
import CanvasStage from './components/Canvas/CanvasStage'
import Toolbar from './components/Toolbar/Toolbar'
import StylePanel from './components/StylePanel/StylePanel'
import ZoomControls, { fitViewToContent } from './components/ZoomControls/ZoomControls'
import SplashScreen from './components/SplashScreen/SplashScreen'
import PreviousBoardModal from './components/PreviousBoardModal/PreviousBoardModal'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { usePreviousBoard } from './hooks/useVisitorStatus'
import { newId } from './lib/idGenerator'
import { INITIAL_IMAGE_WIDTH, readImageFile } from './lib/images'
import { clearDiagram, loadDiagram, saveDiagram } from './lib/storage'
import { sanitizeShape, updateBoundArrows } from './lib/geometry'
import { clampScale, zoomAtPoint } from './lib/viewport'

function Workspace({ onReady }) {
  const [cursorPos, setCursorPos] = useState(null)
  const cursorThrottleRef = useRef(0)
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
  // startup choice is made so autosave cannot touch the saved board yet.
  const hydrated = useRef(false)
  const [pendingBoard, setPendingBoard] = useState(null)
  const { previousBoardAvailable, savedBoard } = usePreviousBoard()
  useEffect(() => {
    if (previousBoardAvailable && savedBoard) {
      setPendingBoard(savedBoard)
      return
    }
    hydrated.current = true
  }, [previousBoardAvailable, savedBoard])

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
    hydrated.current = true
    setPendingBoard(null)
  }, [pendingBoard, replace, dispatch])

  const startFresh = useCallback(() => {
    clearDiagram()
    hydrated.current = true
    setPendingBoard(null)
  }, [])

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

  useEffect(() => {
    let completed = false
    const finish = () => {
      if (completed) return
      completed = true
      onReady()
    }
    const frame = requestAnimationFrame(finish)
    const fallbackId = window.setTimeout(finish, 600)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(fallbackId)
    }
  }, [onReady])

  return (
    <main>
      <CanvasStage stageRef={stageRef} view={view} setView={setView} onCursorMove={pos => { const now = performance.now(); if (now - cursorThrottleRef.current > 50) { cursorThrottleRef.current = now; setCursorPos(pos) } }} onImageDrop={addImage} />
      <Toolbar stageRef={stageRef} onImageUpload={addImage} imageInputRef={imageInputRef} />
      <StylePanel />
      <ZoomControls view={view} setView={setView} cursorPos={cursorPos} shapes={shapes} />
      {pendingBoard && <PreviousBoardModal onRestore={restorePrevious} onFresh={startFresh} />}
    </main>
  )
}

export default function App() {
  const [splash, setSplash] = useState('visible')
  const dismiss = useCallback(() => {
    setSplash(current => current === 'visible' ? 'leaving' : current)
  }, [])
  useEffect(() => {
    if (splash !== 'leaving') return
    const id = window.setTimeout(() => setSplash('done'), 600)
    return () => window.clearTimeout(id)
  }, [splash])
  return (
    <AppStateProvider>
      <HistoryProvider>
        <Workspace onReady={dismiss} />
        {splash !== 'done' && <SplashScreen leaving={splash === 'leaving'} onHidden={() => setSplash('done')} />}
      </HistoryProvider>
    </AppStateProvider>
  )
}
