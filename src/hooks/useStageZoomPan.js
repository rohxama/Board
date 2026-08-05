const deltaUnit = native => {
  if (native.deltaMode === 1) return 16
  if (native.deltaMode === 2) return 100
  return 1
}

export function useStageZoomPan(stageRef, view, setView) {
  const onWheel = e => {
    const native=e.evt
    const stage=stageRef.current
    if (!stage) return
    native.preventDefault()
    // Normalize Firefox (deltaMode 1 = lines) and some browsers' page mode (deltaMode 2)
    // to pixel units so zoom/pan behaves identically in Chrome, Edge, Firefox and Safari.
    const unit=deltaUnit(native)
    const dx=(native.deltaX||0)*unit
    const dy=(native.deltaY||0)*unit
    if (native.ctrlKey || native.metaKey) {
      const point=stage.getPointerPosition()
      if(!point) return
      setView(current=>{
        // Dampen so one "notch" is a similar zoom regardless of line-vs-pixel reporting.
        const delta=Math.max(-4,Math.min(4,-dy/60))
        const scale=Math.max(.25,Math.min(3,current.scale*(1+delta*0.1)))
        return { scale, x:point.x-(point.x-current.x)*scale/current.scale, y:point.y-(point.y-current.y)*scale/current.scale }
      })
      return
    }
    setView(current=>native.shiftKey?{...current,x:current.x-(dx||dy)}:{...current,x:current.x-dx,y:current.y-dy})
  }
  return { stageProps: { x: view.x, y: view.y, scaleX: view.scale, scaleY: view.scale, onWheel, draggable: false } }
}