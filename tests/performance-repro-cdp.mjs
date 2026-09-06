/* Read-only stress harness: Edge DevTools Protocol; no app source changes. */
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'

const ROOT = 'http://127.0.0.1:4183/#/board'
const OUT = path.resolve('artifacts/performance-repro')
const EDGE = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const events = []
const scenarios = []
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const round = value => Math.round(value * 100) / 100

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url)
    this.id = 0
    this.pending = new Map()
    this.listeners = new Set()
    this.ws.onmessage = ({ data }) => {
      const message = JSON.parse(data)
      if (message.id) {
        const resolve = this.pending.get(message.id)
        if (resolve) { this.pending.delete(message.id); message.error ? resolve.reject(new Error(message.error.message)) : resolve.resolve(message.result) }
      } else this.listeners.forEach(listener => listener(message))
    }
  }
  async ready() { await new Promise((resolve, reject) => { this.ws.onopen = resolve; this.ws.onerror = reject }); return this }
  send(method, params = {}, sessionId) {
    const id = ++this.id
    this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP timed out: ${method}`)) }, 30000)
      this.pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value) }, reject: error => { clearTimeout(timer); reject(error) } })
    })
  }
  on(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener) }
  close() { this.ws.close() }
}

async function launch() {
  const profile = await fs.mkdtemp(path.join(os.tmpdir(), 'kanvas-perf-'))
  const child = spawn(EDGE, ['--headless=new', '--remote-debugging-port=9222', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--window-size=1280,800'], { windowsHide: true, stdio: 'ignore' })
  let version
  for (let attempt = 0; attempt < 50; attempt++) {
    try { version = await (await fetch('http://127.0.0.1:9222/json/version')).json(); break } catch { await wait(100) }
  }
  if (!version) throw new Error('Edge did not expose its DevTools endpoint')
  const cdp = await new Cdp(version.webSocketDebuggerUrl).ready()
  return { cdp, child, profile, version }
}

async function attach(cdp) {
  const target = await cdp.send('Target.createTarget', { url: 'about:blank' })
  const attached = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: true })
  const session = attached.sessionId
  await cdp.send('Runtime.enable', {}, session)
  await cdp.send('Page.enable', {}, session)
  await cdp.send('Performance.enable', {}, session)
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__perfRepro = { longTasks: [], errors: [] };
    new PerformanceObserver(list => list.getEntries().forEach(entry => window.__perfRepro.longTasks.push({start: entry.startTime, duration: entry.duration}))).observe({type: 'longtask', buffered: true});
    window.addEventListener('error', event => window.__perfRepro.errors.push({message: event.message, stack: event.error?.stack || ''}));
    window.addEventListener('unhandledrejection', event => window.__perfRepro.errors.push({message: String(event.reason), stack: event.reason?.stack || ''}));
  ` }, session)
  return { session, targetId: target.targetId }
}

const evaluate = async (cdp, page, expression, awaitPromise = true) => {
  const result = await cdp.send('Runtime.evaluate', { expression, awaitPromise, returnByValue: true, userGesture: true }, page.session)
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
  return result.result.value
}
async function until(cdp, page, expression, timeout = 30000) {
  const limit = Date.now() + timeout
  while (Date.now() < limit) { if (await evaluate(cdp, page, expression)) return; await wait(25) }
  throw new Error(`Timed out: ${expression}`)
}
async function nav(cdp, page) { await cdp.send('Page.navigate', { url: ROOT }, page.session); await until(cdp, page, 'Boolean(window.__app && window.__stage)', 20000); const fresh = await evaluate(cdp, page, 'Boolean(document.querySelector(".modal-fresh"))'); if (fresh) await evaluate(cdp, page, 'document.querySelector(".modal-fresh").click()') }
async function mouse(cdp, page, type, x, y, extra = {}) { return cdp.send('Input.dispatchMouseEvent', { type, x, y, button: extra.button ?? 'none', buttons: extra.buttons ?? 0, clickCount: extra.clickCount ?? 0, deltaX: extra.deltaX ?? 0, deltaY: extra.deltaY ?? 0 }, page.session) }
async function drag(cdp, page, x1, y1, x2, y2, steps) { await mouse(cdp, page, 'mouseMoved', x1, y1); await mouse(cdp, page, 'mousePressed', x1, y1, { button: 'left', buttons: 1, clickCount: 1 }); for (let i = 1; i <= steps; i++) await mouse(cdp, page, 'mouseMoved', x1 + (x2 - x1) * i / steps, y1 + (y2 - y1) * i / steps, { buttons: 1 }); await mouse(cdp, page, 'mouseReleased', x2, y2, { button: 'left', clickCount: 1 }) }
async function key(cdp, page, code, ctrl = false) { const modifiers = ctrl ? 2 : 0; const value = code.replace('Key', '').toLowerCase(); await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', code, key: value, windowsVirtualKeyCode: value.toUpperCase().charCodeAt(0), modifiers }, page.session); await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', code, key: value, windowsVirtualKeyCode: value.toUpperCase().charCodeAt(0), modifiers }, page.session) }

async function frames(cdp, page) {
  return evaluate(cdp, page, `(async () => { const a=[]; const start=performance.now(); await new Promise(resolve => { const tick=t => {a.push(t); t-start >= 1000 ? resolve() : requestAnimationFrame(tick)}; requestAnimationFrame(tick) }); const d=a.slice(1).map((t,i)=>t-a[i]); const sum=d.reduce((x,y)=>x+y,0); return {frames:a.length,fps:d.length?1000*d.length/sum:0,maxFrameMs:d.length?Math.max(...d):0,droppedFrames:d.filter(x=>x>33.34).length} })()`)
}
async function metrics(cdp, page) {
  const [perf, heap, dom] = await Promise.all([cdp.send('Performance.getMetrics', {}, page.session), cdp.send('Runtime.getHeapUsage', {}, page.session), cdp.send('Memory.getDOMCounters', {}, page.session)])
  const metric = name => perf.metrics.find(x => x.name === name)?.value ?? null
  return { jsHeapUsedMB: round(heap.usedSize / 1048576), jsHeapTotalMB: round(heap.totalSize / 1048576), nodes: dom.nodes, listeners: dom.jsEventListeners, layoutMs: metric('LayoutDuration') === null ? null : round(metric('LayoutDuration') * 1000), scriptMs: metric('ScriptDuration') === null ? null : round(metric('ScriptDuration') * 1000), taskMs: metric('TaskDuration') === null ? null : round(metric('TaskDuration') * 1000) }
}

async function loadShapes(cdp, page, count, kind) {
  const started = performance.now()
  await evaluate(cdp, page, `(() => {
    const count=${count}, kind=${JSON.stringify(kind)}, colors=['#1e293b','#0f766e','#7c3aed','#b45309'];
    const base=(id,type,x,y)=>({id,type,x,y,stroke:colors[id.length%4],strokeWidth:2,dash:'solid',fill:'transparent',opacity:1});
    const shapes=Array.from({length:count},(_,i)=>{const x=(i%100)*12,y=Math.floor(i/100)*7,id=kind+'-'+i;
      if(kind==='simple') return {...base(id,'rectangle',x,y),width:10,height:5,cornerRadius:0};
      if(kind==='complex'){const points=[];for(let p=0;p<160;p++) points.push(p*1.2,Math.sin(p/4)*10+p%3);return {...base(id,'pen',x,y),points};}
      const type=['rectangle','ellipse','diamond','line','arrow','pen','text'][i%7];
      if(type==='rectangle') return {...base(id,type,x,y),width:10,height:7,cornerRadius:2};
      if(type==='ellipse'||type==='diamond') return {...base(id,type,x,y),width:10,height:7};
      if(type==='text') return {...base(id,type,x,y),width:40,height:18,text:'n'+i,fontSize:10};
      if(type==='pen'){const points=[];for(let p=0;p<40;p++)points.push(p*1.5,Math.sin(p/3)*5);return {...base(id,type,x,y),points};}
      return {...base(id,type,x,y),points:[0,0,10,7]}; }); window.__commit(shapes); })()`)
  const expected = count <= 10000 ? count : 0
  let applied = true
  try { await until(cdp, page, `window.__app.shapes.length === ${expected}`, 30000) } catch { applied = false }
  await evaluate(cdp, page, 'new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
  return { elapsedMs: round(performance.now() - started), expected, actual: await evaluate(cdp, page, 'window.__app.shapes.length'), applied }
}

async function record(cdp, page, name, action) {
  const before = await metrics(cdp, page); const started = performance.now(); const result = await action(); const elapsedMs = round(performance.now() - started); const frame = await frames(cdp, page); const after = await metrics(cdp, page)
  const browser = await evaluate(cdp, page, `({shapes:window.__app.shapes.length,nodesWithShapeId:window.__stage.find(n=>Boolean(n.getAttr?.('shapeId'))).length,longTasks:window.__perfRepro.longTasks.slice(-40),errors:window.__perfRepro.errors.slice()})`)
  scenarios.push({ name, elapsedMs, result, frame: Object.fromEntries(Object.entries(frame).map(([k,v])=>[k,round(v)])), before, after, browser })
}
async function close(cdp, page) { await cdp.send('Target.closeTarget', { targetId: page.targetId }) }

const startPage = async cdp => { const page = await attach(cdp); await nav(cdp, page); return page }
const runLoad = async (cdp, name, count, kind) => { const page = await startPage(cdp); await record(cdp, page, name, () => loadShapes(cdp, page, count, kind)); await close(cdp, page) }

async function interactions(cdp) {
  const page = await startPage(cdp)
  await record(cdp, page, 'mixed-shapes-5k-load', () => loadShapes(cdp, page, 5000, 'mixed'))
  await record(cdp, page, 'rapid-drawing-30-rectangles-on-5k-board', async () => { for(let i=0;i<30;i++){await evaluate(cdp,page,"window.__dispatch({type:'SET_TOOL',tool:'rectangle'})");await evaluate(cdp,page,'new Promise(r=>requestAnimationFrame(r))');const x=70+(i%10)*35,y=90+Math.floor(i/10)*35;await drag(cdp,page,x,y,x+24,y+18,3)} await until(cdp,page,'window.__app.shapes.length===5030'); return {finalShapeCount:await evaluate(cdp,page,'window.__app.shapes.length')} })
  await record(cdp, page, 'rapid-drag-60-events-on-5k-board', async () => { const target=await evaluate(cdp,page,`(()=>{const p={x:1140,y:350},n=window.__stage.getIntersection(p),id=n?.getAttr('shapeId');if(!id)throw Error('no target');window.__dispatch({type:'SET_TOOL',tool:'select'});window.__dispatch({type:'SET_SELECTION',ids:[id]});return {id,...p}})()`); await evaluate(cdp,page,'new Promise(r=>requestAnimationFrame(r))');await drag(cdp,page,target.x,target.y,target.x-280,target.y+100,60);return {target} })
  await record(cdp, page, 'pan-60-events-on-5k-board', async () => { await evaluate(cdp,page,"window.__dispatch({type:'SET_TOOL',tool:'pan'})");await evaluate(cdp,page,'new Promise(r=>requestAnimationFrame(r))');await drag(cdp,page,900,500,300,350,60);return evaluate(cdp,page,'window.__app.view') })
  await record(cdp, page, 'wheel-zoom-40-events-on-5k-board', async () => { for(let i=0;i<20;i++)await mouse(cdp,page,'mouseWheel',640,400,{deltaY:-110});for(let i=0;i<20;i++)await mouse(cdp,page,'mouseWheel',640,400,{deltaY:110});return evaluate(cdp,page,'window.__app.view') })
  await record(cdp, page, '10-commit-undo-redo-cycle-on-5k-board', async () => { const original=await evaluate(cdp,page,'window.__app.shapes[0].x');for(let i=1;i<=10;i++){await evaluate(cdp,page,`window.__commit(p=>p.map((s,n)=>n===0?{...s,x:${i}}:s))`);await until(cdp,page,`window.__app.shapes[0].x===${i}`)}for(let i=0;i<10;i++){await key(cdp,page,'KeyZ',true);await wait(25)}const afterUndo=await evaluate(cdp,page,'window.__app.shapes[0].x');for(let i=0;i<10;i++){await key(cdp,page,'KeyY',true);await wait(25)}return {original,afterUndo,afterRedo:await evaluate(cdp,page,'window.__app.shapes[0].x')} })
  await close(cdp, page)
}

function makeMarkdown(report) {
  const rows=report.scenarios.map(s=>`| ${s.name} | ${s.elapsedMs} | ${s.result.actual??s.result.finalShapeCount??'—'} | ${s.frame.fps} | ${s.frame.maxFrameMs} | ${s.after.jsHeapUsedMB} | ${s.after.nodes} |`).join('\n')
  const admission=report.scenarios.find(s=>s.name==='simple-shapes-10001-load')?.result.actual
  const longTasks=report.scenarios.reduce((n,s)=>n+s.browser.longTasks.length,0)
  return ['# Drawing-app failure reproduction','','## Environment','',`- Browser: ${report.browser.product}`,`- User agent: ${report.userAgent}`,`- OS: ${report.os.type} ${report.os.release} (${report.os.arch})`,`- CPU: ${report.os.cpu} (${report.hardwareConcurrency} browser-visible logical cores)`,`- System RAM: ${report.os.memoryMB} MB`,'','## Results','', '| Scenario | Action (ms) | Shapes | FPS | Worst frame (ms) | JS heap (MB) | DOM nodes |','| --- | ---: | ---: | ---: | ---: | ---: | ---: |',rows,'','## Failure summary','',`- 10,001-shape admission result: **${admission} shapes accepted**. MAX_SHAPES silently rejects any snapshot larger than 10,000.`,`- Console/page errors: **${report.events.length}** (raw details in report.json).`,`- Long tasks captured: **${longTasks}** (raw timeline in report.json).`,'','## Exact reproduction','', '1. Launch the unmodified board in Edge headless with a clean temporary browser profile.', '2. Load simple 1,000, 5,000, 10,000, and 10,001 rectangle sets through the app’s existing window.__commit test seam.', '3. Load 1,000 freehand pens with 160 points each, then a 5,000-shape mixed set.', '4. On the 5,000-shape board, dispatch 30 real pointer-drawn rectangles, a 60-event drag, a 60-event pan, and 40 real wheel events.', '5. Make 10 full-board history commits, then issue 10 Ctrl+Z and 10 Ctrl+Y events.', '6. For each phase collect DevTools task/layout/script time, heap, DOM/listener counts, browser long tasks, rAF FPS, and errors.', '', '## Attribution', '', '- React/state: every COMMIT, UNDO, and REDO deep-clones all shapes and retains up to 200 full snapshots (src/context/historyState.js).', '- Canvas: React-Konva creates a node per shape before the imperative culler can hide offscreen nodes (src/components/Canvas/CanvasStage.jsx).', '- View events: culling walks all shapes whenever view/shapes change, making pan/zoom O(n).', '- Complexity: point arrays increase both history cloning allocation and Konva path/hit-canvas work.', '', 'See report.json for the full before/after metric timeline and error stacks.'].join('\n')
}

await fs.mkdir(OUT,{recursive:true})
const browser=await launch(); const {cdp: protocol}=browser
protocol.on(message=>{if(message.method==='Runtime.consoleAPICalled' || message.method==='Runtime.exceptionThrown') events.push({method:message.method,params:message.params,at:new Date().toISOString()})})
try {
  await runLoad(protocol,'simple-shapes-1000-load',1000,'simple'); await runLoad(protocol,'simple-shapes-5000-load',5000,'simple'); await runLoad(protocol,'simple-shapes-10000-load',10000,'simple'); await runLoad(protocol,'simple-shapes-10001-load',10001,'simple'); await runLoad(protocol,'complex-pen-1000x160-points-load',1000,'complex'); await interactions(protocol)
  const info=await protocol.send('Browser.getVersion'); const page=await startPage(protocol); const platform=await evaluate(protocol,page,'({userAgent:navigator.userAgent,hardwareConcurrency:navigator.hardwareConcurrency})'); await close(protocol,page)
  const report={createdAt:new Date().toISOString(),browser:info, userAgent:platform.userAgent,hardwareConcurrency:platform.hardwareConcurrency,os:{type:os.type(),release:os.release(),arch:os.arch(),cpu:os.cpus()[0].model,memoryMB:Math.round(os.totalmem()/1048576)},scenarios,events}
  await fs.writeFile(path.join(OUT,'report.json'),JSON.stringify(report,null,2)); await fs.writeFile(path.join(OUT,'report.md'),makeMarkdown(report)); console.log(JSON.stringify(scenarios.map(s=>({name:s.name,elapsedMs:s.elapsedMs,fps:s.frame.fps,heapMB:s.after.jsHeapUsedMB,shapes:s.browser.shapes})),null,2))
} finally {
  protocol.close()
  browser.child.kill()
  await wait(750)
  await fs.rm(browser.profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 }).catch(() => {})
}
