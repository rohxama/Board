const zlib = require('zlib')
const fs = require('fs')

function decodePNG(buf) {
  let pos = 8, w = 0, h = 0, colorType = 6
  const chunks = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.slice(pos + 8, pos + 8 + len)
    pos += 12 + len
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); colorType = data[8] }
    else if (type === 'IDAT') chunks.push(data)
    else if (type === 'IEND') break
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks))
  const bpp = colorType === 6 ? 4 : 3
  const stride = w * bpp
  const out = Buffer.alloc(w * h * bpp)
  let prev = Buffer.alloc(stride), o = 0
  for (let y = 0; y < h; y++) {
    const f = raw[o++]
    const line = raw.slice(o, o + stride); o += stride
    const cur = Buffer.alloc(stride)
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0
      const b = prev[i]
      const c = i >= bpp ? prev[i - bpp] : 0
      let v = line[i]
      if (f === 1) v += a
      else if (f === 2) v += b
      else if (f === 3) v += (a + b) >> 1
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
      cur[i] = v & 0xff
    }
    cur.copy(out, y * stride)
    prev = cur
  }
  return { w, h, data: out }
}

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