import { useEffect, useMemo, useRef, useState } from 'react'
import { Arrow, Circle, Ellipse, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva'
import { useAppState } from '../../context/AppStateContext'
import { useHistory } from '../../context/HistoryContext'
import { newId } from '../../lib/idGenerator'
import { getSnapGuides, snapToGrid } from '../../lib/snapping'
import { useStageZoomPan } from '../../hooks/useStageZoomPan'

const MIN_SIZE = 5
const dashValue = dash => dash === 'dashed' ? [10, 6] : dash === 'dotted' ? [2, 6] : []
const isPointShape = type => ['arrow', 'line', 'pen'].includes(type)

function shapeBounds(shape) {
  if (!isPointShape(shape.type)) return { x: shape.x, y: shape.y, width: shape.width || 0, height: shape.height || 0 }
  const xs = shape.points.filter((_, index) => index % 2 === 0)
  const ys = shape.points.filter((_, index) => index % 2 === 1)
  return { x: shape.x + Math.min(...xs), y: shape.y + Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) }
}

function Grid({ width, height }) {
  const dots = useMemo(() => { const items=[]; for(let x=-2000;x<width+2000;x+=20) for(let y=-2000;y<height+2000;y+=20) items.push(<Circle key={`${x}-${y}`} x={x} y={y} radius={1} fill="#cbd5e1" opacity={.6} />); return items }, [width,height])
  return <Layer listening={false}><Rect x={-2000} y={-2000} width={width+4000} height={height+4000} fill="#f8fafc" />{dots}</Layer>
}

/** Renders each serializable shape using one top-left position model. */
function Shape({ shape, nodeRef, onDragMove, onDragEnd, onTransformEnd, onEdit, draggable = true }) {
  const interaction = { id: shape.id, shapeId: shape.id, ref: nodeRef, draggable, onDragMove, onDragEnd, onDblClick: onEdit, onDblTap: onEdit }
  const paint = { stroke: shape.stroke, strokeWidth: shape.strokeWidth, fill: shape.fill === 'transparent' ? undefined : shape.fill, opacity: shape.opacity, dash: dashValue(shape.dash), rotation: shape.rotation || 0 }
  if (shape.type === 'rectangle') return <Rect {...interaction} {...paint} x={shape.x} y={shape.y} width={shape.width} height={shape.height} cornerRadius={shape.cornerRadius ?? 4} onTransformEnd={onTransformEnd} />
  if (shape.type === 'ellipse') return <Ellipse {...interaction} {...paint} x={shape.x + shape.width / 2} y={shape.y + shape.height / 2} radiusX={shape.width / 2} radiusY={shape.height / 2} onTransformEnd={onTransformEnd} />
  if (shape.type === 'arrow') return <Arrow {...interaction} {...paint} x={shape.x} y={shape.y} points={shape.points} pointerLength={10} pointerWidth={10} fill={shape.stroke} onTransformEnd={onTransformEnd} />
  if (shape.type === 'line') return <Line {...interaction} {...paint} x={shape.x} y={shape.y} points={shape.points} lineCap="round" lineJoin="round" onTransformEnd={onTransformEnd} />
  if (shape.type === 'pen') return <Line {...interaction} {...paint} x={shape.x} y={shape.y} points={shape.points} lineCap="round" lineJoin="round" tension={.35} onTransformEnd={onTransformEnd} />
  return <Text {...interaction} x={shape.x} y={shape.y} text={shape.text} fontSize={shape.fontSize || 20} fill={shape.stroke} opacity={shape.opacity} width={shape.width} rotation={shape.rotation || 0} draggable onTransformEnd={onTransformEnd} />
}

export default function CanvasStage({ stageRef, view, setView }) {
  const { state, dispatch } = useAppState()
  const { shapes, commit } = useHistory()
  const hostRef = useRef(); const nodes = useRef({}); const refCallbacks = useRef({}); const transformer = useRef(); const editorRef = useRef()
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [draft, setDraft] = useState(null); const draftRef = useRef(null)
  const [laser, setLaser] = useState(null); const [editing, setEditing] = useState(null); const [guides, setGuides] = useState([])
  const start = useRef(null); const pan = useRef(null); const space = useRef(false)
  const { stageProps } = useStageZoomPan(stageRef, view, setView)

  const updateDraft = next => { draftRef.current = next; setDraft(next) }
  useEffect(() => {
    const resize = () => {
      const rect = hostRef.current?.getBoundingClientRect()
      setSize({ width: Math.round(rect?.width || window.innerWidth), height: Math.round(rect?.height || window.innerHeight) })
    }
    const observer = new ResizeObserver(resize)
    if (hostRef.current) observer.observe(hostRef.current)
    resize()
    const key=e=>{if(e.code==='Space')space.current=e.type==='keydown'}
    addEventListener('keydown',key); addEventListener('keyup',key)
    return()=>{observer.disconnect();removeEventListener('keydown',key);removeEventListener('keyup',key)}
  }, [])
  useEffect(() => { if (!editing) return; const frame=requestAnimationFrame(()=>editorRef.current?.focus()); return()=>cancelAnimationFrame(frame) }, [editing])
  useEffect(() => { const selected=state.selectedShapeIds.map(id=>nodes.current[id]).filter(Boolean); transformer.current?.nodes(selected); transformer.current?.getLayer()?.batchDraw() }, [state.selectedShapeIds, shapes])
  useEffect(() => { const liveIds=new Set(shapes.map(shape=>shape.id)); Object.keys(refCallbacks.current).forEach(id=>{if(!liveIds.has(id)){delete refCallbacks.current[id];delete nodes.current[id]}}) }, [shapes])
  useEffect(() => () => { nodes.current={}; refCallbacks.current={} }, [])

  const point = () => { const p=stageRef.current.getPointerPosition(); return { x:(p.x-view.x)/view.scale, y:(p.y-view.y)/view.scale } }
  const targetShapeId = target => target?.getAttr('shapeId') || null
  const finishText = () => { if(!editing) return; const text=editing.value.trim(); if(text) { if(editing.id) commit(shapes.map(s=>s.id===editing.id?{...s,text}:s)); else commit([...shapes,{id:newId(),type:'text',x:editing.x,y:editing.y,width:220,text,...state.activeStyle}]) } setEditing(null) }

  const down = event => {
    if (event.evt.button === 1 || space.current) { pan.current={x:event.evt.clientX,y:event.evt.clientY,view}; return }
    const id=targetShapeId(event.target)
    if (state.activeTool === 'select') { const ids=state.selectedShapeIds; dispatch({type:'SET_SELECTION',ids:id ? (event.evt.shiftKey ? (ids.includes(id)?ids.filter(value=>value!==id):[...ids,id]) : [id]) : []}); return }
    const p=point()
    if (state.activeTool === 'eraser') { if(id) commit(shapes.filter(shape=>shape.id!==id)); return }
    if (state.activeTool === 'text') { setEditing({ ...p, value:'' }); return }
    start.current=p
    const base={id:newId(),type:state.activeTool,...state.activeStyle,x:p.x,y:p.y}
    if(['arrow','line','pen'].includes(base.type)) base.points=[0,0]
    if(base.type==='laser') { setLaser({points:[p.x,p.y]}); return }
    updateDraft(base)
  }
  const move = event => {
    if(pan.current){const origin=pan.current;setView({...origin.view,x:origin.view.x+event.evt.clientX-origin.x,y:origin.view.y+event.evt.clientY-origin.y});return}
    if(!start.current) return
    let p=point()
    if(event.evt.shiftKey&&['line','arrow'].includes(state.activeTool)){const dx=p.x-start.current.x,dy=p.y-start.current.y,angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4,distance=Math.hypot(dx,dy);p={x:start.current.x+Math.cos(angle)*distance,y:start.current.y+Math.sin(angle)*distance}}
    if(state.activeTool==='laser'){setLaser(current=>({...current,points:[...current.points,p.x,p.y]}));return}
    const current=draftRef.current; if(!current) return
    if(current.type==='pen') updateDraft({...current,points:[...current.points,p.x-current.x,p.y-current.y]})
    else if(['arrow','line'].includes(current.type)) updateDraft({...current,points:[0,0,p.x-current.x,p.y-current.y]})
    else updateDraft({...current,width:p.x-current.x,height:p.y-current.y})
  }
  const up = () => {
    if(pan.current){pan.current=null;return}
    if(laser){let opacity=1;const fade=()=>{opacity-=.06;if(opacity>0){setLaser(current=>current&&({...current,opacity}));requestAnimationFrame(fade)}else setLaser(null)};requestAnimationFrame(fade);start.current=null;return}
    const current=draftRef.current
    if(current){let completed=current;if(['rectangle','ellipse'].includes(current.type)) completed={...current,x:Math.min(current.x,current.x+current.width),y:Math.min(current.y,current.y+current.height),width:Math.abs(current.width),height:Math.abs(current.height)};const valid=isPointShape(completed.type)?completed.points.length>3:completed.width>MIN_SIZE&&completed.height>MIN_SIZE;if(valid)commit([...shapes,completed]);updateDraft(null)}
    start.current=null
  }

  // Drag preview owns snapping; commit exactly the position preview left on the Konva node.
  const commitPosition = (id, position) => { setGuides([]); commit(shapes.map(shape=>shape.id===id?{...shape,x:position.x,y:position.y}:shape)) }
  const previewSnap = (shape, event) => { const node=event.target; const offset=shape.type==='ellipse'?{x:shape.width/2,y:shape.height/2}:{x:0,y:0}; const position={x:node.x()-offset.x,y:node.y()-offset.y}; const grid=snapToGrid(position.x,position.y); const snap=getSnapGuides({...shapeBounds(shape),x:position.x,y:position.y},shapes.filter(other=>other.id!==shape.id).map(shapeBounds)); const x=snap.snapped.x ?? grid.x; const y=snap.snapped.y ?? grid.y; node.position({x:x+offset.x,y:y+offset.y}); setGuides(snap.guides) }
  const commitTransform = (shape, node) => {
    const scaleX=Math.abs(node.scaleX()),scaleY=Math.abs(node.scaleY()),rotation=node.rotation()
    node.scaleX(1); node.scaleY(1)
    if(shape.type==='ellipse'){const width=Math.max(MIN_SIZE,shape.width*scaleX),height=Math.max(MIN_SIZE,shape.height*scaleY);commit(shapes.map(s=>s.id===shape.id?{...s,x:node.x()-width/2,y:node.y()-height/2,width,height,rotation}:s));return}
    if(shape.type==='rectangle'||shape.type==='text'){const width=Math.max(MIN_SIZE,shape.width*scaleX);const height=shape.type==='rectangle'?Math.max(MIN_SIZE,shape.height*scaleY):shape.height;commit(shapes.map(s=>s.id===shape.id?{...s,x:node.x(),y:node.y(),width,height,rotation}:s));return}
    if(isPointShape(shape.type)){const points=shape.points.map((value,index)=>value*(index%2?scaleY:scaleX));commit(shapes.map(s=>s.id===shape.id?{...s,x:node.x(),y:node.y(),points,rotation}:s))}
  }
  const refFor = id => refCallbacks.current[id] || (refCallbacks.current[id] = node => { if(node) nodes.current[id]=node; else delete nodes.current[id] })
  const editShape = shape => { if(shape.type==='text') setEditing({id:shape.id,x:shape.x,y:shape.y,value:shape.text}) }
  return <div ref={hostRef} className="canvas-host"><Stage ref={stageRef} width={size.width} height={size.height} {...stageProps} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onContextMenu={event=>event.evt.preventDefault()}><Grid {...size}/><Layer>{shapes.map(shape=><Shape key={shape.id} shape={shape} nodeRef={refFor(shape.id)} onDragMove={event=>previewSnap(shape,event)} onDragEnd={event=>{const offset=shape.type==='ellipse'?{x:shape.width/2,y:shape.height/2}:{x:0,y:0};commitPosition(shape.id,{x:event.target.x()-offset.x,y:event.target.y()-offset.y})}} onTransformEnd={event=>commitTransform(shape,event.target)} onEdit={()=>editShape(shape)}/>)}{draft&&<Shape shape={draft} draggable={false} nodeRef={()=>{}} onDragMove={()=>{}} onDragEnd={()=>{}} onTransformEnd={()=>{}} onEdit={()=>{}}/>}</Layer><Layer name="overlay">{guides.map((guide,index)=><Line key={index} listening={false} points={guide.orientation==='vertical'?[guide.value,-10000,guide.value,10000]:[-10000,guide.value,10000,guide.value]} stroke="#6366f1" dash={[5,5]}/>) }{laser&&<Line listening={false} points={laser.points} stroke="#ef4444" strokeWidth={4} lineCap="round" lineJoin="round" opacity={laser.opacity ?? .8}/>}<Transformer ref={transformer} rotateEnabled flipEnabled={false} boundBoxFunc={(oldBox,newBox)=>newBox.width<8||newBox.height<8?oldBox:newBox} enabledAnchors={['top-left','top-right','bottom-left','bottom-right']} /></Layer></Stage>{editing&&<textarea ref={editorRef} className="text-editor" style={{left:editing.x*view.scale+view.x,top:editing.y*view.scale+view.y}} value={editing.value} onChange={event=>setEditing({...editing,value:event.target.value})} onBlur={finishText} onKeyDown={event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();finishText()}if(event.key==='Escape')setEditing(null)}}/>}</div>
}
