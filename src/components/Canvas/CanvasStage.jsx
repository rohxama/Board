import { memo, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Arrow, Ellipse, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva'
import { useAppState } from '../../context/AppStateContext'
import { useHistory } from '../../context/HistoryContext'
import { newId } from '../../lib/idGenerator'
import { snapToGrid } from '../../lib/snapping'
import { useStageZoomPan } from '../../hooks/useStageZoomPan'

const MIN_SIZE = 5
const dashValue = dash => dash === 'dashed' ? [10, 6] : dash === 'dotted' ? [2, 6] : []
const isPointShape = type => ['arrow', 'line', 'pen'].includes(type)
const initialInteraction = { mode: 'idle' }
function interactionReducer(state, action) {
  if (action.type === 'RESET' || action.type === 'END') return initialInteraction
  if (action.type === 'START') return { mode: action.mode }
  return state
}

const Shape = memo(function Shape({ shape, nodeRef, onEdit, draggable = true, hitScale = 1 }) {
  const shapeRef = useRef(shape)
  shapeRef.current = shape
  const onEditShape = useCallback(() => onEdit(shapeRef.current), [onEdit])
  const interaction = { id: shape.id, shapeId: shape.id, ref: nodeRef, draggable, onDblClick: onEditShape, onDblTap: onEditShape }
  const paint = { stroke: shape.stroke, strokeWidth: shape.strokeWidth, fill: shape.fill === 'transparent' ? undefined : shape.fill, opacity: shape.opacity, dash: dashValue(shape.dash), rotation: shape.rotation || 0 }
  const hitW = Math.max(shape.strokeWidth || 2, 16 / hitScale)
  const pointHit = { hitStrokeWidth: hitW }
  const borderHit = { hitStrokeWidth: hitW }
  const rectHitFunc = useCallback((ctx, node) => { ctx.beginPath(); ctx.rect(0, 0, node.width(), node.height()); ctx.strokeShape(node) }, [])
  const ellipseHitFunc = useCallback((ctx, node) => { ctx.beginPath(); ctx.ellipse(0, 0, node.radiusX(), node.radiusY(), 0, 0, Math.PI * 2, false); ctx.strokeShape(node) }, [])
  if (shape.type === 'rectangle') return <Rect {...interaction} {...paint} x={shape.x} y={shape.y} width={shape.width} height={shape.height} cornerRadius={shape.cornerRadius ?? 4} hitFunc={rectHitFunc} {...borderHit} />
  if (shape.type === 'ellipse') return <Ellipse {...interaction} {...paint} x={shape.x + shape.width / 2} y={shape.y + shape.height / 2} radiusX={shape.width / 2} radiusY={shape.height / 2} hitFunc={ellipseHitFunc} {...borderHit} />
  if (shape.type === 'arrow') return <Arrow {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} pointerLength={10} pointerWidth={10} fill={shape.stroke} />
  if (shape.type === 'line') return <Line {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} lineCap="round" lineJoin="round" />
  if (shape.type === 'pen') return <Line {...interaction} {...paint} {...pointHit} x={shape.x} y={shape.y} points={shape.points} lineCap="round" lineJoin="round" tension={.35} />
  return <Text {...interaction} x={shape.x} y={shape.y} text={shape.text} fontSize={shape.fontSize || 20} fill={shape.stroke} opacity={shape.opacity} width={shape.width} rotation={shape.rotation || 0} draggable={draggable} />
})

export default function CanvasStage({ stageRef, view, setView }) {
  const { state, dispatch } = useAppState()
  const { shapes, commit } = useHistory()
  const hostRef = useRef(); const nodes = useRef({}); const refCallbacks = useRef({}); const transformer = useRef(); const editorRef = useRef()
  const dragSelection = useRef([])
  const shapesRef = useRef(shapes); shapesRef.current = shapes
  const stateRef = useRef(state); stateRef.current = state
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [draft, setDraft] = useState(null); const draftRef = useRef(null)
  const [laser, setLaser] = useState(null); const laserRef = useRef(null); const [editing, setEditing] = useState(null)
  const [interaction, dispatchInteraction] = useReducer(interactionReducer, initialInteraction)
  const start = useRef(null); const pan = useRef(null); const space = useRef(false)
  const { stageProps } = useStageZoomPan(stageRef, view, setView)

  const updateDraft = next => { draftRef.current = next; setDraft(next) }
  const updateLaser = next => { laserRef.current = next; setLaser(next) }
  const abort = () => { start.current=null; pan.current=null; if(draftRef.current)updateDraft(null); updateLaser(null); dispatchInteraction({type:'RESET'}) }
  useEffect(() => {
    const resize = () => {
      const rect = hostRef.current?.getBoundingClientRect()
      setSize({ width: Math.round(rect?.width || window.innerWidth), height: Math.round(rect?.height || window.innerHeight) })
    }
    const observer = new ResizeObserver(resize)
    if (hostRef.current) observer.observe(hostRef.current)
    resize()
    const key=e=>{if(e.code==='Space')space.current=e.type==='keydown'}
    const blur=()=>{space.current=false;abort()}
    const end=()=>abort()
    addEventListener('keydown',key); addEventListener('keyup',key); addEventListener('blur',blur); addEventListener('pointerup',end); addEventListener('touchend',end)
    return()=>{observer.disconnect();removeEventListener('keydown',key);removeEventListener('keyup',key);removeEventListener('blur',blur);removeEventListener('pointerup',end);removeEventListener('touchend',end)}
  }, [])
  useEffect(() => { const container=stageRef.current?.container(); if(!container) return; const leave=e=>{if(e.buttons===0&&(pan.current||start.current||draftRef.current))abort()}; container.addEventListener('pointerleave',leave); return()=>container.removeEventListener('pointerleave',leave) }, [])
  useEffect(() => { if (!editing) return; const frame=requestAnimationFrame(()=>editorRef.current?.focus()); return()=>cancelAnimationFrame(frame) }, [editing])
  useEffect(() => {
    try {
      const selected=state.selectedShapeIds.map(id=>nodes.current[id]).filter(node=>node && !node.isDestroyed?.())
      transformer.current?.nodes(selected)
      transformer.current?.getLayer()?.batchDraw()
    } catch {
      abort()
    }
  }, [state.selectedShapeIds, shapes])
  useEffect(() => { const liveIds=new Set(shapes.map(shape=>shape.id)); Object.keys(refCallbacks.current).forEach(id=>{if(!liveIds.has(id)){delete refCallbacks.current[id];delete nodes.current[id]}}) }, [shapes])
  useEffect(() => () => { nodes.current={}; refCallbacks.current={} }, [])
  const toolCursor = () => state.activeTool === 'select' ? 'default' : state.activeTool === 'text' ? 'text' : 'crosshair'
  useEffect(() => { const container=stageRef.current?.container(); if(container) container.style.cursor=toolCursor() }, [state.activeTool])
  useEffect(() => { abort() }, [state.activeTool])
  const onStageMouseMove = event => { const container=stageRef.current?.container(); if(!container) return; const target=event.target; if(target&&target.getAttr&&target.getAttr('shapeId')){ container.style.cursor=state.activeTool==='select'?'move':toolCursor() } else if(target===stageRef.current){ container.style.cursor=toolCursor() } }

  const point = () => { const p=stageRef.current.getPointerPosition(); return { x:(p.x-view.x)/view.scale, y:(p.y-view.y)/view.scale } }
  const targetShapeId = target => target?.getAttr('shapeId') || null
  const isTransformerTarget = target => { let node = target; while (node && node !== transformer.current) node = node.parent; return !!node }
  const finishText = () => { if(!editing) return; const text=editing.value.trim(); if(text) { if(editing.id) commit(shapesRef.current.map(s=>s.id===editing.id?{...s,text}:s)); else commit([...shapesRef.current,{id:newId(),type:'text',x:editing.x,y:editing.y,width:220,text,...stateRef.current.activeStyle}]) } setEditing(null) }

  const down = event => {
    if (pan.current || start.current || draftRef.current) abort()
    if (event.evt.button === 1 || space.current) { pan.current={x:event.evt.clientX,y:event.evt.clientY,view}; dispatchInteraction({type:'START',mode:'panning'}); return }
    const id=targetShapeId(event.target)
    if (state.activeTool === 'select') {
      const ids=state.selectedShapeIds
      if(id){
        let nextSel=ids.includes(id)?ids:[id]
        if(event.evt.shiftKey) nextSel=ids.includes(id)?ids.filter(value=>value!==id):[...ids,id]
        dragSelection.current=nextSel
        nextSel.forEach(nid=>{const n=nodes.current[nid];if(n){n.moveToTop()}})
        dispatch({type:'SET_SELECTION',ids:nextSel})
      } else if (event.target === event.target.getStage()) {
        dragSelection.current=[]
        if(!isTransformerTarget(event.target)) { abort(); dispatch({type:'SET_SELECTION',ids:[]}) }
      }
      return
    }
    const p=point()
    if (state.activeTool === 'eraser') { if(id) commit(shapesRef.current.filter(shape=>shape.id!==id)); return }
    if (state.activeTool === 'text') { setEditing({ ...p, value:'' }); return }
    start.current=p; dispatchInteraction({type:'START',mode:'drawing'})
    if (state.activeTool === 'laser') { updateLaser({points:[p.x,p.y]}); return }
    const base={id:newId(),type:state.activeTool,...state.activeStyle,x:p.x,y:p.y}
    if(['arrow','line','pen'].includes(base.type)) base.points=[0,0]
    updateDraft(base)
  }
  const move = event => {
    if(pan.current){const origin=pan.current;setView({...origin.view,x:origin.view.x+event.evt.clientX-origin.x,y:origin.view.y+event.evt.clientY-origin.y});return}
    if(start.current&&!(event.evt.buttons&1)){abort();return}
    if(!start.current) return
    let p=point()
    if(event.evt.shiftKey&&['line','arrow'].includes(state.activeTool)){const dx=p.x-start.current.x,dy=p.y-start.current.y,angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4,distance=Math.hypot(dx,dy);p={x:start.current.x+Math.cos(angle)*distance,y:start.current.y+Math.sin(angle)*distance}}
    if(state.activeTool==='laser'){const current=laserRef.current;if(current)updateLaser({...current,points:[...current.points,p.x,p.y]});return}
    const current=draftRef.current; if(!current) return
    if(current.type==='pen'){const pts=current.points,lastX=pts[pts.length-2],lastY=pts[pts.length-1],nx=p.x-current.x,ny=p.y-current.y;if((nx-lastX)*(nx-lastX)+(ny-lastY)*(ny-lastY)>=1)updateDraft({...current,points:[...pts,nx,ny]})}
    else if(['arrow','line'].includes(current.type)) updateDraft({...current,points:[0,0,p.x-current.x,p.y-current.y]})
    else updateDraft({...current,width:p.x-current.x,height:p.y-current.y})
  }
  const up = () => {
    try {
      if(pan.current){pan.current=null;start.current=null;return}
      if(laserRef.current){let opacity=1;const fade=()=>{opacity-=.06;if(opacity>0){const current=laserRef.current;if(current)updateLaser({...current,opacity});requestAnimationFrame(fade)}else updateLaser(null)};requestAnimationFrame(fade);start.current=null;return}
      const current=draftRef.current
      if(current){let completed=current;if(['rectangle','ellipse'].includes(current.type)) completed={...current,x:Math.min(current.x,current.x+current.width),y:Math.min(current.y,current.y+current.height),width:Math.abs(current.width),height:Math.abs(current.height)};const valid=isPointShape(completed.type)?completed.points.length>3:completed.width>MIN_SIZE&&completed.height>MIN_SIZE;if(valid)commit([...shapesRef.current,completed]);updateDraft(null)}
      start.current=null
    } catch { abort() } finally { dispatchInteraction({type:'END'}) }
  }

  const commitTransform = useCallback((shape, node) => {
    const scaleX=Math.abs(node.scaleX()),scaleY=Math.abs(node.scaleY()),rotation=node.rotation()
    node.scaleX(1); node.scaleY(1)
    const s=shapesRef.current
    if(shape.type==='ellipse'){const width=Math.max(MIN_SIZE,shape.width*scaleX),height=Math.max(MIN_SIZE,shape.height*scaleY);commit(s.map(sh=>sh.id===shape.id?{...sh,x:node.x()-width/2,y:node.y()-height/2,width,height,rotation}:sh));return}
    if(shape.type==='rectangle'||shape.type==='text'){const width=Math.max(MIN_SIZE,shape.width*scaleX);const height=shape.type==='rectangle'?Math.max(MIN_SIZE,shape.height*scaleY):shape.height;const extra=shape.type==='text'?{fontSize:Math.max(8,Math.round((shape.fontSize||20)*scaleY))}:{};commit(s.map(sh=>sh.id===shape.id?{...sh,x:node.x(),y:node.y(),width,height,rotation,...extra}:sh));return}
    if(isPointShape(shape.type)){const points=shape.points.map((value,index)=>value*(index%2?scaleY:scaleX));commit(s.map(sh=>sh.id===shape.id?{...sh,x:node.x(),y:node.y(),points,rotation}:sh))}
  }, [commit])

  const handleDragEnd = useCallback((shape) => {
    const s = shapesRef.current
    const ids = [...new Set([shape.id, ...dragSelection.current])]
    let next = s
    ids.forEach(id => {
      const node = nodes.current[id]
      const other = s.find(sh => sh.id === id)
      if (!node || !other) return
      const o = other.type === 'ellipse' ? { x: other.width / 2, y: other.height / 2 } : { x: 0, y: 0 }
      const pos = snapToGrid(node.x() - o.x, node.y() - o.y)
      const w = node.width() * Math.abs(node.scaleX())
      const h = node.height() * Math.abs(node.scaleY())
      next = next.map(sh => sh.id === id ? { ...sh, x: pos.x, y: pos.y, width: w, height: h } : sh)
    })
    commit(next)
  }, [commit])

  const handleEdit = useCallback((shape) => { if(shape.type==='text') setEditing({id:shape.id,x:shape.x,y:shape.y,value:shape.text}) }, [])
  const handleStageDragStart = event => { if(targetShapeId(event.target)) dispatchInteraction({type:'START',mode:'dragging'}) }
  const handleStageDragEnd = event => {
    try {
      const shape=shapesRef.current.find(item=>item.id===targetShapeId(event.target))
      if(shape) handleDragEnd(shape)
    } catch { abort() } finally { dispatchInteraction({type:'END'}) }
  }
  const handleStageTransformStart = () => dispatchInteraction({type:'START',mode:'resizing'})
  const handleStageTransformEnd = event => {
    try {
      const shape=shapesRef.current.find(item=>item.id===targetShapeId(event.target))
      if(shape) commitTransform(shape,event.target)
    } catch { abort() } finally { dispatchInteraction({type:'END'}) }
  }
  const refFor = id => refCallbacks.current[id] || (refCallbacks.current[id] = node => { if(node) nodes.current[id]=node; else delete nodes.current[id] })
  return <div ref={hostRef} className="canvas-host" data-interaction-mode={interaction.mode}><Stage ref={stageRef} width={size.width} height={size.height} {...stageProps} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onDragStart={handleStageDragStart} onDragEnd={handleStageDragEnd} onTransformStart={handleStageTransformStart} onTransformEnd={handleStageTransformEnd} onMouseMove={onStageMouseMove} onContextMenu={event=>event.evt.preventDefault()}><Layer>{shapes.map(shape=><Shape key={shape.id} shape={shape} nodeRef={refFor(shape.id)} draggable={state.activeTool==='select'} hitScale={view.scale} onEdit={handleEdit}/>)}{draft&&<Shape shape={draft} draggable={false} hitScale={view.scale} nodeRef={()=>{}} onEdit={()=>{}}/>}</Layer><Layer name="overlay">{laser&&<Line listening={false} points={laser.points} stroke="#ef4444" strokeWidth={4} lineCap="round" lineJoin="round" opacity={laser.opacity ?? .8}/>}<Transformer ref={transformer} rotateEnabled flipEnabled={false} boundBoxFunc={(oldBox,newBox)=>((newBox.width<8||newBox.height<8)&&transformer.current?.getActiveAnchor()!=='rotater'?oldBox:newBox)} enabledAnchors={['top-left','top-center','top-right','middle-left','middle-right','bottom-left','bottom-center','bottom-right']} /></Layer></Stage>{editing&&<textarea ref={editorRef} className="text-editor" style={{left:editing.x*view.scale+view.x,top:editing.y*view.scale+view.x}} value={editing.value} onChange={event=>setEditing({...editing,value:event.target.value})} onBlur={finishText} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();finishText()}if(event.key==='Escape')setEditing(null)}}/>}</div>
}
