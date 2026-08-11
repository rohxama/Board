import { useEffect, useRef } from 'react'

const deltaUnit = native => {
  if (native.deltaMode === 1) return 16
  if (native.deltaMode === 2) return 100
  return 1
}

const MIN_SCALE = 0.25
const MAX_SCALE = 3

export function useStageZoomPan(stageRef, view, setView, onWheelPan) {
  const rafRef = useRef(0)
  const acc = useRef({ dx: 0, dy: 0, zoomFactor: 1, point: null, mode: null, xOnly: false })

  const flushWheel = () => {
    const a = acc.current
    if (a.mode === 'zoom' && a.zoomFactor !== 1 && a.point) {
      const point = a.point
      setView(current => {
        const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, current.scale * a.zoomFactor))
        return { scale, x: point.x - (point.x - current.x) * scale / current.scale, y: point.y - (point.y - current.y) * scale / current.scale }
      })
    } else if (a.mode === 'pan' && (a.dx || a.dy)) {
      setView(current => a.xOnly ? { ...current, x: current.x - (a.dx || a.dy) } : { ...current, x: current.x - a.dx, y: current.y - a.dy })
    }
    a.dx = 0; a.dy = 0; a.zoomFactor = 1; a.point = null; a.mode = null; a.xOnly = false
  }

  const schedule = () => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      flushWheel()
    })
  }

  // On unmount any accumulated (but not yet applied) wheel delta is dropped.
  useEffect(() => () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0 } }, [])

  const onWheel = e => {
    const native = e.evt
    const stage = stageRef.current
    if (!stage) return
    native.preventDefault()
    // Normalize Firefox (deltaMode 1 = lines) and some browsers' page mode (deltaMode 2)
    // to pixel units so zoom/pan behaves identically in Chrome, Edge, Firefox and Safari.
    const unit = deltaUnit(native)
    const dx = (native.deltaX || 0) * unit
    const dy = (native.deltaY || 0) * unit
    const point = stage.getPointerPosition()
    const a = acc.current
    if (native.ctrlKey || native.metaKey) {
      if (!point) return
      // Dampen so one "notch" is a similar zoom regardless of line-vs-pixel reporting.
      const delta = Math.max(-4, Math.min(4, -dy / 60))
      if (delta === 0) return
      a.mode = 'zoom'
      a.zoomFactor *= (1 + delta * 0.1)
      a.point = point
    } else {
      // Plain wheel/trackpad pan is handled imperatively by the caller (stage
      // node mutation + rAF-coalesced culling) so it doesn't re-render React at
      // event rate. The rAF accumulate path below is a safe fallback.
      if (onWheelPan) { onWheelPan(dx, dy, !!native.shiftKey); return }
      a.mode = 'pan'
      a.xOnly = !!native.shiftKey
      a.dx += dx
      a.dy += dy
    }
    schedule()
  }
  return { stageProps: { x: view.x, y: view.y, scaleX: view.scale, scaleY: view.scale, onWheel, draggable: false } }
}