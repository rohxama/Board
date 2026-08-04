export function useStageZoomPan(stageRef, view, setView) {
  const onWheel = e => {
    const native=e.evt
    const stage=stageRef.current
    if (!stage) return
    native.preventDefault()
    if (native.ctrlKey || native.metaKey) {
      const point=stage.getPointerPosition()
      setView(current=>{const scale=Math.max(.25,Math.min(3,current.scale*(native.deltaY>0?.9:1.1)));return {scale,x:point.x-(point.x-current.x)*scale/current.scale,y:point.y-(point.y-current.y)*scale/current.scale}})
      return
    }
    setView(current=>native.shiftKey?{...current,x:current.x-(native.deltaX||native.deltaY)}:{...current,x:current.x-native.deltaX,y:current.y-native.deltaY})
  }
  return { stageProps: { x: view.x, y: view.y, scaleX: view.scale, scaleY: view.scale, onWheel, draggable: false } }
}
