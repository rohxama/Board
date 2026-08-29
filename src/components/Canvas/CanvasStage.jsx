import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import Konva from 'konva'
import { Arrow, Ellipse, Group, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva'
import { useAppState } from '../../context/AppStateContext'
import { useHistory } from '../../context/HistoryContext'
import { useTheme } from '../../context/ThemeContext'
import { getThemeAwareColor } from '../../lib/themeColors'
import { newId } from '../../lib/idGenerator'
import { snapToGrid, getSnapGuides } from '../../lib/snapping'
import { bindArrowEndpoints, normalizeBox, updateBoundArrows } from '../../lib/geometry'

import { clampScale, zoomAtPoint } from '../../lib/viewport'
import { hasPointerEvents } from '../../lib/browser'
import { addEventListenerOnce } from '../../lib/eventListeners'
import { useImageAsset } from '../../hooks/useImageAsset'

const NO_POINTER = !hasPointerEvents

const MIN_SIZE = 8
const ARROW_POINTER_LENGTH = 10
const ARROW_POINTER_WIDTH = 10
const MIN_TEXT_WIDTH = 20
const TEXT_LINE_HEIGHT = 1.25
const TEXT_FONT_FAMILY = 'Arial, sans-serif'
const dashValue = dash => dash === 'dashed' ? [10, 6] : dash === 'dotted' ? [2, 6] : []
const isPointShape = type => ['arrow', 'line', 'pen'].includes(type)
const initialInteraction = { mode: 'idle' }
const LASER_VISIBLE_DURATION = 1000
const LASER_RETRACT_MS = 450
const ERASER_SCREEN_PX = 16

// Keep the original point order and return only the portion from the user's
// starting point to the current retract position. This makes the laser shrink
// from the release/end point regardless of the drawing direction.
function trimLaserPoints(points, progress) {
  if (!Array.isArray(points) || points.length < 4) return []
  if (progress <= 0) return points
  let total = 0
  for (let i = 2; i < points.length; i += 2) total += Math.hypot(points[i] - points[i - 2], points[i + 1] - points[i - 1])
  const keep = total * Math.max(0, 1 - progress)
  if (keep <= 0 || total <= 0) return []
  const visible = [points[0], points[1]]
  let travelled = 0
  for (let i = 2; i < points.length; i += 2) {
    const x1 = points[i - 2], y1 = points[i - 1], x2 = points[i], y2 = points[i + 1]
    const length = Math.hypot(x2 - x1, y2 - y1)
    if (!length) continue
    if (travelled + length <= keep) {
      visible.push(x2, y2)
      travelled += length
      continue
    }
    const ratio = Math.max(0, Math.min(1, (keep - travelled) / length))
    visible.push(x1 + (x2 - x1) * ratio, y1 + (y2 - y1) * ratio)
    break
  }
  return visible
}

// Bounding-box cache for pen/line/arrow shapes.  Each entry is keyed by
// `${id}:${pointsKey}` so it is only recomputed when the points actually change.
const _bboxCache = new Map()
function getLineBBox(shape) {
  let c = _bboxCache.get(shape.id)
  if (c && c.points === shape.points && c.x === shape.x && c.y === shape.y && c.strokeWidth === shape.strokeWidth) return c.box
  const pts = shape.points; if (pts.length < 4) return null
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  const include = (px, py) => {
    minX = Math.min(minX, px)
    minY = Math.min(minY, py)
    maxX = Math.max(maxX, px)
    maxY = Math.max(maxY, py)
  }
  for (let k = 0; k < pts.length; k += 2) include(shape.x + pts[k], shape.y + pts[k + 1])

  // Konva's Arrow draws a filled triangular head beyond the final line point.
  // Include that triangle and the visible stroke so marquee/culling bounds stay
  // tight to the rendered object rather than using a default rectangle.
  if (shape.type === 'arrow') {
    const end = { x: shape.x + pts[pts.length - 2], y: shape.y + pts[pts.length - 1] }
    const previous = { x: shape.x + pts[pts.length - 4], y: shape.y + pts[pts.length - 3] }
    const dx = end.x - previous.x, dy = end.y - previous.y, length = Math.hypot(dx, dy)
    if (length > 0) {
      const ux = dx / length, uy = dy / length
      const px = -uy * ARROW_POINTER_WIDTH / 2, py = ux * ARROW_POINTER_WIDTH / 2
      const baseX = end.x - ux * ARROW_POINTER_LENGTH, baseY = end.y - uy * ARROW_POINTER_LENGTH
      include(baseX + px, baseY + py)
      include(baseX - px, baseY - py)
    }
  }
  const pad = Math.max(0, Number(shape.strokeWidth) || 2) / 2
  const box = { l: minX - pad, t: minY - pad, r: maxX + pad, b: maxY + pad }
  _bboxCache.set(shape.id, { points: shape.points, x: shape.x, y: shape.y, strokeWidth: shape.strokeWidth, box })
  return box
}

function getShapeBounds(shape) {
  if (isPointShape(shape.type)) {
    const box = getLineBBox(shape)
    return box || { l: shape.x, t: shape.y, r: shape.x, b: shape.y }
  }
  return { l: shape.x, t: shape.y, r: shape.x + (shape.width || 0), b: shape.y + (shape.height || 0) }
}

function interactionReducer(state, action) {
  if (action.type === 'RESET' || action.type === 'END') return initialInteraction
  if (action.type === 'START') return { mode: action.mode }
  return state
}

// Shared offscreen canvas for measuring text — mirrors how Konva/the browser
// will actually lay the string out, so the live textarea box and the final
// committed shape's width/height always agree.
let measureCtx
function measureTextBox(text, fontSize) {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d')
  measureCtx.font = `${fontSize}px ${TEXT_FONT_FAMILY}`
  const lines = (text || '').split('\n')
  const widest = Math.max(...lines.map(line => measureCtx.measureText(line || ' ').width))
  const lineHeight = fontSize * TEXT_LINE_HEIGHT
  return {
    width: Math.max(Math.ceil(widest) + 4, MIN_TEXT_WIDTH),
    height: Math.max(Math.ceil(lines.length * lineHeight) + 4, Math.ceil(lineHeight)),
  }
}

const ImageShape = memo(function ImageShape({ shape, nodeRef, onEdit, draggable = true }) {
  const { image, failed } = useImageAsset(shape.src)
  const shapeRef = useRef(shape)
  shapeRef.current = shape
  const onEditShape = useCallback(() => onEdit(shapeRef.current), [onEdit])
  const flipX = Boolean(shape.flipX)
  const flipY = Boolean(shape.flipY)
  const { theme } = useTheme()
  useEffect(() => { if (image) nodeRef.current?.getLayer()?.batchDraw() }, [image])
  if (failed) {
    return <Rect id={shape.id} shapeId={shape.id} ref={nodeRef} draggable={draggable && !shape.locked} onDblClick={onEditShape} onDblTap={onEditShape} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rotation={shape.rotation || 0} opacity={shape.opacity ?? 1} stroke={getThemeAwareColor('#dc2626', theme)} strokeWidth={1.5} dash={[5, 4]} fill={getThemeAwareColor('#fecaca', theme)} />
  }
  return <KonvaImage id={shape.id} shapeId={shape.id} ref={nodeRef} draggable={draggable && !shape.locked} onDblClick={onEditShape} onDblTap={onEditShape} image={image} x={shape.x + (flipX ? shape.width : 0)} y={shape.y + (flipY ? shape.height : 0)} width={shape.width} height={shape.height} scaleX={flipX ? -1 : 1} scaleY={flipY ? -1 : 1} rotation={shape.rotation || 0} opacity={shape.opacity ?? 1} imageSmoothingEnabled={false} perfectDrawEnabled={false} shadowForStrokeEnabled={false} />
})

const Shape = memo(function Shape({ shape, nodeRef, onEdit, draggable = true, viewScaleRef, penNodeRef }) {
  const shapeRef = useRef(shape)
  shapeRef.current = shape
  const onEditShape = useCallback(() => onEdit(shapeRef.current), [onEdit])
  // Theme-aware display colors: the stored stroke/fill stay as the user
  // authored them; only the rendered color is adapted to the active theme so
  // existing content stays readable after a light<->dark switch.
  const { theme } = useTheme()
  const displayStroke = getThemeAwareColor(shape.stroke, theme)
  const displayFill = shape.fill === 'transparent' ? undefined : getThemeAwareColor(shape.fill, theme)
  const interaction = { id: shape.id, shapeId: shape.id, ref: nodeRef, draggable: draggable && !shape.locked, onDblClick: onEditShape, onDblTap: onEditShape }
  const paint = { stroke: displayStroke, strokeWidth: shape.strokeWidth, fill: displayFill, opacity: shape.opacity, dash: dashValue(shape.dash), rotation: shape.rotation || 0, perfectDrawEnabled: false, shadowForStrokeEnabled: false }
  const scale = (viewScaleRef?.current) || 1
  // Keep thin point-shape hit areas usable but proportional to the visible
  // stroke. Unlike the old fixed 16px world-space hit box, this stays tight at
  // normal zoom and remains a consistent small screen-space target while zooming.
  const pointHitW = Math.max(shape.strokeWidth || 2, (shape.strokeWidth || 2) + 8 / scale)
  const borderHitW = Math.max(shape.strokeWidth || 2, 16 / scale)
  const pointHit = { hitStrokeWidth: pointHitW }
  const borderHit = { hitStrokeWidth: borderHitW }
  // The drawing preview updates this Line node imperatively. Keep its declarative
  // point-array identity stable across unrelated canvas renders so React-Konva
  // does not reapply the initial (zero-size) draft geometry mid-drag.
  const diamondPoints = useMemo(() => [shape.width / 2, 0, shape.width, shape.height / 2, shape.width / 2, shape.height, 0, shape.height / 2], [shape.width, shape.height])
  const safeHit = fn => (ctx, node) => { try { fn(ctx, node) } catch (_e) { } }
  const rectHitFunc = useCallback(safeHit((ctx, node) => { ctx.beginPath(); ctx.rect(0, 0, node.width(), node.height()); ctx.fillStrokeShape(node) }), [])
  const ellipseHitFunc = useCallback(safeHit((ctx, node) => { ctx.beginPath(); ctx.ellipse(0, 0, node.radiusX(), node.radiusY(), 0, 0, Math.PI * 2, false); ctx.fillStrokeShape(node) }), [])
  const diamondHitFunc = useCallback(safeHit((ctx, node) => { const points = node.points(); if (!points || points.length < 8) return; ctx.beginPath(); ctx.moveTo(points[0], points[1]); for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1]); ctx.closePath(); ctx.fillStrokeShape(node) }), [])

  if (shape.type === 'image') return <ImageShape shape={shape} nodeRef={nodeRef} onEdit={onEdit} draggable={draggable} />
  if (shape.type === 'rectangle') return <Rect {...interaction} {...paint} x={shape.x} y={shape.y} width={shape.width} height={shape.height} cornerRadius={shape.cornerRadius ?? 8} hitFunc={rectHitFunc} {...borderHit} />
  if (shape.type === 'ellipse') return <Ellipse {...interaction} {...paint} x={shape.x + shape.width / 2} y={shape.y + shape.height / 2} radiusX={shape.width / 2} radiusY={shape.height / 2} hitFunc={ellipseHitFunc} {...borderHit} />
  if (shape.type === 'diamond') return <Line {...interaction} {...paint} {...borderHit} x={shape.x} y={shape.y} closed points={diamondPoints} hitFunc={diamondHitFunc} lineJoin="round" />
  if (shape.type === 'arrow') return <Arrow {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} pointerLength={ARROW_POINTER_LENGTH} pointerWidth={ARROW_POINTER_WIDTH} fill={displayStroke} />

  if (shape.type === 'line') return <Line {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} lineCap="round" lineJoin="round" />
  if (shape.type === 'pen') return <Line {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} lineCap="round" lineJoin="round" tension={.35} ref={penNodeRef || nodeRef} />
  return <Text {...interaction} x={shape.x} y={shape.y} text={shape.text} fontSize={shape.fontSize || 20} fontFamily={TEXT_FONT_FAMILY} lineHeight={TEXT_LINE_HEIGHT} fill={displayStroke} opacity={shape.opacity} width={shape.width} rotation={shape.rotation || 0} draggable={draggable && !shape.locked} />
})

// The full set of committed shapes, memoized so pan-only view flushes (x/y
// change without a scale change) never rebuild the per-shape element list.
// A glowing neon-red laser pointer: a bright core wrapped in a soft red halo.
// Stacked strokes (outer glow -> mid glow -> bright core) plus a blurred red
// shadow give the realistic "shining laser" look. The live beam and committed
// (retracting) beams share this so they read identically.
const getLaserStyle = dark => dark
  ? {
    core: '#ff6b6b', glow: '#ff2424', outer: '#ff0a33',
    coreWidth: 1.5, glowWidth: 3, outerWidth: 7,
    coreOpacity: 1, glowOpacity: 0.5, outerOpacity: 0.3,
    shadowBlur: 12, shadowOpacity: 1,
  }
  : {
    core: '#ff4d4d', glow: '#ff2a2a', outer: '#ff0a33',
    coreWidth: 1.5, glowWidth: 2.5, outerWidth: 6,
    coreOpacity: 1, glowOpacity: 0.42, outerOpacity: 0.22,
    shadowBlur: 5, shadowOpacity: 0.65,
  }

function LaserBeam({ points, opacity, dark, groupRef }) {
  const s = getLaserStyle(dark)
  return (
    <Group ref={groupRef} listening={false}>
      <Line listening={false} points={points} stroke={s.outer} strokeWidth={s.outerWidth} lineCap="round" lineJoin="round" opacity={opacity * s.outerOpacity} shadowColor="#ff0000" shadowBlur={s.shadowBlur} shadowOpacity={s.shadowOpacity} />
      <Line listening={false} points={points} stroke={s.glow} strokeWidth={s.glowWidth} lineCap="round" lineJoin="round" opacity={opacity * s.glowOpacity} />
      <Line listening={false} points={points} stroke={s.core} strokeWidth={s.coreWidth} lineCap="round" lineJoin="round" opacity={opacity * s.coreOpacity} />
    </Group>
  )
}

const ShapesLayer = memo(function ShapesLayer({ shapes, editingId, draggable, viewScaleRef, onEdit, refFor }) {
  const visibleShapes = useMemo(() => shapes.filter(shape => shape.id !== editingId), [shapes, editingId])
  return visibleShapes.map(shape => <Shape key={shape.id} shape={shape} nodeRef={refFor(shape.id)} draggable={draggable} viewScaleRef={viewScaleRef} onEdit={onEdit} />)
})

export default function CanvasStage({ stageRef, view, setView, onCursorMove, onImageDrop }) {
  const { state, dispatch } = useAppState()
  const { shapes, commit } = useHistory()
  if (typeof window !== 'undefined') { window.__app = { state, shapes, view }; window.__stage = stageRef.current; window.__setView = setView }
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const hostRef = useRef(); const nodes = useRef({}); const refCallbacks = useRef({}); const transformer = useRef(); const editorRef = useRef()
  const dragSelection = useRef([])
  const marqueeStart = useRef(null)
  const marqueeRef = useRef(null)
  const [marquee, setMarquee] = useState(null)
  const dragGesture = useRef(null)

  const shapesRef = useRef(shapes); shapesRef.current = shapes
  const stateRef = useRef(state); stateRef.current = state
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [draft, setDraft] = useState(null); const draftRef = useRef(null); const penPointsRef = useRef(null); const draftNodeRef = useRef(null); const draftEndRef = useRef(null); const pointerMoveRafRef = useRef(0); const pendingPointerMoveRef = useRef(null); const dragMoveRafRef = useRef(0); const pendingDragMoveRef = useRef(null); const panMoveRafRef = useRef(0); const pendingPanMoveRef = useRef(null); const lastPanPointRef = useRef(null)
  const [laser, setLaser] = useState(null); const laserRef = useRef(null); const laserNodeRef = useRef(null); const [laserStrokes, setLaserStrokes] = useState([]); const laserStrokesRef = useRef([]); const laserTimersRef = useRef(new Map()); const laserRafsRef = useRef(new Map()); const [snapGuides, setSnapGuides] = useState(null); const [editing, setEditing] = useState(null); const editingRef = useRef(null); editingRef.current = editing; const lastTextCommitRef = useRef(0)
  const viewRef2 = useRef(view); viewRef2.current = view
  const [interaction, dispatchInteraction] = useReducer(interactionReducer, initialInteraction)
  const interactionRef = useRef(initialInteraction); interactionRef.current = interaction
  const start = useRef(null); const panStart = useRef(null); const activePointer = useRef(null)
  const panMoveHandlerRef = useRef(null)
  const abortRef = useRef(null)
  const eraserSquareRef = useRef(null)
  const [eraserSquare, setEraserSquare] = useState(null)
  const [erasedLive, setErasedLive] = useState(() => new Set())
  const erasedIdsRef = useRef(null)
  if (erasedIdsRef.current === null) erasedIdsRef.current = new Set()
  const [stageEpoch, setStageEpoch] = useState(0); const lastCanvasRecovery = useRef(0); const epochRef = useRef(0); epochRef.current = stageEpoch
  const cullStateRef = useRef(new Map()); const cullRafRef = useRef(0); const lastCullEpochRef = useRef(-1)
  const viewScaleRef = useRef(view.scale); viewScaleRef.current = view.scale
  const hitGraphOn = useRef(true)
  const spacePanRef = useRef(false)
  const emptyDismissed = useRef(false)
  const prevToolForEmptyRef = useRef(state.activeTool)
  useEffect(() => {
    if (emptyDismissed.current) return
    if (shapes.length > 0 || state.activeTool !== prevToolForEmptyRef.current) {
      emptyDismissed.current = true
    }
    prevToolForEmptyRef.current = state.activeTool
  }, [shapes.length, state.activeTool])
  useEffect(() => {
    const isEditable = target => target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable
    const onKeyDown = event => {
      if (event.code !== 'Space' || isEditable(event.target)) return
      spacePanRef.current = true
      event.preventDefault()
    }
    const onKeyUp = event => {
      if (event.code === 'Space') spacePanRef.current = false
    }
    const onBlur = () => { spacePanRef.current = false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  // Toggle the layer's hit canvas. While an active pointer gesture runs (pan /
  // draw / drag / resize) Konva doesn't need per-shape hit testing, so
  // listening(false) skips rasterizing the hit canvas entirely — a large chunk
  // of the per-frame cost with many shapes. The guard keeps toggles no-ops.
  const setHitGraph = useCallback(on => {
    if (hitGraphOn.current === on) return
    hitGraphOn.current = on
    const stage = stageRef.current
    if (!stage) return
    stage.getLayers().forEach(layer => layer.listening(on))
  }, [])
  useEffect(() => { const stage = stageRef.current; return () => { } }, [stageEpoch])
  const updateDraft = next => { draftRef.current = next; setDraft(next) }
  const updateLaser = next => { laserRef.current = next; setLaser(next) }
  // Eraser square size in world units, derived from a constant on-screen size so
  // the active area stays small and precise at any zoom level.
  const eraserWorldSize = () => ERASER_SCREEN_PX / Math.max(0.0001, viewRef2.current.scale || 1)
  // Erase ONLY the committed shapes whose actual rendered geometry is touched
  // by the eraser square. We hit-test by sampling points across the eraser
  // square in screen space and asking Konva which shape (if any) sits under
  // each point. This uses every shape's real hit area (including stroke width
  // and rotation), so a thin diagonal line or an angular diamond erases only
  // where the pointer truly overlaps it — never a neighbouring object merely
  // because its bounding box happened to be nearby. Locked shapes are kept.
  const eraseAt = p => {
    const stage = stageRef.current
    if (!stage) return
    const view = viewRef2.current || { x: 0, y: 0, scale: 1 }
    const sHalf = ERASER_SCREEN_PX / 2
    const cx = p.x * view.scale + view.x
    const cy = p.y * view.scale + view.y
    const removed = []
    const seen = new Set()
    for (let ox = -1; ox <= 1.0001; ox += 0.5) {
      for (let oy = -1; oy <= 1.0001; oy += 0.5) {
        const node = stage.getIntersection({ x: cx + ox * sHalf, y: cy + oy * sHalf })
        if (!node) continue
        const id = node.getAttr && node.getAttr('shapeId')
        if (!id || seen.has(id)) continue
        const s = shapesRef.current.find(sh => sh.id === id)
        if (!s || s.locked || erasedIdsRef.current.has(id)) continue
        seen.add(id)
        removed.push(id)
      }
    }
    if (!removed.length) return
    removed.forEach(id => erasedIdsRef.current.add(id))
    setErasedLive(prev => { const next = new Set(prev); removed.forEach(id => next.add(id)); return next })
  }
  const scheduleLaserStroke = useCallback(points => {
    if (!Array.isArray(points) || points.length < 4) return
    const id = newId()
    const stroke = { id, points: points.slice(), progress: 0 }
    laserStrokesRef.current = [...laserStrokesRef.current, stroke]
    setLaserStrokes(laserStrokesRef.current)
    const timer = window.setTimeout(() => {
      laserTimersRef.current.delete(id)
      const startedAt = performance.now()
      const retract = now => {
        const progress = Math.min(1, Math.max(0, (now - startedAt) / LASER_RETRACT_MS))
        const current = laserStrokesRef.current.find(item => item.id === id)
        if (!current) return
        const next = laserStrokesRef.current.map(item => item.id === id ? { ...item, progress } : item)
        laserStrokesRef.current = next
        setLaserStrokes(next)
        if (progress < 1) {
          const raf = requestAnimationFrame(retract)
          laserRafsRef.current.set(id, raf)
        } else {
          laserRafsRef.current.delete(id)
          const remaining = laserStrokesRef.current.filter(item => item.id !== id)
          laserStrokesRef.current = remaining
          setLaserStrokes(remaining)
        }
      }
      const raf = requestAnimationFrame(retract)
      laserRafsRef.current.set(id, raf)
    }, LASER_VISIBLE_DURATION)
    laserTimersRef.current.set(id, timer)
  }, [])
  const startInteraction = mode => { interactionRef.current = { mode }; dispatchInteraction({ type: 'START', mode }) }
  // PAN: while the pointer moves, the viewport is recomputed from the gesture
  // origin and written straight into React state. The Stage renders x/y/scale
  // from that state — one source of truth, no imperative stage movement.
  const handlePanMove = useCallback(e => {
    const origin = panStart.current
    if (!origin) return
    const pid = Number.isFinite(e.pointerId) ? e.pointerId : null
    if (activePointer.current !== null && activePointer.current !== pid) return
    const x = origin.view.x + e.clientX - origin.px
    const y = origin.view.y + e.clientY - origin.py
    lastPanPointRef.current = { x: e.clientX, y: e.clientY }
    setView({ x, y, scale: origin.view.scale })
    requestCull()
  }, [])
  // Cancel any pending pan animation frame and drop the trailing pointer sample.
  // `handlePanMove` writes the viewport synchronously, so this is just a clean
  // teardown that guarantees no stray move is replayed after a pan ends.
  const flushPanMove = useCallback(() => {
    if (panMoveRafRef.current) { cancelAnimationFrame(panMoveRafRef.current); panMoveRafRef.current = 0 }
    pendingPanMoveRef.current = null
  }, [])
  // Viewport culling: shapes outside the visible world rect are flipped to
  // node.visible(false) imperatively. Konva then skips both the scene and hit
  // rasterization for them, so pan/zoom frames cost ~the visible content, not
  // the whole board. react-konva never sets `visible` (it's not in our props),
  // so these flags survive React re-renders; cullStateRef tracks them to avoid
  // redundant work, and a stage remount (stageEpoch) resets the whole map.
  const cullShapes = useCallback(() => {
    const stage = stageRef.current
    const shapesArr = shapesRef.current
    if (!stage || !shapesArr.length) return
    const epoch = epochRef.current
    if (lastCullEpochRef.current !== epoch) {
      lastCullEpochRef.current = epoch
      cullStateRef.current = new Map()
    }
    const layer = stage.getLayers()[0]
    if (!layer) return
    const sx = stage.x(), sy = stage.y(), sc = stage.scaleX()
    if (!(sc > 0)) return
    const margin = 150 / sc
    const viewLeft = -sx / sc - margin
    const viewRight = (stage.width() - sx) / sc + margin
    const viewTop = -sy / sc - margin
    const viewBottom = (stage.height() - sy) / sc + margin
    const nodesMap = nodes.current
    const cull = cullStateRef.current
    const selected = stateRef.current.selectedShapeIds
    const selectedSet = selected.length ? new Set(selected) : null; let changed = false
    for (let i = 0; i < shapesArr.length; i++) {
      const shape = shapesArr[i]
      const node = nodesMap[shape.id]
      if (!node) continue
      if (selectedSet && selectedSet.has(shape.id)) {
        if (cull.get(shape.id) === false) { cull.set(shape.id, true); node.visible(true); changed = true }
        continue
      }
      let l, t, r, b
      if (shape.type === 'pen' || shape.type === 'line' || shape.type === 'arrow') {
        const box = getLineBBox(shape)
        if (!box) continue
        l = box.l; t = box.t; r = box.r; b = box.b
      } else {
        l = shape.x; t = shape.y; r = shape.x + shape.width; b = shape.y + shape.height
      }
      let visible
      if (shape.rotation) {
        // Rotated shapes are culled with their bounding circle (conservative).
        const radius = Math.hypot(r - l, b - t) / 2
        const cx = (l + r) / 2, cy = (t + b) / 2
        visible = cx + radius >= viewLeft && cx - radius <= viewRight && cy + radius >= viewTop && cy - radius <= viewBottom
      } else {
        visible = r >= viewLeft && l <= viewRight && b >= viewTop && t <= viewBottom
      }
      if (cull.get(shape.id) !== visible) { cull.set(shape.id, visible); node.visible(visible); changed = true }
    }
    if (changed) layer.batchDraw()
  }, [])
  const requestCull = useCallback(() => {
    if (cullRafRef.current) return
    cullRafRef.current = requestAnimationFrame(() => {
      cullRafRef.current = 0
      cullShapes()
    })
  }, [cullShapes])

  // WHEEL ZOOM: wheel zooms around the pointer, clamped to the viewport scale
  // range. It only changes the viewport; shapes and history remain untouched.

  const handleWheel = useCallback(event => {
    const native = event.evt
    native.preventDefault()

    const stage = stageRef.current
    if (!stage) return
    const point = stage.getPointerPosition()
    if (!point) return
    const unit = native.deltaMode === 1 ? 16 : native.deltaMode === 2 ? 100 : 1
    const dy = (native.deltaY || 0) * unit
    const delta = Math.max(-4, Math.min(4, -dy / 60))
    if (delta === 0) return
    const current = viewRef2.current
    const nextScale = clampScale(current.scale * (1 + delta * 0.1))
    if (nextScale === current.scale) return
    setView(zoomAtPoint(point, current, nextScale))
    requestCull()
  }, [])
  const abort = () => {
    if (panMoveRafRef.current) { cancelAnimationFrame(panMoveRafRef.current); panMoveRafRef.current = 0 } pendingPanMoveRef.current = null; lastPanPointRef.current = null; if (cursorRafRef.current) { cancelAnimationFrame(cursorRafRef.current); cursorRafRef.current = 0 }
    if (panMoveHandlerRef.current) { panMoveHandlerRef.current(); panMoveHandlerRef.current = null }
    const gesture = dragGesture.current
    if (gesture) gesture.ids.forEach(id => { const node = nodes.current[id], initial = gesture.nodePositions[id]; if (node && initial) node.position(initial) })
    if (pointerMoveRafRef.current) { cancelAnimationFrame(pointerMoveRafRef.current); pointerMoveRafRef.current = 0 } pendingPointerMoveRef.current = null; if (dragMoveRafRef.current) { cancelAnimationFrame(dragMoveRafRef.current); dragMoveRafRef.current = 0 } pendingDragMoveRef.current = null; dragGesture.current = null; start.current = null; panStart.current = null; penPointsRef.current = null; draftNodeRef.current = null; activePointer.current = null
    if (draftRef.current) updateDraft(null)
    marqueeStart.current = null
    marqueeRef.current = null
    setMarquee(null)
    updateLaser(null)

    setHitGraph(true)
    interactionRef.current = initialInteraction; dispatchInteraction({ type: 'RESET' })
  }
  abortRef.current = abort
  useEffect(() => {
    let resizeRaf = 0
    const resize = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        const rect = hostRef.current?.getBoundingClientRect()
        const width = Math.round(rect?.width || window.innerWidth)
        const height = Math.round(rect?.height || window.innerHeight)
        setSize(prev => prev.width === width && prev.height === height ? prev : { width, height })
      })
    }
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    if (observer && hostRef.current) observer.observe(hostRef.current)
    if (!observer) window.addEventListener('resize', resize)
    resize()
    const blur = () => { abort() }
    const end = e => { if (interactionRef.current.mode === 'idle') return; const pid = Number.isFinite(e?.pointerId) ? e.pointerId : null; if (pid !== null && activePointer.current !== null && activePointer.current !== pid) return; abort() }
    addEventListener('blur', blur); addEventListener('pointerup', end); addEventListener('pointercancel', end); addEventListener('touchend', end); if (NO_POINTER) addEventListener('mouseup', end)
    return () => { if (observer) observer.disconnect(); else window.removeEventListener('resize', resize); removeEventListener('blur', blur); removeEventListener('pointerup', end); removeEventListener('pointercancel', end); removeEventListener('touchend', end); if (NO_POINTER) removeEventListener('mouseup', end) }
  }, [])
  useEffect(() => {
    const onError = event => {
      const message = event?.message || ''
      if (!/indexsize|maximum call stack|notenougharguments|context.*(save|restore)|konva.*context|canvas.*(transform|clip|restore)/i.test(message)) return
      const now = Date.now()
      if (now - lastCanvasRecovery.current < 500) return
      lastCanvasRecovery.current = now
      abort()
      setStageEpoch(epoch => epoch + 1)
    }
    addEventListener('error', onError)
    return () => removeEventListener('error', onError)
  }, [])
  useEffect(() => {
    if (state.activeTool !== 'pan' && panStart.current) abortRef.current()
  }, [state.activeTool])
  useEffect(() => {
    // When the display's device pixel ratio changes (window moved between monitors),
    // Konva canvases keep their old backing scale and go blurry. Recreate the stage
    // with the new ratio so Chrome/Edge/Firefox/Safari stay crisp.
    if (typeof window.matchMedia !== 'function' || typeof window.devicePixelRatio !== 'number') return
    const mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    const onChange = () => { Konva.pixelRatio = window.devicePixelRatio || 1; setStageEpoch(epoch => epoch + 1) }
    if (mql.addEventListener) mql.addEventListener('change', onChange)
    else if (mql.addListener) mql.addListener(onChange)
    return () => { if (mql.removeEventListener) mql.removeEventListener('change', onChange); else if (mql.removeListener) mql.removeListener(onChange) }
  }, [])
  useEffect(() => { const container = stageRef.current?.container(); if (!container) return; const leave = e => { if (e.buttons === 0 && (panStart.current || start.current || draftRef.current)) abort(); if (stateRef.current.activeTool === 'eraser') setEraserSquare(null) }; container.addEventListener('pointerleave', leave); return () => container.removeEventListener('pointerleave', leave) }, [])
  useEffect(() => { if (!editing) return; const frame = requestAnimationFrame(() => editorRef.current?.focus()); return () => cancelAnimationFrame(frame) }, [editing])
  useEffect(() => {
    try {
      const selected = state.selectedShapeIds.map(id => { const shape = shapesRef.current.find(item => item.id === id); const node = nodes.current[id]; return shape?.locked ? null : node }).filter(node => node && !node.isDestroyed?.())
      transformer.current?.nodes(selected)
      transformer.current?.getLayer()?.batchDraw()
    } catch (_e) {
      abort()
    }
  }, [state.selectedShapeIds, shapes])
  useEffect(() => { const live = new Set(shapes.map(shape => shape.id)); const pruned = state.selectedShapeIds.filter(id => live.has(id)); if (pruned.length !== state.selectedShapeIds.length) dispatch({ type: 'SET_SELECTION', ids: pruned }) }, [shapes])
  useEffect(() => { const liveIds = new Set(shapes.map(shape => shape.id)); Object.keys(refCallbacks.current).forEach(id => { if (!liveIds.has(id)) { delete refCallbacks.current[id]; delete nodes.current[id] } }); _bboxCache.forEach((_, id) => { if (!liveIds.has(id)) _bboxCache.delete(id) }); cullStateRef.current.forEach((_, id) => { if (!liveIds.has(id)) cullStateRef.current.delete(id) }) }, [shapes])
  // After any commit / zoom / remount, drop offscreen shapes before paint so the
  // frame only rasterizes the visible world. Continuous pointer pan and wheel
  // pan already request their own culls per animation frame.
  useLayoutEffect(() => { cullShapes() }, [view, shapes, stageEpoch])
  useEffect(() => () => {
    laserTimersRef.current.forEach(timer => clearTimeout(timer))
    laserRafsRef.current.forEach(raf => cancelAnimationFrame(raf))
    laserTimersRef.current.clear()
    laserRafsRef.current.clear()
    laserStrokesRef.current = []
    nodes.current = {}; refCallbacks.current = {}
    if (cullRafRef.current) { cancelAnimationFrame(cullRafRef.current) }
  }, [])
  useEffect(() => () => {
    if (pointerMoveRafRef.current) cancelAnimationFrame(pointerMoveRafRef.current)
    if (dragMoveRafRef.current) cancelAnimationFrame(dragMoveRafRef.current)
    if (panMoveRafRef.current) cancelAnimationFrame(panMoveRafRef.current)
    if (cursorRafRef.current) cancelAnimationFrame(cursorRafRef.current)
    if (cullRafRef.current) cancelAnimationFrame(cullRafRef.current)
    if (panMoveHandlerRef.current) { panMoveHandlerRef.current(); panMoveHandlerRef.current = null }
    pendingPointerMoveRef.current = null; pendingDragMoveRef.current = null; pendingPanMoveRef.current = null
  }, []); const toolCursor = () => interaction.mode === 'panning' ? 'grabbing' : state.activeTool === 'pan' ? 'grab' : state.activeTool === 'select' ? 'default' : state.activeTool === 'text' ? 'text' : state.activeTool === 'eraser' ? 'none' : 'crosshair'
  // True when the pointer target sits on (or inside) the selection Transformer.
  const isOnTransformer = node => { let n = node; while (n) { if (n.className === 'Transformer') return true; n = n.getParent ? n.getParent() : null } return false }
  // Map a Transformer anchor name to its directional resize cursor.
  const anchorCursor = node => { const name = node && node.name ? node.name() : ''; return ({ 'top-left': 'nwse-resize', 'bottom-right': 'nwse-resize', 'top-right': 'nesw-resize', 'bottom-left': 'nesw-resize', 'top-center': 'ns-resize', 'bottom-center': 'ns-resize', 'middle-left': 'ew-resize', 'middle-right': 'ew-resize' })[name] || null }
  // Single source of truth for the stage cursor given the node under the pointer.
  const computeCursorFor = target => {
    if (state.activeTool === 'eraser') return 'none'
    if (state.activeTool === 'pan' || interactionRef.current.mode === 'panning') return toolCursor()
    if (state.activeTool !== 'select') return toolCursor()
    if (isOnTransformer(target)) return anchorCursor(target) || 'move'
    if (target && target.getAttr && target.getAttr('shapeId')) return 'move'
    return 'default'
  }
  useEffect(() => {
    const stage = stageRef.current
    const container = stage && stage.container()
    if (!container) return
    const p = stage.getPointerPosition()
    const target = p ? stage.getIntersection(p) : null
    container.style.cursor = computeCursorFor(target)
  }, [state.activeTool, interaction.mode])
  useEffect(() => { abort(); setEraserSquare(null) }, [state.activeTool])
  const cursorRafRef = useRef(0)
  const onStageMouseMove = event => {
    if (cursorRafRef.current) return
    const container = stageRef.current && stageRef.current.container()
    cursorRafRef.current = requestAnimationFrame(() => {
      cursorRafRef.current = 0
      if (!container) return
      const stage = stageRef.current
      if (!stage) return
      if (state.activeTool === 'eraser') {
        const p = stage.getPointerPosition()
        if (p) {
          const v = viewRef2.current
          setEraserSquare({ x: (p.x - v.x) / v.scale, y: (p.y - v.y) / v.scale, size: eraserWorldSize() })
        }
        container.style.cursor = 'none'
        return
      }
      setEraserSquare(null)
      if (state.activeTool === 'pan' || interactionRef.current.mode === 'panning') {
        container.style.cursor = toolCursor()
        return
      }
      if (onCursorMove) {
        const p = stage.getPointerPosition()
        if (p) {
          const v = viewRef2.current
          onCursorMove({ x: (p.x - v.x) / v.scale, y: (p.y - v.y) / v.scale })
        }
      }
      const target = event.target
      container.style.cursor = computeCursorFor(target)
    })
  }

  const point = () => { const p = stageRef.current.getPointerPosition(); if (!p) return null; return { x: (p.x - view.x) / view.scale, y: (p.y - view.y) / view.scale } }
  const handleImageDrop = event => {
    event.preventDefault()
    const file = event.dataTransfer?.files?.[0]
    if (!file || !onImageDrop) return
    Promise.resolve(onImageDrop(file)).catch(error => {
      const message = typeof error?.message === 'string' && error.message.trim()
        ? error.message
        : 'Image upload failed — This file isn’t supported or couldn’t be processed. Try another image.'
      onUserMessage?.(message.includes('Use a PNG, JPG, SVG, or WEBP image.') || message.includes('image')
        ? 'Image upload failed — This file isn’t supported or couldn’t be processed. Try another image.'
        : message)
    })
  }

  const targetShapeId = target => target?.getAttr('shapeId') || null
  const isTransformerTarget = target => { let node = target; while (node && node !== transformer.current) node = node.parent; return !!node }

  // finishText: commits the current edit. Editing an existing shape down to
  // an empty string deletes it (matches Excalidraw) rather than silently
  // keeping the old text. A brand-new, never-typed-into text is discarded.
  // The freshly committed/edited text is selected so its handles appear
  // immediately, with no extra click needed.
  const finishText = () => {
    const current = editingRef.current
    if (!current) return
    editingRef.current = null
    // Do not trim: spaces, line breaks, Unicode, and punctuation are user data.
    const text = current.value
    if (current.id) {
      if (text.trim()) {
        commit(prev => prev.map(s => s.id === current.id ? { ...s, text, width: current.width, height: current.height, fontSize: current.fontSize } : s))
        dispatch({ type: 'SET_SELECTION', ids: [current.id] })
      } else {
        commit(prev => prev.filter(s => s.id !== current.id))
        dispatch({ type: 'SET_SELECTION', ids: [] })
      }
    } else if (text.trim().length > 0) {
      const id = newId()
      commit(prev => [...prev, { id, type: 'text', x: current.x, y: current.y, width: current.width, height: current.height, text, ...stateRef.current.activeStyle, fontSize: current.fontSize, stroke: current.stroke }])
      dispatch({ type: 'SET_SELECTION', ids: [id] })
      dispatch({ type: 'SET_TOOL', tool: 'select' })
    }
    setEditing(null)
    lastTextCommitRef.current = Date.now()
  }

  const selectShape = (id, event) => {
    const ids = stateRef.current.selectedShapeIds
    let nextSel = ids.includes(id) ? ids : [id]
    if (event.evt.shiftKey) nextSel = ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id]
    dragSelection.current = nextSel
    dispatch({ type: 'SET_SELECTION', ids: nextSel })
    if (stateRef.current.activeTool !== 'select' && stateRef.current.activeTool !== 'pan') dispatch({ type: 'SET_TOOL', tool: 'select' })
  }
  const updateMarquee = p => {
    const startPoint = marqueeStart.current
    if (!startPoint || !p) return
    const next = { x: Math.min(startPoint.x, p.x), y: Math.min(startPoint.y, p.y), width: Math.abs(p.x - startPoint.x), height: Math.abs(p.y - startPoint.y) }
    marqueeRef.current = next
    setMarquee(next)
  }
  const finishMarquee = event => {
    const box = marqueeRef.current
    const hasArea = box && box.width > 4 && box.height > 4
    if (hasArea) {
      const ids = shapesRef.current.filter(shape => { const bounds = getShapeBounds(shape); return bounds.l >= box.x && bounds.t >= box.y && bounds.r <= box.x + box.width && bounds.b <= box.y + box.height }).map(shape => shape.id)
      const next = event.evt.shiftKey ? [...new Set([...stateRef.current.selectedShapeIds, ...ids])] : ids
      dragSelection.current = next
      dispatch({ type: 'SET_SELECTION', ids: next })
    } else if (!event.evt.shiftKey) dispatch({ type: 'SET_SELECTION', ids: [] })
    marqueeStart.current = null
    marqueeRef.current = null
    setMarquee(null)
  }

  const down = event => {
    try {
      const pid = Number.isFinite(event.evt?.pointerId) ? event.evt.pointerId : null
      if (panStart.current || start.current || draftRef.current) {
        if (pid === null || activePointer.current === pid) abort()
        else return
      }
      if (stateRef.current.activeTool === 'pan' || spacePanRef.current) {
        event.evt.preventDefault();
        panStart.current = { px: event.evt.clientX, py: event.evt.clientY, view: { ...viewRef2.current } }
        if (pid !== null) activePointer.current = pid
        setHitGraph(false)
        startInteraction('panning')
        if (!panMoveHandlerRef.current) {
          panMoveHandlerRef.current = addEventListenerOnce(window, 'pointermove', handlePanMove)
        }
        return
      }
      if (isTransformerTarget(event.target) && !['line', 'arrow'].includes(stateRef.current.activeTool)) { event.cancelBubble = true; return }

      // Any stage click while a text editor is open finishes it and keeps the
      // committed text. The dismiss click itself won't spawn a second empty
      // box, so you need one extra click (like Excalidraw) to add another box.
      const wasEditing = !!editingRef.current
      if (editingRef.current) finishText()
      const id = targetShapeId(event.target)
      const activeTool = stateRef.current.activeTool
      if (activeTool === 'eraser') {
        const p = point()
        if (!p) return
        if (pid !== null) activePointer.current = pid
        start.current = p
        startInteraction('erasing')
        // Keep the hit graph LIVE while erasing — the precise eraseAt below
        // relies on stage.getIntersection to test each shape's real geometry,
        // so the layer must stay listening (drawing=false) throughout.
        setHitGraph(true)
        erasedIdsRef.current = new Set()
        setErasedLive(new Set())
        setEraserSquare({ x: p.x, y: p.y, size: eraserWorldSize() })
        eraseAt(p)
        return
      }

      // The Select tool selects an existing shape (or starts a marquee on
      // empty canvas). Every drawing tool instead always starts a fresh shape,
      // even when the pointer is over an existing one, so overlapping/rapid
      // creation works.
      if (stateRef.current.activeTool === 'select') {
        if (id) { selectShape(id, event); return }
        if (event.target === event.target.getStage()) {
          if (!isTransformerTarget(event.target)) {
            abort()
            const startPoint = point()
            if (startPoint) { marqueeStart.current = startPoint; marqueeRef.current = null; setMarquee(null); if (!event.evt.shiftKey) dispatch({ type: 'SET_SELECTION', ids: [] }); startInteraction('marquee') }
          }
        }
        return
      }

      const p = point()
      if (!p) return
      if (stateRef.current.activeTool === 'text') {
        // A prior text edit was open and just got committed (either above via
        // finishText(), or by the textarea's onBlur which fires before this
        // pointerdown). Don't immediately open a fresh empty box at the
        // dismissing click — the user needs a fresh click to add another box.
        if (wasEditing || Date.now() - lastTextCommitRef.current < 400) return
        const fontSize = stateRef.current.activeStyle.fontSize || 20
        const box = measureTextBox('', fontSize)
        setEditing({ ...p, value: '', fontSize, stroke: stateRef.current.activeStyle.stroke, width: box.width, height: box.height })
        return
      }
      start.current = p; if (pid !== null) activePointer.current = pid; draftEndRef.current = p; setHitGraph(false); startInteraction('drawing')
      if (stateRef.current.activeTool === 'laser') { updateLaser({ points: [p.x, p.y], opacity: .8 }); return }
      const base = { id: newId(), type: stateRef.current.activeTool, ...stateRef.current.activeStyle, x: p.x, y: p.y }
      if (['rectangle', 'ellipse', 'diamond'].includes(base.type)) { base.width = 0; base.height = 0 }

      if (['arrow', 'line', 'pen'].includes(base.type)) base.points = [0, 0]
      if (base.type === 'pen') penPointsRef.current = base.points
      updateDraft(base)
    } catch (_e) { abort() }
  }
  const applyPointerMove = event => {
    try {
      const pid = Number.isFinite(event.evt?.pointerId) ? event.evt.pointerId : null
      if (activePointer.current !== null && activePointer.current !== pid) return
      if (panStart.current) return
      let p = point()
      if (!p) return
      if (marqueeStart.current) { updateMarquee(p); return }
      if (!start.current) return

      if (event.evt.shiftKey && ['line', 'arrow'].includes(stateRef.current.activeTool)) { const dx = p.x - start.current.x, dy = p.y - start.current.y, angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * Math.PI / 4, distance = Math.hypot(dx, dy); p = { x: start.current.x + Math.cos(angle) * distance, y: start.current.y + Math.sin(angle) * distance } }
      if (stateRef.current.activeTool === 'laser') { const cur = laserRef.current; if (!cur) return; cur.points.push(p.x, p.y); const node = laserNodeRef.current; if (node) { node.getChildren().forEach(child => child.points(cur.points)); node.getLayer()?.batchDraw() } return }
      if (stateRef.current.activeTool === 'eraser') { setEraserSquare({ x: p.x, y: p.y, size: eraserWorldSize() }); eraseAt(p); return }
      const current = draftRef.current; if (!current) return
      const node = draftNodeRef.current
      if (current.type === 'pen') { const pts = penPointsRef.current || current.points, lastX = pts[pts.length - 2], lastY = pts[pts.length - 1], nx = p.x - current.x, ny = p.y - current.y; if (pts.length < 100000 && (nx - lastX) * (nx - lastX) + (ny - lastY) * (ny - lastY) >= 1) { pts.push(nx, ny); if (node) { node.points(pts); node.getLayer()?.batchDraw() } } }
      else if (current.type === 'arrow' || current.type === 'line') { current.points[2] = p.x - current.x; current.points[3] = p.y - current.y; if (node) { node.points(current.points); node.getLayer()?.batchDraw() } }
      else { const box = normalizeBox({ x: current.x, y: current.y, width: p.x - current.x, height: p.y - current.y }); draftEndRef.current = p; if (node) { if (current.type === 'diamond') { node.position({ x: box.x, y: box.y }); node.points([box.width / 2, 0, box.width, box.height / 2, box.width / 2, box.height, 0, box.height / 2]) } else { node.position(current.type === 'ellipse' ? { x: box.x + box.width / 2, y: box.y + box.height / 2 } : { x: box.x, y: box.y }); node.size({ width: box.width, height: box.height }) } node.getLayer()?.batchDraw() } }

    } catch (_e) { abort() }
  }
  const flushPointerMove = () => { if (pointerMoveRafRef.current) { cancelAnimationFrame(pointerMoveRafRef.current); pointerMoveRafRef.current = 0 } const pending = pendingPointerMoveRef.current; pendingPointerMoveRef.current = null; if (pending) applyPointerMove(pending) }; const move = event => { try { const pid = Number.isFinite(event.evt?.pointerId) ? event.evt.pointerId : null; if (activePointer.current !== null && activePointer.current !== pid) return; if (panStart.current || (!start.current && !marqueeStart.current)) return; pendingPointerMoveRef.current = event; if (pointerMoveRafRef.current) return; pointerMoveRafRef.current = requestAnimationFrame(() => { pointerMoveRafRef.current = 0; const pending = pendingPointerMoveRef.current; pendingPointerMoveRef.current = null; if (pending) applyPointerMove(pending) }) } catch (_e) { abort() } }; const up = event => {
    flushPointerMove();
    try {
      const pid = Number.isFinite(event?.evt?.pointerId) ? event.evt.pointerId : null
      if (activePointer.current !== null && pid !== null && activePointer.current !== pid) return
      activePointer.current = null
      if (interactionRef.current.mode === 'erasing') { const ids = erasedIdsRef.current; if (ids && ids.size) commit(prev => prev.filter(s => !ids.has(s.id))); erasedIdsRef.current = new Set(); setErasedLive(new Set()); start.current = null; return }
      if (marqueeStart.current) { finishMarquee(event); setHitGraph(true); interactionRef.current = initialInteraction; dispatchInteraction({ type: 'END' }); return }
      if (panStart.current) { flushPanMove(); window.removeEventListener('pointermove', handlePanMove); panStart.current = null; lastPanPointRef.current = null; activePointer.current = null; setHitGraph(true); interactionRef.current = initialInteraction; dispatchInteraction({ type: 'END' }); return }

      if (laserRef.current) {
        scheduleLaserStroke(laserRef.current.points)
        laserRef.current = null
        updateLaser(null)
        start.current = null
        return
      }
      const current = draftRef.current
      if (current) { let completed; if (isPointShape(current.type)) { completed = { ...current, points: current.points.slice() } } else { const end = draftEndRef.current || current; completed = { ...current, ...normalizeBox({ x: current.x, y: current.y, width: end.x - current.x, height: end.y - current.y }) } } const points = completed.points || []; const pointDistance = points.length >= 4 ? Math.hypot(points[2] - points[0], points[3] - points[1]) : 0; const valid = current.type === 'line' || current.type === 'arrow' ? pointDistance > MIN_SIZE : current.type === 'pen' ? points.length > 3 : completed.width > MIN_SIZE && completed.height > MIN_SIZE; if (valid) { commit(prev => { const created = completed.type === 'arrow' ? bindArrowEndpoints(completed, prev) : completed; return [...prev, created] }); if (['rectangle', 'ellipse', 'diamond', 'line', 'arrow', 'pen'].includes(completed.type)) { dispatch({ type: 'SET_SELECTION', ids: [completed.id] }); dispatch({ type: 'SET_TOOL', tool: 'select' }) } } updateDraft(null) }

      draftEndRef.current = null; penPointsRef.current = null; draftNodeRef.current = null
      start.current = null
    } catch (_e) { abort() } finally { setHitGraph(true); interactionRef.current = initialInteraction; dispatchInteraction({ type: 'END' }) }
  }

  const transformedShape = (shape, node) => {
    const rawScaleX = node.scaleX(), rawScaleY = node.scaleY(), scaleX = Math.abs(rawScaleX), scaleY = Math.abs(rawScaleY), rotation = node.rotation()
    if (shape.type === 'image') { const width = Math.max(20, shape.width * scaleX), height = Math.max(20, shape.height * scaleY), flipX = rawScaleX < 0, flipY = rawScaleY < 0; node.scaleX(flipX ? -1 : 1); node.scaleY(flipY ? -1 : 1); return { ...shape, x: node.x() - (flipX ? width : 0), y: node.y() - (flipY ? height : 0), width, height, rotation, flipX, flipY } }
    node.scaleX(1); node.scaleY(1)
    if (shape.type === 'ellipse') { const width = Math.max(MIN_SIZE, shape.width * scaleX), height = Math.max(MIN_SIZE, shape.height * scaleY); return { ...shape, x: node.x() - width / 2, y: node.y() - height / 2, width, height, rotation } }
    if (shape.type === 'diamond') { const width = Math.max(MIN_SIZE, shape.width * scaleX), height = Math.max(MIN_SIZE, shape.height * scaleY); return { ...shape, x: node.x(), y: node.y(), width, height, rotation } }

    if (shape.type === 'rectangle') { const width = Math.max(MIN_SIZE, shape.width * scaleX); const height = Math.max(MIN_SIZE, shape.height * scaleY); return { ...shape, x: node.x(), y: node.y(), width, height, rotation } }
    if (shape.type === 'text') {
      // Text resizes uniformly (font size), not independently in width/height —
      // matches Excalidraw's corner-only text resize behavior.
      const uniformScale = Math.max(scaleX, scaleY)
      const fontSize = Math.max(8, Math.round((shape.fontSize || 20) * uniformScale))
      const box = measureTextBox(shape.text, fontSize)
      return { ...shape, x: node.x(), y: node.y(), width: box.width, height: box.height, rotation, fontSize }
    }
    if (isPointShape(shape.type)) { const points = shape.points.map((value, index) => value * (index % 2 ? scaleY : scaleX)); return { ...shape, x: node.x(), y: node.y(), points, rotation } }
    return shape
  }
  const commitTransform = useCallback((shape, node) => {
    commit(prev => updateBoundArrows(prev.map(sh => sh.id === shape.id && !sh.locked ? transformedShape(sh, node) : sh)))
  }, [commit])

  const handleDragEnd = useCallback((shape) => {
    const gesture = dragGesture.current
    if (!gesture || gesture.primaryId !== shape.id) return
    const node = nodes.current[shape.id]
    if (!node) return
    const offset = shape.type === 'ellipse' ? { x: shape.width / 2, y: shape.height / 2 } : { x: shape.type === 'image' && shape.flipX ? shape.width : 0, y: shape.type === 'image' && shape.flipY ? shape.height : 0 }
    const snapped = snapToGrid(node.x() - offset.x, node.y() - offset.y)
    const delta = { x: snapped.x - gesture.positions[shape.id].x, y: snapped.y - gesture.positions[shape.id].y }
    const selected = new Set(gesture.ids)
    commit(prev => updateBoundArrows(prev.map(item => selected.has(item.id) && !item.locked ? { ...item, x: gesture.positions[item.id].x + delta.x, y: gesture.positions[item.id].y + delta.y } : item)))

  }, [commit])

  // handleEdit: double-click entry point into text editing (kept distinct
  // from single-click selection, which already runs generically through
  // selectShape() in down()). Clears selection while editing so the
  // Transformer never fights with an active text cursor; locked text can't
  // be edited, matching how locked shapes already can't be dragged/resized.
  const handleEdit = useCallback((shape) => {
    if (shape.type !== 'text' || shape.locked) return
    dispatch({ type: 'SET_SELECTION', ids: [] })
    const fontSize = shape.fontSize || 20
    const box = measureTextBox(shape.text, fontSize)
    setEditing({ id: shape.id, x: shape.x, y: shape.y, value: shape.text, fontSize, stroke: shape.stroke, width: Math.max(box.width, shape.width || 0), height: Math.max(box.height, shape.height || 0) })
  }, [dispatch])
  // When a text shape is selected the Transformer sits on top of it, so native
  // dblclick never reaches the Text node itself. Catch the Transformer's own
  // dblclick and forward it so double-click always re-opens the text editor.
  const handleTransformerDblClick = useCallback(() => {
    const ids = stateRef.current.selectedShapeIds
    if (ids.length !== 1) return
    const shape = shapesRef.current.find(item => item.id === ids[0])
    if (shape && shape.type === 'text') handleEdit(shape)
  }, [handleEdit])
  const handleStageDragStart = event => {
    const primaryId = targetShapeId(event.target)
    if (!primaryId) return
    const ids = [...new Set(dragSelection.current.includes(primaryId) ? dragSelection.current : [primaryId])]
    const positions = {}; const nodePositions = {}
    shapesRef.current.forEach(shape => { if (ids.includes(shape.id) && !shape.locked) positions[shape.id] = { x: shape.x, y: shape.y } })
    ids.forEach(id => { const node = nodes.current[id]; if (node) nodePositions[id] = { x: node.x(), y: node.y() } })
    dragGesture.current = { primaryId, ids: ids.filter(id => positions[id] && nodePositions[id]), positions, nodePositions, altDuplicate: Boolean(event.evt?.altKey) }

    setHitGraph(false)
    startInteraction('dragging')
  }
  const applyStageDragMove = event => {
    const gesture = dragGesture.current
    if (!gesture || targetShapeId(event.target) !== gesture.primaryId) return
    const primaryStart = gesture.nodePositions[gesture.primaryId]
    if (!primaryStart) return
    const dx = event.target.x() - primaryStart.x, dy = event.target.y() - primaryStart.y
    gesture.ids.forEach(id => { if (id !== gesture.primaryId) { const node = nodes.current[id], initial = gesture.nodePositions[id]; if (node && initial) node.position({ x: initial.x + dx, y: initial.y + dy }) } })
    // Snap guides
    const shapesArr = shapesRef.current
    const selectedSet = new Set(gesture.ids)
    const primaryShape = shapesArr.find(s => s.id === gesture.primaryId)
    if (primaryShape) {
      const bx = event.target.x() - (primaryShape.width || 0) / 2, by = event.target.y() - (primaryShape.height || 0) / 2, bw = primaryShape.width || 0, bh = primaryShape.height || 0
      const others = shapesArr.filter(s => !selectedSet.has(s.id)).map(s => ({ x: s.x, y: s.y, width: s.width, height: s.height }))
      const result = getSnapGuides({ x: bx, y: by, width: bw, height: bh }, others, 6 / view.scale)
      if (result.snapped.x != null) gesture.ids.forEach(id => { const node = nodes.current[id]; if (node) node.x(node.x() + result.snapped.x) })
      if (result.snapped.y != null) gesture.ids.forEach(id => { const node = nodes.current[id]; if (node) node.y(node.y() + result.snapped.y) })
      setSnapGuides(result.guides.length ? result.guides : null)
    }
    requestCull()
  }
  const flushStageDragMove = () => { if (dragMoveRafRef.current) { cancelAnimationFrame(dragMoveRafRef.current); dragMoveRafRef.current = 0 } const pending = pendingDragMoveRef.current; pendingDragMoveRef.current = null; if (pending) applyStageDragMove(pending) }; const handleStageDragMove = event => { const gesture = dragGesture.current; if (!gesture || targetShapeId(event.target) !== gesture.primaryId) return; pendingDragMoveRef.current = event; if (dragMoveRafRef.current) return; dragMoveRafRef.current = requestAnimationFrame(() => { dragMoveRafRef.current = 0; const pending = pendingDragMoveRef.current; pendingDragMoveRef.current = null; if (pending) applyStageDragMove(pending) }) }; const handleAltDuplicate = useCallback((shape) => {
    const gesture = dragGesture.current
    if (!gesture || gesture.primaryId !== shape.id) return
    const node = nodes.current[shape.id]
    if (!node) return
    const offset = shape.type === 'ellipse' ? { x: shape.width / 2, y: shape.height / 2 } : { x: shape.type === 'image' && shape.flipX ? shape.width : 0, y: shape.type === 'image' && shape.flipY ? shape.height : 0 }
    const snapped = snapToGrid(node.x() - offset.x, node.y() - offset.y)
    const primaryStart = gesture.positions[shape.id]
    const delta = { x: snapped.x - primaryStart.x, y: snapped.y - primaryStart.y }
    const selected = new Set(gesture.ids)
    const copies = shapesRef.current.filter(item => selected.has(item.id)).map(item => ({ ...item, id: newId(), x: item.x + delta.x, y: item.y + delta.y, locked: false }))
    if (!copies.length) return
    commit(prev => [...prev, ...copies])
    dispatch({ type: 'SET_SELECTION', ids: copies.map(item => item.id) })
  }, [commit, dispatch])
  const handleStageDragEnd = event => {
    flushStageDragMove();

    try {
      const shape = shapesRef.current.find(item => item.id === targetShapeId(event.target))
      if (shape && !shape.locked) { if (dragGesture.current?.altDuplicate) handleAltDuplicate(shape); else handleDragEnd(shape) }

    } catch (_e) { abort() } finally { dragGesture.current = null; setHitGraph(true); setSnapGuides(null); interactionRef.current = initialInteraction; dispatchInteraction({ type: 'END' }) }
  }
  const handleStageTransformStart = () => { setHitGraph(false); startInteraction('resizing') }
  const handleStageTransformEnd = event => {
    try {
      const targetNode = targetShapeId(event.target) ? event.target : event.target?.nodes?.()[0]
      const shape = shapesRef.current.find(item => item.id === targetShapeId(targetNode))
      if (shape && !shape.locked && targetNode) {
        const ids = stateRef.current.selectedShapeIds
        if (ids.length > 1) {
          const selected = new Set(ids)
          commit(prev => updateBoundArrows(prev.map(item => { const node = nodes.current[item.id]; return selected.has(item.id) && node && !item.locked ? transformedShape(item, node) : item })))
        } else commitTransform(shape, targetNode)
      }
    } catch (_e) { abort() } finally { setHitGraph(true); interactionRef.current = initialInteraction; dispatchInteraction({ type: 'END' }) }
  }

  const refFor = useCallback(id => refCallbacks.current[id] || (refCallbacks.current[id] = node => { if (node) nodes.current[id] = node; else delete nodes.current[id] }), [])
  const selectedImages = state.selectedShapeIds.filter(id => shapesRef.current.find(shape => shape.id === id)?.type === 'image')
  const minTransformSize = selectedImages.length ? 20 : 8
  // Text gets corner-only resize handles (uniform font scaling); every other
  // shape keeps the full 8-handle set.
  const selectedForAnchors = state.selectedShapeIds.map(id => shapesRef.current.find(shape => shape.id === id)).filter(Boolean)
  const soleTextSelected = selectedForAnchors.length === 1 && selectedForAnchors[0].type === 'text'
  const transformerAnchors = soleTextSelected
    ? ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    : ['top-left', 'top-center', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right']
  // On browsers without Pointer Events (Safari <13.1 / iOS <13) Konva fires mouse/touch
  // events instead of pointer events; the handlers accept those too (pointerId stays null).
  const inputProps = NO_POINTER
    ? {
      onMouseDown: down,
      onMouseMove: event => { move(event); onStageMouseMove(event) },
      onMouseUp: up,
      onMouseLeave: event => { if (event.evt.buttons === 0) abort() },
      onTouchStart: down,
      onTouchMove: move,
      onTouchEnd: up,
      onTouchCancel: up
    }
    : { onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up, onMouseMove: onStageMouseMove }
  return <div ref={hostRef} className="canvas-host" style={{ touchAction: 'none' }} data-interaction-mode={interaction.mode} onDragOver={event => event.preventDefault()} onDrop={handleImageDrop}><Stage key={stageEpoch} ref={stageRef} width={size.width} height={size.height} x={view.x} y={view.y} scaleX={view.scale} scaleY={view.scale} onWheel={handleWheel} draggable={false} {...inputProps} onDragStart={handleStageDragStart} onDragMove={handleStageDragMove} onDragEnd={handleStageDragEnd} onContextMenu={event => event.evt.preventDefault()}><Layer listening={state.activeTool !== 'pan'}><ShapesLayer shapes={shapes.filter(s => !erasedLive.has(s.id))} editingId={editing?.id} draggable={state.activeTool === 'select'} viewScaleRef={viewScaleRef} onEdit={handleEdit} refFor={refFor} />{draft && <Shape shape={draft} draggable={false} viewScaleRef={viewScaleRef} nodeRef={draftNodeRef} onEdit={() => { }} />}</Layer><Layer name="overlay">{laser && <LaserBeam groupRef={laserNodeRef} points={laser.points} opacity={laser.opacity ?? .8} dark={dark} />}{laserStrokes.map(stroke => { const points = trimLaserPoints(stroke.points, stroke.progress); return points.length >= 4 ? <LaserBeam key={stroke.id} points={points} opacity={Math.max(0, (1 - stroke.progress) * .8)} dark={dark} /> : null })}{snapGuides && snapGuides.map((g, i) => g.orientation === 'vertical' ? <Line key={i} listening={false} points={[g.value, 0, g.value, size.height]} stroke="#52bd6b" strokeWidth={1} dash={[4, 4]} opacity={0.7} /> : <Line key={i} listening={false} points={[0, g.value, size.width, g.value]} stroke="#52bd6b" strokeWidth={1} dash={[4, 4]} opacity={0.7} />)}{marquee && <Rect listening={false} x={marquee.x} y={marquee.y} width={marquee.width} height={marquee.height} fill="#52bd6b" opacity={0.08} stroke="#52bd6b" strokeWidth={1 / view.scale} dash={[4, 4]} />}{state.activeTool === 'eraser' && eraserSquare && <Rect listening={false} x={eraserSquare.x - eraserSquare.size / 2} y={eraserSquare.y - eraserSquare.size / 2} width={eraserSquare.size} height={eraserSquare.size} cornerRadius={2} fill="rgba(255,255,255,0.12)" stroke="#ffffff" strokeWidth={1 / view.scale} dash={[4, 3]} />}<Transformer ref={transformer} onTransformStart={handleStageTransformStart} onTransformEnd={handleStageTransformEnd} onDblClick={handleTransformerDblClick} onDblTap={handleTransformerDblClick} rotateEnabled flipEnabled shiftBehavior="inverted" boundBoxFunc={(oldBox, newBox) => ((newBox.width < minTransformSize || newBox.height < minTransformSize) && transformer.current?.getActiveAnchor() !== 'rotater' ? oldBox : newBox)} enabledAnchors={transformerAnchors} /></Layer></Stage>{shapes.length === 0 && !editing && !draft && !emptyDismissed.current && <div className="canvas-empty-wrap"><div className="canvas-empty-state"><svg className="canvas-empty-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1.5" opacity=".18" /><path d="M22 42l4-14L38 16l4 4-12 12-14 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M34 20l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M22 42l-2 6 6-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".5" /></svg><div className="canvas-empty-title">Turn your thoughts into something real.</div><div className="canvas-empty-subtitle">Start drawing — pick a tool, drag to pan, or scroll to zoom. Press ? for shortcuts.</div><div className="canvas-shortcuts"><span className="canvas-shortcut"><kbd className="canvas-shortcut-key">V</kbd>Select</span><span className="canvas-shortcut"><kbd className="canvas-shortcut-key">R</kbd>Rectangle</span><span className="canvas-shortcut"><kbd className="canvas-shortcut-key">P</kbd>Pencil</span></div></div><div className="canvas-empty-guide"><svg className="canvas-guide-arrow" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 10 C80 10, 40 20, 20 45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" /><path d="M18 40 L20 48 L26 43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="canvas-guide-text">Pick a tool &amp; bring your idea to life!</span></div></div>}{editing && <textarea ref={editorRef} className="text-editor" style={{ position: 'fixed', left: editing.x * view.scale + view.x, top: editing.y * view.scale + view.y, width: editing.width * view.scale, height: editing.height * view.scale, minWidth: 0, minHeight: 0, maxWidth: 'none', maxHeight: 'none', fontSize: editing.fontSize * view.scale, lineHeight: TEXT_LINE_HEIGHT, fontFamily: TEXT_FONT_FAMILY, color: editing.stroke || '#1e293b', resize: 'none', boxSizing: 'border-box', overflow: 'hidden', padding: 0, border: 'none', outline: '2px solid #52bd6b', outlineOffset: '1px', background: 'transparent', zIndex: 4 }} defaultValue={editing.value} onChange={event => { const value = event.target.value; const prev = editingRef.current; if (!prev) return; const box = measureTextBox(value, prev.fontSize); const el = editorRef.current; if (el) { el.style.width = (box.width * view.scale) + 'px'; el.style.height = (box.height * view.scale) + 'px' } if (box.width !== prev.width || box.height !== prev.height) { const next = { ...prev, value, width: box.width, height: box.height }; editingRef.current = next; setEditing(next) } else { editingRef.current = { ...prev, value } } }} onBlur={finishText} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); finishText() } if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); finishText() } }} />}</div>
}
