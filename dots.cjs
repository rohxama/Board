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

// 1) Find dot positions along a horizontal line in an area that should be plain dotted background
for (const y of [400, 500]) {
  const dots = []
  for (let x = 100; x < 1100; x++) {
    const i = (y * img.w + x) * 4
    const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2]
    if (r < 230 && g < 232 && b < 235 && r + g + b < 690) dots.push(x)
  }
  // cluster consecutive
  const clusters = []
  for (const x of dots) {
    const last = clusters[clusters.length - 1]
    if (last && x - last.end <= 2) last.end = x
    else clusters.push({ start: x, end: x })
  }
  console.log(`y=${y} dot clusters:`, clusters.map(c => `${c.start}-${c.end}`).join(', '))
}

// 2) Dark runs along y=15 (overlay band) in AFTER-DRAW shot if present
const runs = []
let runStart = null
for (let x = 0; x < img.w; x++) {
  const i = (15 * img.w + x) * 4
  const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2]
  const dark = r < 90 && g < 100 && b < 110 && r + g + b < 270
  if (dark && runStart === null) runStart = x
  if (!dark && runStart !== null) { runs.push([runStart, x - 1]); runStart = null }
}
if (runStart !== null) runs.push([runStart, img.w - 1])
console.log('y=15 dark runs:', JSON.stringify(runs))