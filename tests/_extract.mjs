import fs from 'fs'
const s = fs.readFileSync('src/components/Canvas/CanvasStage.jsx', 'utf8')
const start = s.indexOf('className="canvas-empty"')
const end = s.indexOf('bring your idea to life')
console.log(s.slice(start, end + 320))
