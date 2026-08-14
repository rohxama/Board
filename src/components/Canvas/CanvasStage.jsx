import { memo, useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import Konva from 'konva'
import { Arrow, Ellipse, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva'
import { useAppState } from '../../context/AppStateContext'
import { useHistory } from '../../context/HistoryContext'
import { newId } from '../../lib/idGenerator'
import { snapToGrid, getSnapGuides } from '../../lib/snapping'
import { normalizeBox } from '../../lib/geometry'
import { useStageZoomPan } from '../../hooks/useStageZoomPan'
import { useImageAsset } from '../../hooks/useImageAsset'

const NO_POINTER = typeof window !== 'undefined' && typeof window.PointerEvent !== 'function'

const MIN_SIZE = 8
const MIN_TEXT_WIDTH = 20
const TEXT_LINE_HEIGHT = 1.25
const TEXT_FONT_FAMILY = 'Arial, sans-serif'
const dashValue = dash => dash === 'dashed' ? [10, 6] : dash === 'dotted' ? [2, 6] : []
const isPointShape = type => ['arrow', 'line', 'pen'].includes(type)
const initialInteraction = { mode: 'idle' }

// Bounding-box cache for pen/line/arrow shapes.  Each entry is keyed by
// `${id}:${pointsKey}` so it is only recomputed when the points actually change.
const _bboxCache = new Map()
function getLineBBox(shape) {
  const key = shape.id + ':' + shape.points.length + ':' + (shape.points[0]||0) + ':' + (shape.points[shape.points.length-1]||0)
  let c = _bboxCache.get(shape.id)
  if (c && c.key === key) return c.box
  const pts = shape.points; if (pts.length < 4) return null
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9
  for (let k = 0; k < pts.length; k += 2) {
    const px = shape.x + pts[k], py = shape.y + pts[k + 1]
    if (px < minX) minX = px; else if (px > maxX) maxX = px
    if (py < minY) minY = py; else if (py > maxY) maxY = py
  }
  const box = { l: minX, t: minY, r: maxX, b: maxY }
  _bboxCache.set(shape.id, { key, box })
  return box
}

// Override Stage._clearSelfAndDescendantCache to skip the O(N) recursive
// invalidation of ABSOLUTE_TRANSFORM during panning.  Children's caches stay
// dirty and recompute lazily via getAbsoluteTransform() → parent's (correctly
// updated) cache.  This eliminates the dominant per-frame cost at 1 000+ shapes.
;(function patchStagePrototype() {
  const StageProto = Konva.Stage.prototype
  const origClear = StageProto._clearSelfAndDescendantCache
  StageProto._clearSelfAndDescendantCache = function (attr) {
    if (attr === 'absoluteTransform' && !this.isCached()) {
      this._clearCache(attr)
      return
    }
    origClear.call(this, attr)
  }
})()
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
  useEffect(() => { if (image) nodeRef.current?.getLayer()?.batchDraw() }, [image])
  if (failed) {
    return <Rect id={shape.id} shapeId={shape.id} ref={nodeRef} draggable={draggable && !shape.locked} onDblClick={onEditShape} onDblTap={onEditShape} x={shape.x} y={shape.y} width={shape.width} height={shape.height} rotation={shape.rotation || 0} opacity={shape.opacity ?? 1} stroke="#dc2626" strokeWidth={1.5} dash={[5, 4]} fill="#fecaca" />
  }
  return <KonvaImage id={shape.id} shapeId={shape.id} ref={nodeRef} draggable={draggable && !shape.locked} onDblClick={onEditShape} onDblTap={onEditShape} image={image} x={shape.x + (flipX ? shape.width : 0)} y={shape.y + (flipY ? shape.height : 0)} width={shape.width} height={shape.height} scaleX={flipX ? -1 : 1} scaleY={flipY ? -1 : 1} rotation={shape.rotation || 0} opacity={shape.opacity ?? 1} imageSmoothingEnabled perfectDrawEnabled />
})

const Shape = memo(function Shape({ shape, nodeRef, onEdit, draggable = true, viewScaleRef, penNodeRef }) {
  const shapeRef = useRef(shape)
  shapeRef.current = shape
  const onEditShape = useCallback(() => onEdit(shapeRef.current), [onEdit])
  const interaction = { id: shape.id, shapeId: shape.id, ref: nodeRef, draggable: draggable && !shape.locked, onDblClick: onEditShape, onDblTap: onEditShape }
  const paint = { stroke: shape.stroke, strokeWidth: shape.strokeWidth, fill: shape.fill === 'transparent' ? undefined : shape.fill, opacity: shape.opacity, dash: dashValue(shape.dash), rotation: shape.rotation || 0 }
  const hitW = Math.max(shape.strokeWidth || 2, 16 / ((viewScaleRef?.current) || 1))
  const pointHit = { hitStrokeWidth: hitW }
  const borderHit = { hitStrokeWidth: hitW }
  const safeHit = fn => (ctx, node) => { try { fn(ctx, node) } catch (_e) {} }
  const rectHitFunc = useCallback(safeHit((ctx, node) => { ctx.beginPath(); ctx.rect(0, 0, node.width(), node.height()); ctx.strokeShape(node) }), [])
  const ellipseHitFunc = useCallback(safeHit((ctx, node) => { ctx.beginPath(); ctx.ellipse(0, 0, node.radiusX(), node.radiusY(), 0, 0, Math.PI * 2, false); ctx.strokeShape(node) }), [])
  if (shape.type === 'image') return <ImageShape shape={shape} nodeRef={nodeRef} onEdit={onEdit} draggable={draggable} />
  if (shape.type === 'rectangle') return <Rect {...interaction} {...paint} x={shape.x} y={shape.y} width={shape.width} height={shape.height} cornerRadius={shape.cornerRadius ?? 4} hitFunc={rectHitFunc} {...borderHit} />
  if (shape.type === 'ellipse') return <Ellipse {...interaction} {...paint} x={shape.x + shape.width / 2} y={shape.y + shape.height / 2} radiusX={shape.width / 2} radiusY={shape.height / 2} hitFunc={ellipseHitFunc} {...borderHit} />
  if (shape.type === 'arrow') return <Arrow {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} pointerLength={10} pointerWidth={10} fill={shape.stroke} />
  if (shape.type === 'line') return <Line {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} lineCap="round" lineJoin="round" />
  if (shape.type === 'pen') return <Line {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} lineCap="round" lineJoin="round" tension={.35} ref={penNodeRef || nodeRef} />
  return <Text {...interaction} x={shape.x} y={shape.y} text={shape.text} fontSize={shape.fontSize || 20} fontFamily={TEXT_FONT_FAMILY} lineHeight={TEXT_LINE_HEIGHT} fill={shape.stroke} opacity={shape.opacity} width={shape.width} rotation={shape.rotation || 0} draggable={draggable && !shape.locked} />
})

// The full set of committed shapes, memoized so pan-only view flushes (x/y
// change without a scale change) never rebuild the per-shape element list.
const ShapesLayer = memo(function ShapesLayer({ shapes, editingId, draggable, viewScaleRef, onEdit, refFor }) {
  return shapes.filter(shape => shape.id !== editingId).map(shape => <Shape key={shape.id} shape={shape} nodeRef={refFor(shape.id)} draggable={draggable} viewScaleRef={viewScaleRef} onEdit={onEdit} />)
})

export default function CanvasStage({ stageRef, view, setView, onCursorMove }) {
  const { state, dispatch } = useAppState()
  const { shapes, commit } = useHistory()
  const hostRef = useRef(); const nodes = useRef({}); const refCallbacks = useRef({}); const transformer = useRef(); const editorRef = useRef()
  const dragSelection = useRef([])
  const dragGesture = useRef(null)
  const shapesRef = useRef(shapes); shapesRef.current = shapes
  const stateRef = useRef(state); stateRef.current = state
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [draft, setDraft] = useState(null); const draftRef = useRef(null); const penPointsRef = useRef(null); const draftNodeRef = useRef(null); const draftEndRef = useRef(null)
  const [laser, setLaser] = useState(null); const laserRef = useRef(null); const laserNodeRef = useRef(null); const laserAnimationRef = useRef(0); const [snapGuides, setSnapGuides] = useState(null); const [editing, setEditing] = useState(null); const editingRef = useRef(null); editingRef.current = editing; const lastTextCommitRef = useRef(0)
  const viewRef2 = useRef(view); viewRef2.current = view; const viewPendingRef = useRef(null)
  const [interaction, dispatchInteraction] = useReducer(interactionReducer, initialInteraction)
  const interactionRef = useRef(initialInteraction); interactionRef.current = interaction
  const start = useRef(null); const pan = useRef(null); const space = useRef(false); const previousTool = useRef(null); const activePointer = useRef(null)
  const abortRef = useRef(null)
  const [stageEpoch, setStageEpoch] = useState(0); const lastCanvasRecovery = useRef(0); const epochRef = useRef(0); epochRef.current = stageEpoch
  const cullStateRef = useRef(new Map()); const cullRafRef = useRef(0); const lastCullEpochRef = useRef(-1)
  const wheelPanRef = useRef({ dx: 0, dy: 0, xOnly: false }); const wheelFlushRef = useRef(0)
  const viewScaleRef = useRef(view.scale); viewScaleRef.current = view.scale
  const hitGraphOn = useRef(true)
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
  useEffect(() => { window.__benchStage = stageRef.current }, [stageEpoch])

  const updateDraft = next => { draftRef.current = next; setDraft(next) }
  const updateLaser = next => { laserRef.current = next; setLaser(next) }
  const startInteraction = mode => { interactionRef.current={mode}; dispatchInteraction({type:'START',mode}) }
  const flushView = () => {
    const v = viewPendingRef.current
    viewPendingRef.current = null
    if (!v) return
    if (v.x === viewRef2.current.x && v.y === viewRef2.current.y && v.scale === viewRef2.current.scale) return
    viewRef2.current = v
    setView(v)
  }

  // Global pointermove handler for pan: tracks the pointer even when it leaves
  // the canvas, so pan position updates reliably until pointerup fires.
  const panMoveHandler = useCallback(e => {
    if (!pan.current) return
    const pid = Number.isFinite(e.pointerId) ? e.pointerId : null
    if (activePointer.current !== null && activePointer.current !== pid) return
    const origin = pan.current
    const x = origin.view.x + e.clientX - origin.x
    const y = origin.view.y + e.clientY - origin.y
    const stage = stageRef.current
    if (stage) stage.position({ x, y })
    let pending = viewPendingRef.current
    if (pending) { pending.x = x; pending.y = y }
    else { viewPendingRef.current = { ...origin.view, x, y } }
    requestCull()
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
    const selectedSet = selected.length ? new Set(selected) : null
    for (let i = 0; i < shapesArr.length; i++) {
      const shape = shapesArr[i]
      const node = nodesMap[shape.id]
      if (!node) continue
      if (selectedSet && selectedSet.has(shape.id)) {
        if (cull.get(shape.id) === false) { cull.set(shape.id, true); node.visible(true) }
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
      if (cull.get(shape.id) !== visible) { cull.set(shape.id, visible); node.visible(visible) }
    }
    layer.batchDraw()
  }, [])
  const requestCull = useCallback(() => {
    if (cullRafRef.current) return
    cullRafRef.current = requestAnimationFrame(() => {
      cullRafRef.current = 0
      cullShapes()
    })
  }, [cullShapes])

  // Wheel (non-ctrl) panning mutates the stage node immediately and only syncs
  // the React `view` state on a low-frequency heartbeat, so continuous scroll
  // doesn't re-render the tree ~60x/s on slow hardware. The stage is positioned
  // incrementally from the last committed view minus the accumulated delta, and
  // culling/drawing is coalesced per animation frame.
  const handleWheelPan = (dx, dy, xOnly) => {
    const a = wheelPanRef.current
    a.dx += dx; a.dy += dy; a.xOnly = xOnly
    const cur = viewRef2.current
    const next = xOnly ? { ...cur, x: cur.x - (a.dx || a.dy), y: cur.y } : { ...cur, x: cur.x - a.dx, y: cur.y - a.dy }
    const stage = stageRef.current
    if (stage) stage.position({ x: next.x, y: next.y })
    viewPendingRef.current = next
    requestCull()
    if (wheelFlushRef.current) return
    wheelFlushRef.current = window.setTimeout(() => {
      wheelFlushRef.current = 0
      const pending = viewPendingRef.current
      viewPendingRef.current = null
      if (!pending) return
      a.dx = 0; a.dy = 0
      if (pending.x === viewRef2.current.x && pending.y === viewRef2.current.y) return
      viewRef2.current = pending
      setView(pending)
    }, 100)
  }
  const { stageProps } = useStageZoomPan(stageRef, view, setView, handleWheelPan)
  const abort = () => {
    window.removeEventListener('pointermove', panMoveHandler)
    const gesture=dragGesture.current
    if(gesture) gesture.ids.forEach(id=>{const node=nodes.current[id],initial=gesture.nodePositions[id];if(node&&initial)node.position(initial)})
    dragGesture.current=null; start.current=null; pan.current=null; penPointsRef.current=null; draftNodeRef.current=null; activePointer.current=null; laserAnimationRef.current++
    if(draftRef.current)updateDraft(null)
    updateLaser(null)
    flushView()
    setHitGraph(true)
    interactionRef.current=initialInteraction; dispatchInteraction({type:'RESET'})
  }
  abortRef.current = abort
  useEffect(() => {
    const resize = () => {
      const rect = hostRef.current?.getBoundingClientRect()
      setSize({ width: Math.round(rect?.width || window.innerWidth), height: Math.round(rect?.height || window.innerHeight) })
    }
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    if (observer && hostRef.current) observer.observe(hostRef.current)
    if (!observer) window.addEventListener('resize', resize)
    resize()
    const releaseSpace = () => { space.current=false; const tool=previousTool.current; previousTool.current=null; if(tool)dispatch({type:'SET_TOOL',tool}) }
    const key=e=>{if(e.code!=='Space'||e.target?.tagName==='INPUT'||e.target?.tagName==='TEXTAREA')return;if(e.type==='keydown'){if(e.repeat)return;space.current=true;if(stateRef.current.activeTool!=='pan'){previousTool.current=stateRef.current.activeTool;dispatch({type:'SET_TOOL',tool:'pan'})}}else releaseSpace()}
    const blur=()=>{releaseSpace();abort()}
    const end=e=>{if(interactionRef.current.mode==='idle')return;const pid=Number.isFinite(e?.pointerId)?e.pointerId:null;if(pid!==null&&activePointer.current!==null&&activePointer.current!==pid)return;abort()}
    addEventListener('keydown',key); addEventListener('keyup',key); addEventListener('blur',blur); addEventListener('pointerup',end); addEventListener('pointercancel',end); addEventListener('touchend',end); if(NO_POINTER)addEventListener('mouseup',end)
    return()=>{if(observer)observer.disconnect();else window.removeEventListener('resize',resize);removeEventListener('keydown',key);removeEventListener('keyup',key);removeEventListener('blur',blur);removeEventListener('pointerup',end);removeEventListener('pointercancel',end);removeEventListener('touchend',end); if(NO_POINTER)removeEventListener('mouseup',end)}
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
    if (state.activeTool !== 'pan' && pan.current) abortRef.current()
  }, [state.activeTool])
  useEffect(() => {
    // When the display's device pixel ratio changes (window moved between monitors),
    // Konva canvases keep their old backing scale and go blurry. Recreate the stage
    // with the new ratio so Chrome/Edge/Firefox/Safari stay crisp.
    if (typeof window.matchMedia !== 'function' || typeof window.devicePixelRatio !== 'number') return
    const mql=window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
    const onChange=()=>{Konva.pixelRatio=window.devicePixelRatio||1;setStageEpoch(epoch=>epoch+1)}
    if(mql.addEventListener)mql.addEventListener('change',onChange)
    else if(mql.addListener)mql.addListener(onChange)
    return()=>{if(mql.removeEventListener)mql.removeEventListener('change',onChange);else if(mql.removeListener)mql.removeListener(onChange)}
  }, [])
  useEffect(() => { const container=stageRef.current?.container(); if(!container) return; const leave=e=>{if(e.buttons===0&&(pan.current||start.current||draftRef.current))abort()}; container.addEventListener('pointerleave',leave); return()=>container.removeEventListener('pointerleave',leave) }, [])
  useEffect(() => { if (!editing) return; const frame=requestAnimationFrame(()=>editorRef.current?.focus()); return()=>cancelAnimationFrame(frame) }, [editing])
  useEffect(() => {
    try {
      const selected=state.selectedShapeIds.map(id=>{const shape=shapesRef.current.find(item=>item.id===id);const node=nodes.current[id];return shape?.locked?null:node}).filter(node=>node && !node.isDestroyed?.())
      transformer.current?.nodes(selected)
      transformer.current?.getLayer()?.batchDraw()
    } catch (_e) {
      abort()
    }
  }, [state.selectedShapeIds, shapes])
  useEffect(() => { const live=new Set(shapes.map(shape=>shape.id)); const pruned=state.selectedShapeIds.filter(id=>live.has(id)); if(pruned.length!==state.selectedShapeIds.length) dispatch({type:'SET_SELECTION',ids:pruned}) }, [shapes])
  useEffect(() => { const liveIds=new Set(shapes.map(shape=>shape.id)); Object.keys(refCallbacks.current).forEach(id=>{if(!liveIds.has(id)){delete refCallbacks.current[id];delete nodes.current[id]}}) }, [shapes])
  // After any commit / zoom / remount, drop offscreen shapes before paint so the
  // frame only rasterizes the visible world. Continuous pointer pan and wheel
  // pan already request their own culls per animation frame.
  useLayoutEffect(() => { cullShapes() }, [view, shapes, stageEpoch])
  useEffect(() => () => { laserAnimationRef.current++; nodes.current={}; refCallbacks.current={}; viewPendingRef.current=null; if(cullRafRef.current){cancelAnimationFrame(cullRafRef.current)} if(wheelFlushRef.current){clearTimeout(wheelFlushRef.current)} }, [])
  const toolCursor = () => interaction.mode==='panning' ? 'grabbing' : state.activeTool === 'pan' ? 'grab' : state.activeTool === 'select' ? 'default' : state.activeTool === 'text' ? 'text' : 'crosshair'
  useEffect(() => { const container=stageRef.current?.container(); if(container) container.style.cursor=toolCursor() }, [state.activeTool, interaction.mode])
  useEffect(() => { abort() }, [state.activeTool])
  const cursorRafRef = useRef(0)
  const onStageMouseMove = event => { if(cursorRafRef.current) return; cursorRafRef.current = requestAnimationFrame(() => { cursorRafRef.current = 0; const container=stageRef.current?.container(); if(state.activeTool==='pan'||interactionRef.current.mode==='panning'){if(container)container.style.cursor=toolCursor();return} if(onCursorMove){const p=stageRef.current?.getPointerPosition();if(p){const v=viewRef2.current;onCursorMove({x:(p.x-v.x)/v.scale,y:(p.y-v.y)/v.scale})}} if(!container) return; const target=event.target; if(target&&target.getAttr&&target.getAttr('shapeId')){ container.style.cursor=state.activeTool==='select'?'move':toolCursor() } else if(target===stageRef.current){ container.style.cursor=toolCursor() } }) }

  const point = () => { const p=stageRef.current.getPointerPosition(); if(!p) return null; return { x:(p.x-view.x)/view.scale, y:(p.y-view.y)/view.scale } }
  const targetShapeId = target => target?.getAttr('shapeId') || null
  const isTransformerTarget = target => { let node = target; while (node && node !== transformer.current) node = node.parent; return !!node }

  // finishText: commits the current edit. Editing an existing shape down to
  // an empty string deletes it (matches Excalidraw) rather than silently
  // keeping the old text. A brand-new, never-typed-into text is discarded.
  // The freshly committed/edited text is selected so its handles appear
  // immediately, with no extra click needed.
  const finishText = () => {
    const current = editingRef.current
    if (window.__trace) window.__trace.push({ t:'finishText', had: !!current })
    if (!current) return
    editingRef.current = null
    const text = current.value.trim()
    if (current.id) {
      if (text) {
        commit(prev => prev.map(s => s.id === current.id ? { ...s, text, width: current.width, height: current.height, fontSize: current.fontSize } : s))
        dispatch({ type: 'SET_SELECTION', ids: [current.id] })
      } else {
        commit(prev => prev.filter(s => s.id !== current.id))
        dispatch({ type: 'SET_SELECTION', ids: [] })
      }
    } else if (text) {
      const id = newId()
      commit(prev => [...prev, { id, type: 'text', x: current.x, y: current.y, width: current.width, height: current.height, text, ...stateRef.current.activeStyle, fontSize: current.fontSize, stroke: current.stroke }])
      dispatch({ type: 'SET_SELECTION', ids: [id] })
    }
    setEditing(null)
    lastTextCommitRef.current = Date.now()
  }

  const selectShape = (id, event) => {
    const ids=stateRef.current.selectedShapeIds
    let nextSel=ids.includes(id)?ids:[id]
    if(event.evt.shiftKey) nextSel=ids.includes(id)?ids.filter(value=>value!==id):[...ids,id]
    dragSelection.current=nextSel
    dispatch({type:'SET_SELECTION',ids:nextSel})
    if(stateRef.current.activeTool!=='select'&&stateRef.current.activeTool!=='pan') dispatch({type:'SET_TOOL',tool:'select'})
  }
  const down = event => {
    try {
      const pid=Number.isFinite(event.evt?.pointerId)?event.evt.pointerId:null
      if (pan.current || start.current || draftRef.current) {
        if (pid===null || activePointer.current===pid) abort()
        else return
      }
      if (event.evt.button === 1 || space.current || stateRef.current.activeTool==='pan') { event.evt.preventDefault(); pan.current={x:event.evt.clientX,y:event.evt.clientY,view}; if(pid!==null)activePointer.current=pid; setHitGraph(false); startInteraction('panning'); window.addEventListener('pointermove', panMoveHandler); return }
      // Any stage click while a text editor is open finishes it and keeps the
      // committed text. The dismiss click itself won't spawn a second empty
      // box, so you need one extra click (like Excalidraw) to add another box.
      const wasEditing = !!editingRef.current
      if (editingRef.current) finishText()
      if (window.__trace) window.__trace.push({ t:'down', activeTool: stateRef.current.activeTool, wasEditing, editing: !!editingRef.current, lastCommit: Date.now()-lastTextCommitRef.current, x: event.evt?.clientX, y: event.evt?.clientY })
      const id=targetShapeId(event.target)
      if (stateRef.current.activeTool === 'eraser') { if(id) { const target=shapesRef.current.find(shape=>shape.id===id); if(target&&!target.locked) commit(prev=>prev.filter(shape=>shape.id!==id)) } return }

      // Existing objects always take precedence over creating a new shape.
      if(id) { selectShape(id,event); return }

      if (stateRef.current.activeTool === 'select') {
        if (event.target === event.target.getStage()) {
          dragSelection.current=[]
          if(!isTransformerTarget(event.target)) { abort(); dispatch({type:'SET_SELECTION',ids:[]}) }
        }
        return
      }
      const p=point()
      if(!p) return
      if (stateRef.current.activeTool === 'text') {
        // A prior text edit was open and just got committed (either above via
        // finishText(), or by the textarea's onBlur which fires before this
        // pointerdown). Don't immediately open a fresh empty box at the
        // dismissing click — the user needs a fresh click to add another box.
        if (window.__trace) window.__trace.push({ t:'text-branch', wasEditing, lastCommit: Date.now()-lastTextCommitRef.current, created: true })
        if (wasEditing || Date.now() - lastTextCommitRef.current < 400) return
        const fontSize = stateRef.current.activeStyle.fontSize || 20
        const box = measureTextBox('', fontSize)
        setEditing({ ...p, value: '', fontSize, stroke: stateRef.current.activeStyle.stroke, width: box.width, height: box.height })
        return
      }
      start.current=p; if(pid!==null)activePointer.current=pid; draftEndRef.current=p; setHitGraph(false); startInteraction('drawing')
      if (stateRef.current.activeTool === 'laser') { laserAnimationRef.current++; updateLaser({points:[p.x,p.y],opacity:.8}); return }
      const base={id:newId(),type:stateRef.current.activeTool,...stateRef.current.activeStyle,x:p.x,y:p.y}
      if(['arrow','line','pen'].includes(base.type)) base.points=[0,0]
      if(base.type==='pen') penPointsRef.current=base.points
      updateDraft(base)
    } catch (_e) { abort() }
  }
  const move = event => {
    try {
      const pid=Number.isFinite(event.evt?.pointerId)?event.evt.pointerId:null
      if(activePointer.current!==null&&activePointer.current!==pid) return
      if(pan.current) return
      if(!start.current) return
      let p=point()
      if(!p) return
      if(event.evt.shiftKey&&['line','arrow'].includes(stateRef.current.activeTool)){const dx=p.x-start.current.x,dy=p.y-start.current.y,angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4,distance=Math.hypot(dx,dy);p={x:start.current.x+Math.cos(angle)*distance,y:start.current.y+Math.sin(angle)*distance}}
      if(stateRef.current.activeTool==='laser'){const cur=laserRef.current;if(!cur)return;cur.points.push(p.x,p.y);const node=laserNodeRef.current;if(node){node.points(cur.points);node.getLayer()?.batchDraw()}return}
      const current=draftRef.current; if(!current) return
      const node=draftNodeRef.current
      if(current.type==='pen'){const pts=penPointsRef.current||current.points,lastX=pts[pts.length-2],lastY=pts[pts.length-1],nx=p.x-current.x,ny=p.y-current.y;if(pts.length<100000&&(nx-lastX)*(nx-lastX)+(ny-lastY)*(ny-lastY)>=1){pts.push(nx,ny);if(node){node.points(pts);node.getLayer()?.batchDraw()}}}
      else if(current.type==='arrow'||current.type==='line'){current.points[2]=p.x-current.x;current.points[3]=p.y-current.y;if(node){node.points(current.points);node.getLayer()?.batchDraw()}}
      else{const box=normalizeBox({x:current.x,y:current.y,width:p.x-current.x,height:p.y-current.y});draftEndRef.current=p;if(node){node.position(current.type==='ellipse'?{x:box.x+box.width/2,y:box.y+box.height/2}:{x:box.x,y:box.y});node.size({width:box.width,height:box.height});node.getLayer()?.batchDraw()}}
    } catch (_e) { abort() }
  }
  const up = event => {
    try {
      const pid=Number.isFinite(event?.evt?.pointerId)?event.evt.pointerId:null
      if(activePointer.current!==null&&pid!==null&&activePointer.current!==pid) return
      activePointer.current=null
      if(pan.current){window.removeEventListener('pointermove', panMoveHandler);pan.current=null;start.current=null;flushView();return}
      if(laserRef.current){const token=++laserAnimationRef.current;const node=laserNodeRef.current;const fade=()=>{if(token!==laserAnimationRef.current)return;const current=laserRef.current;if(!current)return;current.opacity=Math.max(0,(current.opacity??.8)-.06);if(node&&!node.isDestroyed()){node.opacity(current.opacity);node.getLayer()?.batchDraw()}if(current.opacity>0)requestAnimationFrame(fade);else{laserRef.current=null;updateLaser(null)}};requestAnimationFrame(fade);start.current=null;return}
      const current=draftRef.current
      if(current){let completed;if(isPointShape(current.type)){completed={...current,points:current.points.slice()}}else{const end=draftEndRef.current||current;completed={...current,...normalizeBox({x:current.x,y:current.y,width:end.x-current.x,height:end.y-current.y})}}const valid=isPointShape(completed.type)?completed.points.length>3:completed.width>MIN_SIZE&&completed.height>MIN_SIZE;if(valid)commit(prev=>[...prev,completed]);updateDraft(null)}
      draftEndRef.current=null; penPointsRef.current=null; draftNodeRef.current=null
      start.current=null
    } catch (_e) { abort() } finally { setHitGraph(true); interactionRef.current=initialInteraction; dispatchInteraction({type:'END'}) }
  }

  const transformedShape = (shape, node) => {
    const rawScaleX=node.scaleX(),rawScaleY=node.scaleY(),scaleX=Math.abs(rawScaleX),scaleY=Math.abs(rawScaleY),rotation=node.rotation()
    if(shape.type==='image'){const width=Math.max(20,shape.width*scaleX),height=Math.max(20,shape.height*scaleY),flipX=rawScaleX<0,flipY=rawScaleY<0;node.scaleX(flipX?-1:1);node.scaleY(flipY?-1:1);return {...shape,x:node.x()-(flipX?width:0),y:node.y()-(flipY?height:0),width,height,rotation,flipX,flipY}}
    node.scaleX(1); node.scaleY(1)
    if(shape.type==='ellipse'){const width=Math.max(MIN_SIZE,shape.width*scaleX),height=Math.max(MIN_SIZE,shape.height*scaleY);return {...shape,x:node.x()-width/2,y:node.y()-height/2,width,height,rotation}}
    if(shape.type==='rectangle'){const width=Math.max(MIN_SIZE,shape.width*scaleX);const height=Math.max(MIN_SIZE,shape.height*scaleY);return {...shape,x:node.x(),y:node.y(),width,height,rotation}}
    if(shape.type==='text'){
      // Text resizes uniformly (font size), not independently in width/height —
      // matches Excalidraw's corner-only text resize behavior.
      const uniformScale=Math.max(scaleX,scaleY)
      const fontSize=Math.max(8,Math.round((shape.fontSize||20)*uniformScale))
      const box=measureTextBox(shape.text,fontSize)
      return {...shape,x:node.x(),y:node.y(),width:box.width,height:box.height,rotation,fontSize}
    }
    if(isPointShape(shape.type)){const points=shape.points.map((value,index)=>value*(index%2?scaleY:scaleX));return {...shape,x:node.x(),y:node.y(),points,rotation}}
    return shape
  }
  const commitTransform = useCallback((shape, node) => {
    commit(prev=>prev.map(sh=>sh.id===shape.id&&!sh.locked?transformedShape(sh,node):sh))
  }, [commit])

  const handleDragEnd = useCallback((shape) => {
    const gesture=dragGesture.current
    if(!gesture || gesture.primaryId!==shape.id) return
    const node=nodes.current[shape.id]
    if(!node) return
    const offset=shape.type==='ellipse'?{x:shape.width/2,y:shape.height/2}:{x:shape.type==='image'&&shape.flipX?shape.width:0,y:shape.type==='image'&&shape.flipY?shape.height:0}
    const snapped=snapToGrid(node.x()-offset.x,node.y()-offset.y)
    const delta={x:snapped.x-gesture.positions[shape.id].x,y:snapped.y-gesture.positions[shape.id].y}
    const selected=new Set(gesture.ids)
    commit(prev=>prev.map(item=>selected.has(item.id)&&!item.locked?{...item,x:gesture.positions[item.id].x+delta.x,y:gesture.positions[item.id].y+delta.y}:item))
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
    if (window.__trace) window.__trace.push({ t: 'transformer-dbl', ids: stateRef.current.selectedShapeIds.slice() })
    const ids = stateRef.current.selectedShapeIds
    if (ids.length !== 1) return
    const shape = shapesRef.current.find(item => item.id === ids[0])
    if (shape && shape.type === 'text') handleEdit(shape)
  }, [handleEdit])
  const handleStageDragStart = event => {
    const primaryId=targetShapeId(event.target)
    if(!primaryId) return
    const ids=[...new Set(dragSelection.current.includes(primaryId)?dragSelection.current:[primaryId])]
    const positions={}; const nodePositions={}
    shapesRef.current.forEach(shape=>{if(ids.includes(shape.id)&&!shape.locked) positions[shape.id]={x:shape.x,y:shape.y}})
    ids.forEach(id=>{const node=nodes.current[id];if(node)nodePositions[id]={x:node.x(),y:node.y()}})
    dragGesture.current={primaryId,ids:ids.filter(id=>positions[id]&&nodePositions[id]),positions,nodePositions}
    setHitGraph(false)
    startInteraction('dragging')
  }
  const handleStageDragMove = event => {
    const gesture=dragGesture.current
    if(!gesture || targetShapeId(event.target)!==gesture.primaryId) return
    const primaryStart=gesture.nodePositions[gesture.primaryId]
    if(!primaryStart) return
    const dx=event.target.x()-primaryStart.x,dy=event.target.y()-primaryStart.y
    gesture.ids.forEach(id=>{if(id!==gesture.primaryId){const node=nodes.current[id],initial=gesture.nodePositions[id];if(node&&initial)node.position({x:initial.x+dx,y:initial.y+dy})}})
    // Snap guides
    const shapesArr=shapesRef.current
    const selectedSet=new Set(gesture.ids)
    const primaryShape=shapesArr.find(s=>s.id===gesture.primaryId)
    if(primaryShape){
      const bx=event.target.x()-(primaryShape.width||0)/2, by=event.target.y()-(primaryShape.height||0)/2, bw=primaryShape.width||0, bh=primaryShape.height||0
      const others=shapesArr.filter(s=>!selectedSet.has(s.id)).map(s=>({x:s.x,y:s.y,width:s.width,height:s.height}))
      const result=getSnapGuides({x:bx,y:by,width:bw,height:bh},others,6/view.scale)
      if(result.snapped.x!=null)gesture.ids.forEach(id=>{const node=nodes.current[id];if(node)node.x(node.x()+result.snapped.x)})
      if(result.snapped.y!=null)gesture.ids.forEach(id=>{const node=nodes.current[id];if(node)node.y(node.y()+result.snapped.y)})
      setSnapGuides(result.guides.length?result.guides:null)
    }
    requestCull()
  }
  const handleStageDragEnd = event => {
    try {
      const shape=shapesRef.current.find(item=>item.id===targetShapeId(event.target))
      if(shape&&!shape.locked) handleDragEnd(shape)
    } catch (_e) { abort() } finally { dragGesture.current=null; setHitGraph(true); setSnapGuides(null); interactionRef.current=initialInteraction; dispatchInteraction({type:'END'}) }
  }
  const handleStageTransformStart = () => { setHitGraph(false); startInteraction('resizing') }
  const handleStageTransformEnd = event => {
    try {
      const shape=shapesRef.current.find(item=>item.id===targetShapeId(event.target))
      if(shape&&!shape.locked) {
        const ids=stateRef.current.selectedShapeIds
        if(ids.length>1) {
          const selected=new Set(ids)
          commit(prev=>prev.map(item=>{const node=nodes.current[item.id];return selected.has(item.id)&&node&&!item.locked?transformedShape(item,node):item}))
        } else commitTransform(shape,event.target)
      }
    } catch (_e) { abort() } finally { setHitGraph(true); interactionRef.current=initialInteraction; dispatchInteraction({type:'END'}) }
  }
  const refFor = useCallback(id => refCallbacks.current[id] || (refCallbacks.current[id] = node => { if(node) nodes.current[id]=node; else delete nodes.current[id] }), [])
  const selectedImages=state.selectedShapeIds.filter(id=>shapesRef.current.find(shape=>shape.id===id)?.type==='image')
  const minTransformSize=selectedImages.length?20:8
  // Text gets corner-only resize handles (uniform font scaling); every other
  // shape keeps the full 8-handle set.
  const selectedForAnchors=state.selectedShapeIds.map(id=>shapesRef.current.find(shape=>shape.id===id)).filter(Boolean)
  const soleTextSelected=selectedForAnchors.length===1&&selectedForAnchors[0].type==='text'
  const transformerAnchors=soleTextSelected
    ? ['top-left','top-right','bottom-left','bottom-right']
    : ['top-left','top-center','top-right','middle-left','middle-right','bottom-left','bottom-center','bottom-right']
  // On browsers without Pointer Events (Safari <13.1 / iOS <13) Konva fires mouse/touch
  // events instead of pointer events; the handlers accept those too (pointerId stays null).
  const inputProps = NO_POINTER
    ? {
        onMouseDown: down,
        onMouseMove: event => { move(event); onStageMouseMove(event) },
        onMouseUp: up,
        onMouseLeave: event => { if(event.evt.buttons===0) abort() },
        onTouchStart: down,
        onTouchMove: move,
        onTouchEnd: up,
        onTouchCancel: up
      }
    : { onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up, onMouseMove: onStageMouseMove }
  // During panning the imperative stage.position() drives the Stage while
  // React view state stays stale until flushView().  If we keep passing the
  // stale x/y as props, any mid-pan re-render resets the position.  Dropping
  // the x/y props while panning lets the imperative position stick.
  const stagePosProps = pan.current ? {} : { x: stageProps.x, y: stageProps.y }
  return <div ref={hostRef} className="canvas-host" data-interaction-mode={interaction.mode}><Stage key={stageEpoch} ref={stageRef} width={size.width} height={size.height} {...stagePosProps} scaleX={stageProps.scaleX} scaleY={stageProps.scaleY} onWheel={stageProps.onWheel} draggable={stageProps.draggable} {...inputProps} onDragStart={handleStageDragStart} onDragMove={handleStageDragMove} onDragEnd={handleStageDragEnd} onTransformStart={handleStageTransformStart} onTransformEnd={handleStageTransformEnd} onContextMenu={event=>event.evt.preventDefault()}><Layer><ShapesLayer shapes={shapes} editingId={editing?.id} draggable={state.activeTool==='select'} viewScaleRef={viewScaleRef} onEdit={handleEdit} refFor={refFor}/>{draft&&<Shape shape={draft} draggable={false} viewScaleRef={viewScaleRef} nodeRef={draftNodeRef} onEdit={()=>{}}/>}</Layer><Layer name="overlay">{laser&&<Line ref={laserNodeRef} listening={false} points={laser.points} stroke="#ef4444" strokeWidth={4} lineCap="round" lineJoin="round" opacity={laser.opacity ?? .8}/>}{snapGuides&&snapGuides.map((g,i)=>g.orientation==='vertical'?<Line key={i} listening={false} points={[g.value,0,g.value,size.height]} stroke="#6366f1" strokeWidth={1} dash={[4,4]} opacity={0.7}/>:<Line key={i} listening={false} points={[0,g.value,size.width,g.value]} stroke="#6366f1" strokeWidth={1} dash={[4,4]} opacity={0.7}/>)}<Transformer ref={transformer} onDblClick={handleTransformerDblClick} onDblTap={handleTransformerDblClick} rotateEnabled flipEnabled shiftBehavior="inverted" boundBoxFunc={(oldBox,newBox)=>((newBox.width<minTransformSize||newBox.height<minTransformSize)&&transformer.current?.getActiveAnchor()!=='rotater'?oldBox:newBox)} enabledAnchors={transformerAnchors} /></Layer></Stage>{shapes.length===0&&!editing&&!draft&&<div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',textAlign:'center',pointerEvents:'none',opacity:.45,fontSize:14,lineHeight:1.6,maxWidth:280}}><div style={{fontSize:18,fontWeight:600,marginBottom:4}}>Your canvas is empty</div><div>Select a tool from the left toolbar and drag on the canvas to create shapes. Use <kbd style={{background:'#e2e8f0',padding:'1px 5px',borderRadius:3,fontSize:12}}>V</kbd> for select, <kbd style={{background:'#e2e8f0',padding:'1px 5px',borderRadius:3,fontSize:12}}>R</kbd> for rectangle, <kbd style={{background:'#e2e8f0',padding:'1px 5px',borderRadius:3,fontSize:12}}>P</kbd> for pen.</div></div>}{editing&&<textarea ref={editorRef} className="text-editor" style={{position:'fixed',left:editing.x*view.scale+view.x,top:editing.y*view.scale+view.y,width:editing.width*view.scale,height:editing.height*view.scale,minWidth:0,minHeight:0,maxWidth:'none',maxHeight:'none',fontSize:editing.fontSize*view.scale,lineHeight:TEXT_LINE_HEIGHT,fontFamily:TEXT_FONT_FAMILY,color:editing.stroke||'#1e293b',resize:'none',boxSizing:'border-box',overflow:'hidden',padding:0,border:'none',outline:'2px solid #6366f1',outlineOffset:'1px',background:'transparent',zIndex:4}} defaultValue={editing.value} onChange={event=>{const value=event.target.value;const prev=editingRef.current;if(!prev)return;const box=measureTextBox(value,prev.fontSize);const el=editorRef.current;if(el){el.style.width=(box.width*view.scale)+'px';el.style.height=(box.height*view.scale)+'px'}if(box.width!==prev.width||box.height!==prev.height){const next={...prev,value,width:box.width,height:box.height};editingRef.current=next;setEditing(next)}else{editingRef.current={...prev,value}}}} onBlur={finishText} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();finishText()}if(event.key==='Enter'&&(event.metaKey||event.ctrlKey)){event.preventDefault();finishText()}}}/>}</div>
}
