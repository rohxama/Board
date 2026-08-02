import { useCallback, useRef, useState } from 'react'
import { AppStateProvider, useAppState } from './context/AppStateContext'
import { HistoryProvider, useHistory } from './context/HistoryContext'
import CanvasStage from './components/Canvas/CanvasStage'
import Toolbar from './components/Toolbar/Toolbar'
import StylePanel from './components/StylePanel/StylePanel'
import ZoomControls from './components/ZoomControls/ZoomControls'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
function Workspace(){const stageRef=useRef(); const [view,setView]=useState({x:0,y:0,scale:1}); const {state,dispatch}=useAppState();const {shapes,commit,undo,redo}=useHistory();const remove=useCallback(()=>{if(state.selectedShapeIds.length){commit(shapes.filter(s=>!state.selectedShapeIds.includes(s.id)));dispatch({type:'SET_SELECTION',ids:[]})}},[shapes,state.selectedShapeIds,commit,dispatch]);useKeyboardShortcuts({dispatch,undo,redo,remove});return <main><CanvasStage stageRef={stageRef} view={view} setView={setView}/><Toolbar stageRef={stageRef}/><StylePanel/><ZoomControls view={view} setView={setView}/></main>}
export default function App(){return <AppStateProvider><HistoryProvider><Workspace/></HistoryProvider></AppStateProvider>}
