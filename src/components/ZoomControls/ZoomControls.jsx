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

export default function ZoomControls({ view, setView }) {
  const change = direction => setView(current => {
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current.scale * (direction > 0 ? 1.15 : 1 / 1.15)))
    return next === current.scale ? current : centeredZoom(current, next)
  })
  return <div className="zoom-controls"><button title="Zoom out" aria-label="Zoom out" onClick={()=>change(-1)}>−</button><button title="Reset zoom" onClick={()=>setView({x:0,y:0,scale:1})}>{Math.round(view.scale*100)}%</button><button title="Zoom in" aria-label="Zoom in" onClick={()=>change(1)}>+</button></div>
}
