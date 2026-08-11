const MIN_ZOOM = 0.25
const MAX_ZOOM = 3

/** Changes zoom while keeping the visual centre of the viewport fixed. */
function centeredZoom(view, nextScale) {
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  return {
    scale: nextScale,
    x: centerX - ((centerX - view.x) / view.scale) * nextScale,
    y: centerY - ((centerY - view.y) / view.scale) * nextScale,
  }
}

export default function ZoomControls({ view, setView, cursorPos, shapeCount }) {
  const change = direction => setView(current => {
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current.scale * (direction > 0 ? 1.15 : 1 / 1.15)))
    return next === current.scale ? current : centeredZoom(current, next)
  })
  const fitToContent = shapes => {
    if (!shapes || shapes.length === 0) return
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    shapes.forEach(s => {
      const w = s.width || 0, h = s.height || 0
      if (s.x < minX) minX = s.x; if (s.y < minY) minY = s.y
      if (s.x + w > maxX) maxX = s.x + w; if (s.y + h > maxY) maxY = s.y + h
    })
    const padding = 40
    const contentW = maxX - minX + padding * 2, contentH = maxY - minY + padding * 2
    const scaleX = window.innerWidth / contentW, scaleY = window.innerHeight / contentH
    const scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(scaleX, scaleY)))
    setView({ scale, x: window.innerWidth / 2 - (minX + (maxX - minX) / 2) * scale, y: window.innerHeight / 2 - (minY + (maxY - minY) / 2) * scale })
  }
  return <div className="zoom-controls"><button title="Zoom out" aria-label="Zoom out" onClick={()=>change(-1)}>−</button><button title="Reset zoom (double-click)" onDoubleClick={()=>setView({x:0,y:0,scale:1})} onClick={()=>setView({x:0,y:0,scale:1})}>{Math.round(view.scale*100)}%</button><button title="Zoom in" aria-label="Zoom in" onClick={()=>change(1)}>+</button>{cursorPos&&<span className="cursor-pos" style={{marginLeft:8,fontSize:11,opacity:.6,fontVariantNumeric:'tabular-nums'}}>{Math.round(cursorPos.x)}, {Math.round(cursorPos.y)}</span>}{shapeCount!=null&&<span className="shape-count" style={{marginLeft:8,fontSize:11,opacity:.5}}>{shapeCount} shape{shapeCount!==1?'s':''}</span>}</div>
}
