import { useEffect, useRef, useState, memo } from 'react'
import { useAppState } from '../../context/AppStateContext'
import { useHistory } from '../../context/HistoryContext'

const STROKE_SWATCHES = ['#111111', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']
const BG_SWATCHES = ['#111111', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']
const FILL_TYPES = ['rectangle', 'ellipse', 'diamond']
const STROKE_TYPES = ['rectangle', 'ellipse', 'diamond', 'arrow', 'line', 'pen']
const COMPATIBLE_TOOLS = ['rectangle', 'ellipse', 'diamond', 'arrow', 'line', 'pen', 'text']
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 48]
const DASH_OPTIONS = [{ value: 'solid', label: 'Solid' }, { value: 'dashed', label: 'Dashed' }, { value: 'dotted', label: 'Dotted' }]
const WIDTH_OPTIONS = [{ value: 1, label: 'Thin' }, { value: 3, label: 'Medium' }, { value: 6, label: 'Thick' }]

function Section({ label, children }) { return <section className="inspector-section"><h3>{label}</h3>{children}</section> }

function OptionBtn({ selected, onClick, children, title }) { return <button type="button" className={`option-btn${selected ? ' is-selected' : ''}`} title={title} onClick={onClick}>{children}</button> }

function LayerIcon({ kind }) {
  const thin = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (kind === 'front') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21h14M12 14V4M7 9l5-5 5 5" {...thin} /></svg>
  if (kind === 'forward') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21h14M12 13V6M8 10l4-4 4 4" {...thin} /></svg>
  if (kind === 'backward') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14M12 6v7M8 10l4 4 4-4" {...thin} /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14M12 4v10M7 10l5 5 5-5" {...thin} /></svg>
}

export default memo(function StylePanel() {
  const { state, dispatch } = useAppState()
  const { shapes, commit } = useHistory()
  const [tab, setTab] = useState('style')
  const selected = state.selectedShapeIds.length ? shapes.filter(shape => state.selectedShapeIds.includes(shape.id)) : []
  const selectedShape = selected[0]
  const hasSelection = selected.length > 0
  const isCompatibleTool = COMPATIBLE_TOOLS.includes(state.activeTool)
  const showPanel = hasSelection || isCompatibleTool

  const imagesOnly = hasSelection && selected.every(shape => shape.type === 'image')
  const hasImage = selected.some(shape => shape.type === 'image')
  const isText = !imagesOnly && (selectedShape?.type === 'text' || (!hasSelection && state.activeTool === 'text'))
  const allOf = types => hasSelection ? selected.every(shape => types.includes(shape.type)) : types.includes(state.activeTool)
  const showStroke = !imagesOnly
  const showFill = !imagesOnly && allOf(FILL_TYPES)
  const showStrokeDetails = !imagesOnly && allOf(STROKE_TYPES)
  const showEdges = allOf(['rectangle'])
  const showFont = isText
  const showLayers = state.selectedShapeIds.length > 0

  useEffect(() => { if (!selectedShape) return; if (selectedShape.type === 'image') { dispatch({ type: 'SET_STYLE', style: { opacity: selectedShape.opacity ?? 1 } }); return } const { stroke, strokeWidth, dash, fill, opacity, cornerRadius, fontSize } = selectedShape; dispatch({ type: 'SET_STYLE', style: { stroke, strokeWidth, dash, fill, opacity, cornerRadius: cornerRadius ?? 8, fontSize: fontSize ?? 20 } }) }, [selectedShape?.id])

  const pendingStyle = useRef(null)
  const timerRef = useRef(null)
  const shapesRef = useRef(shapes); shapesRef.current = shapes
  const selectedRef = useRef(state.selectedShapeIds); selectedRef.current = state.selectedShapeIds
  const commitRef = useRef(commit); commitRef.current = commit
  const flushRef = useRef(null)
  flushRef.current = () => {
    const pending = pendingStyle.current
    pendingStyle.current = null
    if (!pending) return
    const ids = new Set(pending.ids)
    commitRef.current(prev => prev.map(shape => ids.has(shape.id) && !shape.locked ? { ...shape, ...pending.style } : shape))
  }
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); flushRef.current() }, [])
  const update = style => {
    dispatch({ type: 'SET_STYLE', style })
    if (!selectedRef.current.length) return
    pendingStyle.current = pendingStyle.current ? { ...pendingStyle.current, style: { ...pendingStyle.current.style, ...style } } : { ids: [...selectedRef.current], style: { ...style } }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => flushRef.current(), 250)
  }
  const updateImages = (updateShape, includeLocked = false) => commit(prev => prev.map(shape => state.selectedShapeIds.includes(shape.id) && shape.type === 'image' && (includeLocked || !shape.locked) ? updateShape(shape) : shape))
  const toggleImage = property => updateImages(shape => ({ ...shape, [property]: !shape[property] }))
  const toggleLock = () => { const lock = selected.some(shape => shape.type === 'image' && !shape.locked); updateImages(shape => ({ ...shape, locked: lock }), true) }
  const reorder = direction => {
    const ids = new Set(state.selectedShapeIds)
    const locked = new Set(shapesRef.current.filter(shape => shape.locked).map(shape => shape.id))
    commit(prev => {
      const movable = prev.filter(shape => ids.has(shape.id) && !shape.locked)
      if (!movable.length) return prev
      if (direction === 'front' || direction === 'back') {
        const movedIds = new Set(movable.map(shape => shape.id))
        const others = prev.filter(shape => !movedIds.has(shape.id))
        return direction === 'front' ? [...others, ...movable] : [...movable, ...others]
      }
      const next = [...prev]
      const indices = []
      next.forEach((shape, index) => { if (ids.has(shape.id) && !locked.has(shape.id)) indices.push(index) })
      const step = direction === 'forward' ? 1 : -1
      const sorted = direction === 'forward' ? [...indices].sort((a, b) => b - a) : [...indices].sort((a, b) => a - b)
      let changed = false
      for (const index of sorted) {
        const target = index + step
        if (target < 0 || target >= next.length) continue
        const neighbor = next[target]
        if (ids.has(neighbor.id) || locked.has(neighbor.id)) continue
        next[index] = neighbor
        next[target] = prev[index]
        changed = true
      }
      return changed ? next : prev
    })
  }

  const fillTransparent = state.activeStyle.fill === 'transparent'
  const opacityPct = Math.round((state.activeStyle.opacity ?? 1) * 100)
  const strokeWidth = state.activeStyle.strokeWidth ?? 2
  const cornerRadius = Math.min(state.activeStyle.cornerRadius ?? 0, 24)
  const fontSize = state.activeStyle.fontSize ?? 20
  const fontSizes = FONT_SIZES.includes(fontSize) ? FONT_SIZES : [...FONT_SIZES, fontSize].sort((a, b) => a - b)

  if (!showPanel) return null

  return <aside className="style-panel" aria-label="Properties inspector">
    <div className="inspector-tabs" role="tablist" aria-label="Inspector sections">
      <button type="button" role="tab" aria-selected={tab === 'style'} className={`inspector-tab${tab === 'style' ? ' is-active' : ''}`} onClick={() => setTab('style')}>Style</button>
      <button type="button" role="tab" aria-selected={tab === 'arrange'} className={`inspector-tab${tab === 'arrange' ? ' is-active' : ''}`} onClick={() => setTab('arrange')}>Arrange</button>
    </div>
    <div className="inspector-body">
      {tab === 'style' ? <>
        {showStroke && <Section label="Stroke">
          <div className="swatch-row">
            {STROKE_SWATCHES.map(color => <button key={color} type="button" className={`swatch${state.activeStyle.stroke === color ? ' is-selected' : ''}`} style={{ background: color }} title={color} aria-label={`Stroke ${color}`} onClick={() => update({ stroke: color })} />)}
          </div>
        </Section>}
        {showFill && <Section label="Background">
          <div className="swatch-row">
            {BG_SWATCHES.map(color => <button key={color} type="button" className={`swatch${state.activeStyle.fill === color ? ' is-selected' : ''}`} style={{ background: color }} title={color} aria-label={`Fill ${color}`} onClick={() => update({ fill: color })} />)}
          </div>
        </Section>}
        {showFill && <Section label="Fill">
          <div className="option-row">
            <OptionBtn selected={!fillTransparent} onClick={() => { if (fillTransparent) update({ fill: STROKE_SWATCHES[0] }) }} title="Solid fill">
              <svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /></svg>
            </OptionBtn>
            <OptionBtn selected={fillTransparent} onClick={() => { if (!fillTransparent) update({ fill: 'transparent' }) }} title="No fill">
              <svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </OptionBtn>
          </div>
        </Section>}
        {showStrokeDetails && <>
          <Section label="Stroke width">
            <div className="option-row">
              {WIDTH_OPTIONS.map(opt => <OptionBtn key={opt.value} selected={strokeWidth === opt.value} onClick={() => update({ strokeWidth: opt.value })} title={opt.label}>
                <svg viewBox="0 0 24 24"><path d="M4 12h16" stroke="currentColor" strokeWidth={opt.value} strokeLinecap="round" /></svg>
              </OptionBtn>)}
            </div>
          </Section>
          <Section label="Stroke style">
            <div className="option-row">
              {DASH_OPTIONS.map(opt => <OptionBtn key={opt.value} selected={state.activeStyle.dash === opt.value} onClick={() => update({ dash: opt.value })} title={opt.label}>
                <svg viewBox="0 0 24 24"><path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray={opt.value === 'dashed' ? '5 4' : opt.value === 'dotted' ? '0.1 3.4' : 'none'} /></svg>
              </OptionBtn>)}
            </div>
          </Section>
          {showEdges && <Section label="Edges">
            <div className="option-row">
              <OptionBtn selected={cornerRadius === 0} onClick={() => update({ cornerRadius: 0 })} title="Sharp corners">
                <svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              </OptionBtn>
              <OptionBtn selected={cornerRadius > 0} onClick={() => update({ cornerRadius: 8 })} title="Rounded corners">
                <svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
              </OptionBtn>
            </div>
          </Section>}
        </>}
        <Section label="Opacity">
          <div className="opacity-row">
            <span className="opacity-end-label">0</span>
            <input type="range" min="0" max="100" value={opacityPct} onChange={event => update({ opacity: +event.target.value / 100 })} aria-label="Opacity" />
            <span className="opacity-end-label">100</span>
          </div>
        </Section>
        {showFont && <Section label="Text">
          <div className="font-row">
            <span className="font-label">Font size</span>
            <span className="font-select"><select value={fontSize} onChange={event => update({ fontSize: +event.target.value })} aria-label="Font size">{fontSizes.map(size => <option key={size} value={size}>{size}px</option>)}</select><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 9 5 5 5-5Z" fill="currentColor" stroke="none" /></svg></span>
          </div>
        </Section>}
        {hasImage && <Section label="Image"><div className="image-actions"><button onClick={() => toggleImage('flipX')}>Flip horizontal</button><button onClick={() => toggleImage('flipY')}>Flip vertical</button><button onClick={toggleLock}>{selected.every(shape => shape.type !== 'image' || shape.locked) ? 'Unlock' : 'Lock'}</button></div></Section>}
      </> : <>
        <Section label="Layers"><div className="layer-row">
          <button type="button" className="option-square" title="Send to back" aria-label="Send to back" disabled={!showLayers} onClick={() => reorder('back')}><LayerIcon kind="back" /></button>
          <button type="button" className="option-square" title="Send backward" aria-label="Send backward" disabled={!showLayers} onClick={() => reorder('backward')}><LayerIcon kind="backward" /></button>
          <button type="button" className="option-square" title="Bring forward" aria-label="Bring forward" disabled={!showLayers} onClick={() => reorder('forward')}><LayerIcon kind="forward" /></button>
          <button type="button" className="option-square" title="Bring to front" aria-label="Bring to front" disabled={!showLayers} onClick={() => reorder('front')}><LayerIcon kind="front" /></button>
        </div></Section>
      </>}
    </div>
  </aside>
})
