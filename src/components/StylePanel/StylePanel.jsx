import { useEffect, useMemo, useRef } from 'react'
import { useAppState } from '../../context/AppStateContext'
import { useHistory } from '../../context/HistoryContext'

const colors=['#1e293b','#2563eb','#7c3aed','#db2777','#dc2626','#ea580c','#16a34a','#ffffff']

function Section({ title, children }) { return <section className="inspector-section"><h3>{title}</h3>{children}</section> }
function Field({ label, children }) { return <label className="inspector-field"><span>{label}</span>{children}</label> }

export default function StylePanel() {
  const { state, dispatch } = useAppState()
  const { shapes, commit } = useHistory()
  const selected = useMemo(() => shapes.filter(shape => state.selectedShapeIds.includes(shape.id)), [shapes, state.selectedShapeIds])
  const selectedShape = selected[0]
  const noStyleTools = ['select', 'pan', 'eraser', 'laser']
  const visible = (!noStyleTools.includes(state.activeTool)) || selected.length
  useEffect(() => { if (!selectedShape) return; if(selectedShape.type==='image'){dispatch({type:'SET_STYLE',style:{opacity:selectedShape.opacity ?? 1}});return} const { stroke, strokeWidth, dash, fill, opacity, cornerRadius, fontSize } = selectedShape; dispatch({ type: 'SET_STYLE', style: { stroke, strokeWidth, dash, fill, opacity, cornerRadius: cornerRadius ?? 4, fontSize: fontSize ?? 20 } }) }, [selectedShape?.id])
  const pendingStyle = useRef(null)
  const timerRef = useRef(null)
  const shapesRef = useRef(shapes); shapesRef.current = shapes
  const selectedRef = useRef(state.selectedShapeIds); selectedRef.current = state.selectedShapeIds
  const commitRef = useRef(null)
  if (!commitRef.current) {
    commitRef.current = () => {
      const style = pendingStyle.current
      pendingStyle.current = null
      if (!style) return
      const selected = new Set(selectedRef.current)
      commit(shapesRef.current.map(shape => selected.has(shape.id) && !shape.locked ? { ...shape, ...style } : shape))
    }
  }
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); commitRef.current() }, [])
  const update = style => {
    dispatch({ type: 'SET_STYLE', style })
    pendingStyle.current = { ...(pendingStyle.current || {}), ...style }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(commitRef.current, 250)
  }
  const updateImages = (updateShape, includeLocked=false) => commit(shapes.map(shape => state.selectedShapeIds.includes(shape.id) && shape.type==='image' && (includeLocked||!shape.locked) ? updateShape(shape) : shape))
  const toggleImage = property => updateImages(shape => ({ ...shape, [property]: !shape[property] }))
  const toggleLock = () => { const lock=selected.some(shape=>shape.type==='image'&&!shape.locked); updateImages(shape=>({...shape,locked:lock}),true) }
  const reorder = direction => { const ids=new Set(state.selectedShapeIds); const selectedShapes=shapes.filter(shape=>ids.has(shape.id)); const otherShapes=shapes.filter(shape=>!ids.has(shape.id)); commit(direction==='front'?[...otherShapes,...selectedShapes]:[...selectedShapes,...otherShapes]) }
  const isText = selectedShape?.type === 'text' || state.activeTool === 'text'
  const isRectangle = selectedShape?.type === 'rectangle' || state.activeTool === 'rectangle'
  const hasImage = selected.some(shape=>shape.type==='image')
  const imagesOnly = selected.length>0 && selected.every(shape=>shape.type==='image')
  if (!visible) return null
  return <aside className="style-panel" aria-label="Properties inspector">
    <header className="inspector-header"><div><span className="eyebrow">Properties</span><h2>{selected.length > 1 ? `${selected.length} objects` : selectedShape ? selectedShape.type : 'Default style'}</h2></div><span className="selection-dot"/></header>
    <Section title="Appearance">
      {!imagesOnly && <Field label="Stroke"><div className="swatches">{colors.map(color=><button key={color} title={color} aria-label={`Stroke ${color}`} className={state.activeStyle.stroke===color?'chosen':''} style={{background:color}} onClick={()=>update({stroke:color})}/>)}</div></Field>}
      {!imagesOnly && <Field label="Fill"><div className="fill-control"><input type="color" aria-label="Fill color" value={state.activeStyle.fill==='transparent'?'#ffffff':state.activeStyle.fill} onChange={e=>update({fill:e.target.value})}/><button className="clear-fill" onClick={()=>update({fill:'transparent'})}>No fill</button></div></Field>}
      <Field label="Opacity"><div className="range-control"><input type="range" min="10" max="100" value={Math.round((state.activeStyle.opacity ?? 1)*100)} onChange={e=>update({opacity:+e.target.value/100})}/><output>{Math.round((state.activeStyle.opacity ?? 1)*100)}%</output></div></Field>
    </Section>
    {!imagesOnly && <Section title="Stroke">
      <Field label="Width"><div className="range-control"><input type="range" min="1" max="16" value={state.activeStyle.strokeWidth} onChange={e=>update({strokeWidth:+e.target.value})}/><output>{state.activeStyle.strokeWidth}px</output></div></Field>
      <Field label="Style"><select value={state.activeStyle.dash} onChange={e=>update({dash:e.target.value})}><option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option></select></Field>
    </Section>}
    {isRectangle && <Section title="Shape"><Field label="Corner radius"><div className="range-control"><input type="range" min="0" max="32" value={state.activeStyle.cornerRadius ?? 4} onChange={e=>update({cornerRadius:+e.target.value})}/><output>{state.activeStyle.cornerRadius ?? 4}</output></div></Field></Section>}
    {isText && <Section title="Typography"><Field label="Size"><div className="range-control"><input type="range" min="12" max="64" value={state.activeStyle.fontSize ?? 20} onChange={e=>update({fontSize:+e.target.value})}/><output>{state.activeStyle.fontSize ?? 20}px</output></div></Field></Section>}
    {hasImage && <Section title="Image"><div className="image-actions"><button onClick={()=>toggleImage('flipX')}>Flip horizontal</button><button onClick={()=>toggleImage('flipY')}>Flip vertical</button><button onClick={toggleLock}>{selected.every(shape=>shape.type!=='image'||shape.locked)?'Unlock':'Lock'}</button></div><div className="image-actions"><button onClick={()=>reorder('front')}>Bring to front</button><button onClick={()=>reorder('back')}>Send to back</button></div></Section>}
  </aside>
}
