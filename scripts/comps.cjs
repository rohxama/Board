const fs = require('fs')
const { decodePNG } = require('./pnglib.cjs')

const img = decodePNG(fs.readFileSync(process.argv[2]))
const key = (x, y) => y * img.w + x
const visited = new Uint8Array(img.w * img.h)
const comps = []
for (let y = 90; y < 700; y++) {
  for (let x = 70; x < 950; x++) {
    const i = key(x, y)
    if (visited[i]) continue
    const r = img.data[i * 4], g = img.data[i * 4 + 1], b = img.data[i * 4 + 2]
    if (!(r < 90 && g < 100 && b < 110 && r + g + b < 270)) continue
    const stack = [[x, y]]
    visited[i] = 1
    let minX = x, maxX = x, minY = y, maxY = y, count = 0, sr = 0, sg = 0, sb = 0
    while (stack.length) {
      const [cx, cy] = stack.pop()
      count++
      const ci = key(cx, cy) * 4
      sr += img.data[ci]; sg += img.data[ci + 1]; sb += img.data[ci + 2]
      for (const [nx, ny] of [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]]) {
        if (nx < 70 || nx >= 950 || ny < 90 || ny >= 700) continue
        const ni = key(nx, ny)
        if (visited[ni]) continue
        const rr = img.data[ni * 4], gg = img.data[ni * 4 + 1], bb = img.data[ni * 4 + 2]
        if (rr < 90 && gg < 100 && bb < 110 && rr + gg + bb < 270) { visited[ni] = 1; stack.push([nx, ny]) }
      }
      if (cx < minX) minX = cx; if (cx > maxX) maxX = cx
      if (cy < minY) minY = cy; if (cy > maxY) maxY = cy
    }
    comps.push({ x: minX, y: minY, w: maxX - minX, h: maxY - minY, px: count, avg: `rgb(${Math.round(sr / count)},${Math.round(sg / count)},${Math.round(sb / count)})` })
  }
}
comps.sort((a, b) => b.px - a.px)
for (const c of comps.slice(0, 20)) console.log(`bbox x=${c.x} y=${c.y} w=${c.w} h=${c.h} px=${c.px} avg=${c.avg}`)