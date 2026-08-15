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
const px = (x, y) => { const i = (y * img.w + x) * 4; return [img.data[i], img.data[i + 1], img.data[i + 2]] }
console.log('image', img.w, 'x', img.h)
console.log('center (600,400):', px(600, 400))
console.log('(300,400):', px(300, 400))
console.log('(900,400):', px(900, 400))
console.log('(600,600):', px(600, 600))
console.log('(100,100):', px(100, 100))
console.log('(500,150):', px(500, 150))
// dot scan on a clean row
for (const y of [100, 600, 700]) {
  const darkish = []
  for (let x = 100; x < 1100; x++) {
    const [r, g, b] = px(x, y)
    if (r + g + b < 690) darkish.push(x)
  }
  console.log(`y=${y} pixels <230avg: ${darkish.length}`, darkish.slice(0, 20).join(','))
}