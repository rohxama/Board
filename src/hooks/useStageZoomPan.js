export function useStageZoomPan(stageRef, view, setView) {
  const onWheel = e => { if (!(e.evt.ctrlKey || e.evt.metaKey)) return; e.evt.preventDefault(); const stage = stageRef.current; const point = stage.getPointerPosition(); const old = view.scale; const scale = Math.max(.25, Math.min(3, old * (e.evt.deltaY > 0 ? .9 : 1.1))); setView({ scale, x: point.x - (point.x - view.x) * scale / old, y: point.y - (point.y - view.y) * scale / old }) }
  return { stageProps: { x: view.x, y: view.y, scaleX: view.scale, scaleY: view.scale, onWheel, draggable: false } }
}
