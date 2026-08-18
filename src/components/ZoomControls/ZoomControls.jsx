import { clampScale, centeredZoom } from '../../lib/viewport'

export function fitViewToContent(shapes, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight) {
  const list = shapes || []
  if (list.length === 0) return null
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  list.forEach(s => {
    const w = s.width || 0, h = s.height || 0
    if (s.x < minX) minX = s.x; if (s.y < minY) minY = s.y
    if (s.x + w > maxX) maxX = s.x + w; if (s.y + h > maxY) maxY = s.y + h
  })
  const padding = 40
  const contentW = maxX - minX + padding * 2, contentH = maxY - minY + padding * 2
  const scale = clampScale(Math.min(viewportWidth / contentW, viewportHeight / contentH))
  return { scale, x: viewportWidth / 2 - (minX + (maxX - minX) / 2) * scale, y: viewportHeight / 2 - (minY + (maxY - minY) / 2) * scale }
}

export default function ZoomControls({ view, setView, cursorPos, shapes }) {
  const change = direction => setView(current => {
    const next = clampScale(current.scale * (direction > 0 ? 1.15 : 1 / 1.15))
    return next === current.scale ? current : centeredZoom(current, next)
  })
  const fitToContent = () => setView(fitViewToContent(shapes, window.innerWidth, window.innerHeight))
  const count = shapes?.length
  return <div className="zoom-controls"><button title="Zoom out" aria-label="Zoom out" onClick={()=>change(-1)}>−</button><button title="Reset zoom (double-click)" onDoubleClick={()=>setView({x:0,y:0,scale:1})} onClick={()=>setView({x:0,y:0,scale:1})}>{Math.round(view.scale*100)}%</button><button title="Zoom in" aria-label="Zoom in" onClick={()=>change(1)}>+</button><button title="Zoom to fit" aria-label="Zoom to fit" onClick={fitToContent}>⤢</button>{cursorPos&&<span className="cursor-pos" style={{marginLeft:8,fontSize:11,opacity:.6,fontVariantNumeric:'tabular-nums'}}>{Math.round(cursorPos.x)}, {Math.round(cursorPos.y)}</span>}{count!=null&&<span className="shape-count" style={{marginLeft:8,fontSize:11,opacity:.5}}>{count} shape{count!==1?'s':''}</span>}</div>
}