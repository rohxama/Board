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
const dark = (x, y) => {
  const i = (y * img.w + x) * 4
  const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2]
  return r < 90 && g < 100 && b < 110 && r + g + b < 270
}
const CELL = 8
const rows = Math.ceil(700 / CELL)
for (let cy = 0; cy < rows; cy++) {
  let line = ''
  for (let cx = 0; cx < 1200 / CELL; cx++) {
    let count = 0
    for (let y = cy * CELL; y < (cy + 1) * CELL && y < 700; y++) {
      for (let x = cx * CELL; x < (cx + 1) * CELL; x++) {
        if (dark(x, y)) count++
      }
    }
    line += count >= 4 ? '#' : count >= 1 ? '+' : '.'
  }
  console.log(line)
}
