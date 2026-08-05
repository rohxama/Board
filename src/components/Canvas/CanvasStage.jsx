import { memo, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import Konva from 'konva'
import { Arrow, Ellipse, Image as KonvaImage, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva'
import { useAppState } from '../../context/AppStateContext'
import { useHistory } from '../../context/HistoryContext'
import { newId } from '../../lib/idGenerator'
import { snapToGrid } from '../../lib/snapping'
import { normalizeBox } from '../../lib/geometry'
import { useStageZoomPan } from '../../hooks/useStageZoomPan'
import { useImageAsset } from '../../hooks/useImageAsset'

const NO_POINTER = typeof window !== 'undefined' && typeof window.PointerEvent !== 'function'

const MIN_SIZE = 5
const dashValue = dash => dash === 'dashed' ? [10, 6] : dash === 'dotted' ? [2, 6] : []
const isPointShape = type => ['arrow', 'line', 'pen'].includes(type)
const initialInteraction = { mode: 'idle' }
function interactionReducer(state, action) {
  if (action.type === 'RESET' || action.type === 'END') return initialInteraction
  if (action.type === 'START') return { mode: action.mode }
  return state
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

const Shape = memo(function Shape({ shape, nodeRef, onEdit, draggable = true, hitScale = 1, penNodeRef }) {
  const shapeRef = useRef(shape)
  shapeRef.current = shape
  const onEditShape = useCallback(() => onEdit(shapeRef.current), [onEdit])
  const interaction = { id: shape.id, shapeId: shape.id, ref: nodeRef, draggable: draggable && !shape.locked, onDblClick: onEditShape, onDblTap: onEditShape }
  const paint = { stroke: shape.stroke, strokeWidth: shape.strokeWidth, fill: shape.fill === 'transparent' ? undefined : shape.fill, opacity: shape.opacity, dash: dashValue(shape.dash), rotation: shape.rotation || 0 }
  const hitW = Math.max(shape.strokeWidth || 2, 16 / hitScale)
  const pointHit = { hitStrokeWidth: hitW }
  const borderHit = { hitStrokeWidth: hitW }
  const safeHit = fn => (ctx, node) => { try { fn(ctx, node) } catch {} }
  const rectHitFunc = useCallback(safeHit((ctx, node) => { ctx.beginPath(); ctx.rect(0, 0, node.width(), node.height()); ctx.strokeShape(node) }), [])
  const ellipseHitFunc = useCallback(safeHit((ctx, node) => { ctx.beginPath(); ctx.ellipse(0, 0, node.radiusX(), node.radiusY(), 0, 0, Math.PI * 2, false); ctx.strokeShape(node) }), [])
  if (shape.type === 'image') return <ImageShape shape={shape} nodeRef={nodeRef} onEdit={onEdit} draggable={draggable} />
  if (shape.type === 'rectangle') return <Rect {...interaction} {...paint} x={shape.x} y={shape.y} width={shape.width} height={shape.height} cornerRadius={shape.cornerRadius ?? 4} hitFunc={rectHitFunc} {...borderHit} />
  if (shape.type === 'ellipse') return <Ellipse {...interaction} {...paint} x={shape.x + shape.width / 2} y={shape.y + shape.height / 2} radiusX={shape.width / 2} radiusY={shape.height / 2} hitFunc={ellipseHitFunc} {...borderHit} />
  if (shape.type === 'arrow') return <Arrow {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} pointerLength={10} pointerWidth={10} fill={shape.stroke} />
  if (shape.type === 'line') return <Line {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} lineCap="round" lineJoin="round" />
  if (shape.type === 'pen') return <Line {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} lineCap="round" lineJoin="round" tension={.35} ref={penNodeRef || nodeRef} />
  return <Text {...interaction} x={shape.x} y={shape.y} text={shape.text} fontSize={shape.fontSize || 20} fill={shape.stroke} opacity={shape.opacity} width={shape.width} rotation={shape.rotation || 0} draggable={draggable && !shape.locked} />
})

export default function CanvasStage({ stageRef, view, setView }) {
  const { state, dispatch } = useAppState()
  const { shapes, commit } = useHistory()
  const hostRef = useRef(); const nodes = useRef({}); const refCallbacks = useRef({}); const transformer = useRef(); const editorRef = useRef()
  const dragSelection = useRef([])
  const dragGesture = useRef(null)
  const shapesRef = useRef(shapes); shapesRef.current = shapes
  const stateRef = useRef(state); stateRef.current = state
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [draft, setDraft] = useState(null); const draftRef = useRef(null); const penPointsRef = useRef(null); const penNodeRef = useRef(null)
  const [laser, setLaser] = useState(null); const laserRef = useRef(null); const laserAnimationRef = useRef(0); const [editing, setEditing] = useState(null)
  const [interaction, dispatchInteraction] = useReducer(interactionReducer, initialInteraction)
  const interactionRef = useRef(initialInteraction); interactionRef.current = interaction
  const start = useRef(null); const pan = useRef(null); const space = useRef(false); const previousTool = useRef(null); const activePointer = useRef(null)
  const [stageEpoch, setStageEpoch] = useState(0); const lastCanvasRecovery = useRef(0)
  const { stageProps } = useStageZoomPan(stageRef, view, setView)

  const updateDraft = next => { draftRef.current = next; setDraft(next) }
  const updateLaser = next => { laserRef.current = next; setLaser(next) }
  const startInteraction = mode => { interactionRef.current={mode}; dispatchInteraction({type:'START',mode}) }
  const abort = () => {
    const gesture=dragGesture.current
    if(gesture) gesture.ids.forEach(id=>{const node=nodes.current[id],initial=gesture.nodePositions[id];if(node&&initial)node.position(initial)})
    dragGesture.current=null; start.current=null; pan.current=null; penPointsRef.current=null; penNodeRef.current=null; activePointer.current=null; laserAnimationRef.current++
    if(draftRef.current)updateDraft(null)
    updateLaser(null)
    interactionRef.current=initialInteraction; dispatchInteraction({type:'RESET'})
  }
  useEffect(() => {
    const resize = () => {
      const rect = hostRef.current?.getBoundingClientRect()
      setSize({ width: Math.round(rect?.width || window.innerWidth), height: Math.round(rect?.height || window.innerHeight) })
    }
    const observer = new ResizeObserver(resize)
    if (hostRef.current) observer.observe(hostRef.current)
    resize()
    const releaseSpace = () => { space.current=false; const tool=previousTool.current; previousTool.current=null; if(tool)dispatch({type:'SET_TOOL',tool}) }
    const key=e=>{if(e.code!=='Space'||e.target?.tagName==='INPUT'||e.target?.tagName==='TEXTAREA')return;if(e.type==='keydown'){if(e.repeat)return;space.current=true;if(stateRef.current.activeTool!=='pan'){previousTool.current=stateRef.current.activeTool;dispatch({type:'SET_TOOL',tool:'pan'})}}else releaseSpace()}
    const blur=()=>{releaseSpace();abort()}
    const end=e=>{if(interactionRef.current.mode==='idle')return;const pid=Number.isFinite(e?.pointerId)?e.pointerId:null;if(pid!==null&&activePointer.current!==null&&activePointer.current!==pid)return;abort()}
    addEventListener('keydown',key); addEventListener('keyup',key); addEventListener('blur',blur); addEventListener('pointerup',end); addEventListener('touchend',end); if(NO_POINTER)addEventListener('mouseup',end)
    return()=>{observer.disconnect();removeEventListener('keydown',key);removeEventListener('keyup',key);removeEventListener('blur',blur);removeEventListener('pointerup',end);removeEventListener('touchend',end); if(NO_POINTER)removeEventListener('mouseup',end)}
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
    } catch {
      abort()
    }
  }, [state.selectedShapeIds, shapes])
  useEffect(() => { const live=new Set(shapes.map(shape=>shape.id)); const pruned=state.selectedShapeIds.filter(id=>live.has(id)); if(pruned.length!==state.selectedShapeIds.length) dispatch({type:'SET_SELECTION',ids:pruned}) }, [shapes])
  useEffect(() => { const liveIds=new Set(shapes.map(shape=>shape.id)); Object.keys(refCallbacks.current).forEach(id=>{if(!liveIds.has(id)){delete refCallbacks.current[id];delete nodes.current[id]}}) }, [shapes])
  useEffect(() => () => { nodes.current={}; refCallbacks.current={} }, [])
  const toolCursor = () => interaction.mode==='panning' ? 'grabbing' : state.activeTool === 'pan' ? 'grab' : state.activeTool === 'select' ? 'default' : state.activeTool === 'text' ? 'text' : 'crosshair'
  useEffect(() => { const container=stageRef.current?.container(); if(container) container.style.cursor=toolCursor() }, [state.activeTool, interaction.mode])
  useEffect(() => { abort() }, [state.activeTool])
  const onStageMouseMove = event => { const container=stageRef.current?.container(); if(!container) return; if(state.activeTool==='pan'||interactionRef.current.mode==='panning'){container.style.cursor=toolCursor();return} const target=event.target; if(target&&target.getAttr&&target.getAttr('shapeId')){ container.style.cursor=state.activeTool==='select'?'move':toolCursor() } else if(target===stageRef.current){ container.style.cursor=toolCursor() } }

  const point = () => { const p=stageRef.current.getPointerPosition(); if(!p) return null; return { x:(p.x-view.x)/view.scale, y:(p.y-view.y)/view.scale } }
  const targetShapeId = target => target?.getAttr('shapeId') || null
  const isTransformerTarget = target => { let node = target; while (node && node !== transformer.current) node = node.parent; return !!node }
  const finishText = () => { if(!editing) return; const text=editing.value.trim(); if(text) { if(editing.id) commit(prev=>prev.map(s=>s.id===editing.id?{...s,text}:s)); else commit(prev=>[...prev,{id:newId(),type:'text',x:editing.x,y:editing.y,width:220,text,...stateRef.current.activeStyle}]) } setEditing(null) }

  const selectShape = (id, event) => {
    const ids=stateRef.current.selectedShapeIds
    let nextSel=ids.includes(id)?ids:[id]
    if(event.evt.shiftKey) nextSel=ids.includes(id)?ids.filter(value=>value!==id):[...ids,id]
    dragSelection.current=nextSel
    dispatch({type:'SET_SELECTION',ids:nextSel})
    if(stateRef.current.activeTool!=='select') dispatch({type:'SET_TOOL',tool:'select'})
  }
  const down = event => {
    try {
      const pid=Number.isFinite(event.evt?.pointerId)?event.evt.pointerId:null
      if (pan.current || start.current || draftRef.current) {
        if (pid===null || activePointer.current===pid) abort()
        else return
      }
      if (event.evt.button === 1 || space.current || stateRef.current.activeTool==='pan') { event.evt.preventDefault(); pan.current={x:event.evt.clientX,y:event.evt.clientY,view}; if(pid!==null)activePointer.current=pid; startInteraction('panning'); return }
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
      if (stateRef.current.activeTool === 'text') { setEditing({ ...p, value:'' }); return }
      start.current=p; if(pid!==null)activePointer.current=pid; startInteraction('drawing')
      if (stateRef.current.activeTool === 'laser') { laserAnimationRef.current++; updateLaser({points:[p.x,p.y]}); return }
      const base={id:newId(),type:stateRef.current.activeTool,...stateRef.current.activeStyle,x:p.x,y:p.y}
      if(['arrow','line','pen'].includes(base.type)) base.points=[0,0]
      if(base.type==='pen') penPointsRef.current=base.points
      updateDraft(base)
    } catch { abort() }
  }
  const move = event => {
    try {
      const pid=Number.isFinite(event.evt?.pointerId)?event.evt.pointerId:null
      if(activePointer.current!==null&&activePointer.current!==pid) return
      if(pan.current){const origin=pan.current;setView({...origin.view,x:origin.view.x+event.evt.clientX-origin.x,y:origin.view.y+event.evt.clientY-origin.y});return}
      if(!start.current) return
      let p=point()
      if(!p) return
      if(event.evt.shiftKey&&['line','arrow'].includes(stateRef.current.activeTool)){const dx=p.x-start.current.x,dy=p.y-start.current.y,angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4,distance=Math.hypot(dx,dy);p={x:start.current.x+Math.cos(angle)*distance,y:start.current.y+Math.sin(angle)*distance}}
      if(stateRef.current.activeTool==='laser'){const current=laserRef.current;if(current)updateLaser({...current,points:[...current.points,p.x,p.y]});return}
      const current=draftRef.current; if(!current) return
      if(current.type==='pen'){const pts=penPointsRef.current||current.points,lastX=pts[pts.length-2],lastY=pts[pts.length-1],nx=p.x-current.x,ny=p.y-current.y;if(pts.length<100000&&(nx-lastX)*(nx-lastX)+(ny-lastY)*(ny-lastY)>=1){pts.push(nx,ny);const node=penNodeRef.current;if(node){node.points(pts);node.getLayer()?.batchDraw()}}}
      else if(['arrow','line'].includes(current.type)) updateDraft({...current,points:[0,0,p.x-current.x,p.y-current.y]})
      else updateDraft({...current,...normalizeBox({x:current.x,y:current.y,width:p.x-current.x,height:p.y-current.y})})
    } catch { abort() }
  }
  const up = event => {
    try {
      const pid=Number.isFinite(event?.evt?.pointerId)?event.evt.pointerId:null
      if(activePointer.current!==null&&pid!==null&&activePointer.current!==pid) return
      activePointer.current=null
      if(pan.current){pan.current=null;start.current=null;return}
      if(laserRef.current){let opacity=1;const token=++laserAnimationRef.current;const fade=()=>{if(token!==laserAnimationRef.current)return;opacity-=.06;if(opacity>0){const current=laserRef.current;if(current)updateLaser({...current,opacity});requestAnimationFrame(fade)}else updateLaser(null)};requestAnimationFrame(fade);start.current=null;return}
      const current=draftRef.current
      if(current){const completed=isPointShape(current.type)?{...current,points:current.points.slice()}:{...current,...normalizeBox(current)};const valid=isPointShape(completed.type)?completed.points.length>3:completed.width>MIN_SIZE&&completed.height>MIN_SIZE;if(valid)commit(prev=>[...prev,completed]);updateDraft(null)}
      penPointsRef.current=null; penNodeRef.current=null
      start.current=null
    } catch { abort() } finally { interactionRef.current=initialInteraction; dispatchInteraction({type:'END'}) }
  }

  const transformedShape = (shape, node) => {
    const rawScaleX=node.scaleX(),rawScaleY=node.scaleY(),scaleX=Math.abs(rawScaleX),scaleY=Math.abs(rawScaleY),rotation=node.rotation()
    if(shape.type==='image'){const width=Math.max(20,shape.width*scaleX),height=Math.max(20,shape.height*scaleY),flipX=rawScaleX<0,flipY=rawScaleY<0;node.scaleX(flipX?-1:1);node.scaleY(flipY?-1:1);return {...shape,x:node.x()-(flipX?width:0),y:node.y()-(flipY?height:0),width,height,rotation,flipX,flipY}}
    node.scaleX(1); node.scaleY(1)
    if(shape.type==='ellipse'){const width=Math.max(MIN_SIZE,shape.width*scaleX),height=Math.max(MIN_SIZE,shape.height*scaleY);return {...shape,x:node.x()-width/2,y:node.y()-height/2,width,height,rotation}}
    if(shape.type==='rectangle'||shape.type==='text'){const width=Math.max(MIN_SIZE,shape.width*scaleX);const height=shape.type==='rectangle'?Math.max(MIN_SIZE,shape.height*scaleY):shape.height;const extra=shape.type==='text'?{fontSize:Math.max(8,Math.round((shape.fontSize||20)*scaleY))}:{};return {...shape,x:node.x(),y:node.y(),width,height,rotation,...extra}}
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

  const handleEdit = useCallback((shape) => { if(shape.type==='text') setEditing({id:shape.id,x:shape.x,y:shape.y,value:shape.text}) }, [])
  const handleStageDragStart = event => {
    const primaryId=targetShapeId(event.target)
    if(!primaryId) return
    const ids=[...new Set(dragSelection.current.includes(primaryId)?dragSelection.current:[primaryId])]
    const positions={}; const nodePositions={}
    shapesRef.current.forEach(shape=>{if(ids.includes(shape.id)&&!shape.locked) positions[shape.id]={x:shape.x,y:shape.y}})
    ids.forEach(id=>{const node=nodes.current[id];if(node)nodePositions[id]={x:node.x(),y:node.y()}})
    dragGesture.current={primaryId,ids:ids.filter(id=>positions[id]&&nodePositions[id]),positions,nodePositions}
    startInteraction('dragging')
  }
  const handleStageDragMove = event => {
    const gesture=dragGesture.current
    if(!gesture || targetShapeId(event.target)!==gesture.primaryId) return
    const primaryStart=gesture.nodePositions[gesture.primaryId]
    if(!primaryStart) return
    const dx=event.target.x()-primaryStart.x,dy=event.target.y()-primaryStart.y
    gesture.ids.forEach(id=>{if(id!==gesture.primaryId){const node=nodes.current[id],initial=gesture.nodePositions[id];if(node&&initial)node.position({x:initial.x+dx,y:initial.y+dy})}})
    event.target.getLayer()?.batchDraw()
  }
  const handleStageDragEnd = event => {
    try {
      const shape=shapesRef.current.find(item=>item.id===targetShapeId(event.target))
      if(shape&&!shape.locked) handleDragEnd(shape)
    } catch { abort() } finally { dragGesture.current=null; interactionRef.current=initialInteraction; dispatchInteraction({type:'END'}) }
  }
  const handleStageTransformStart = () => startInteraction('resizing')
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
    } catch { abort() } finally { interactionRef.current=initialInteraction; dispatchInteraction({type:'END'}) }
  }
  const refFor = id => refCallbacks.current[id] || (refCallbacks.current[id] = node => { if(node) nodes.current[id]=node; else delete nodes.current[id] })
  const selectedImages=state.selectedShapeIds.filter(id=>shapesRef.current.find(shape=>shape.id===id)?.type==='image')
  const minTransformSize=selectedImages.length?20:8
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
  return <div ref={hostRef} className="canvas-host" data-interaction-mode={interaction.mode}><Stage key={stageEpoch} ref={stageRef} width={size.width} height={size.height} {...stageProps} {...inputProps} onDragStart={handleStageDragStart} onDragMove={handleStageDragMove} onDragEnd={handleStageDragEnd} onTransformStart={handleStageTransformStart} onTransformEnd={handleStageTransformEnd} onContextMenu={event=>event.evt.preventDefault()}><Layer>{shapes.map(shape=><Shape key={shape.id} shape={shape} nodeRef={refFor(shape.id)} draggable={state.activeTool==='select'} hitScale={view.scale} onEdit={handleEdit}/>)}{draft&&<Shape shape={draft} draggable={false} hitScale={view.scale} nodeRef={()=>{}} penNodeRef={penNodeRef} onEdit={()=>{}}/>}</Layer><Layer name="overlay">{laser&&<Line listening={false} points={laser.points} stroke="#ef4444" strokeWidth={4} lineCap="round" lineJoin="round" opacity={laser.opacity ?? .8}/>}<Transformer ref={transformer} rotateEnabled flipEnabled shiftBehavior="inverted" boundBoxFunc={(oldBox,newBox)=>((newBox.width<minTransformSize||newBox.height<minTransformSize)&&transformer.current?.getActiveAnchor()!=='rotater'?oldBox:newBox)} enabledAnchors={['top-left','top-center','top-right','middle-left','middle-right','bottom-left','bottom-center','bottom-right']} /></Layer></Stage>{editing&&<textarea ref={editorRef} className="text-editor" style={{left:editing.x*view.scale+view.x,top:editing.y*view.scale+view.y}} value={editing.value} onChange={event=>setEditing({...editing,value:event.target.value})} onBlur={finishText} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();finishText()}if(event.key==='Escape')setEditing(null)}}/>}</div>
}
