import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { clampScale, centeredZoom } from '../../lib/viewport'

const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.5]

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

export default function ZoomControls({ view, setView }) {
  const [open, setOpen] = useState(false)
  const [popoverPosition, setPopoverPosition] = useState(null)
  const wrapRef = useRef(null)
  const percentRef = useRef(null)
  const popoverRef = useRef(null)
  const currentPercent = Math.round(view.scale * 100)

  const change = direction => setView(current => {
    const next = clampScale(current.scale * (direction > 0 ? 1.15 : 1 / 1.15))
    return next === current.scale ? current : centeredZoom(current, next)
  })
  const applyZoom = scale => {
    setView(current => centeredZoom(current, clampScale(scale)))
    setOpen(false)
  }
  const toggleFullscreen = async () => { try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.(); else await document.exitFullscreen?.() } catch {} }

  useLayoutEffect(() => {
    if (!open) {
      setPopoverPosition(null)
      return undefined
    }
    const updatePosition = () => {
      const trigger = percentRef.current
      const popover = popoverRef.current
      if (!trigger || !popover) return
      const triggerRect = trigger.getBoundingClientRect()
      const width = popover.offsetWidth || 84
      const height = popover.offsetHeight || 190
      const gutter = 8
      const left = Math.min(
        Math.max(triggerRect.left + triggerRect.width / 2 - width / 2, gutter),
        Math.max(gutter, window.innerWidth - width - gutter),
      )
      const top = Math.max(gutter, triggerRect.top - height - 6)
      setPopoverPosition({ left, top })
    }
    updatePosition()
    const frame = window.requestAnimationFrame(updatePosition)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDocClick = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="zoom-controls" ref={wrapRef}>
      <button title="Zoom out" aria-label="Zoom out" onClick={() => change(-1)}>−</button>
      <button
        className="zoom-percent-btn"
        title="Zoom levels"
        aria-haspopup="true"
        aria-expanded={open}
        ref={percentRef}
        onClick={() => setOpen(o => !o)}
      >{currentPercent}%</button>
      <button title="Zoom in" aria-label="Zoom in" onClick={() => change(1)}>+</button>
      <span className="zoom-divider" aria-hidden="true" />
      <button title="Toggle fullscreen" aria-label="Toggle fullscreen" className="fullscreen-button" onClick={toggleFullscreen}>⤢</button>
      {open && (
        <div
          ref={popoverRef}
          className="zoom-popover"
          role="menu"
          style={popoverPosition ? { left: `${popoverPosition.left}px`, top: `${popoverPosition.top}px` } : undefined}
        >
          {ZOOM_LEVELS.map(level => {
            const percent = Math.round(level * 100)
            const active = percent === currentPercent
            return (
              <button
                key={level}
                role="menuitemradio"
                aria-checked={active}
                className={active ? 'is-active' : ''}
                onClick={() => applyZoom(level)}
              >{percent}%</button>
            )
          })}
        </div>
      )}
    </div>
  )
}