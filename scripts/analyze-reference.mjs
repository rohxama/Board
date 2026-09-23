import { readFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'

const file = 'docs/reference/reference-design.png'
const buf = readFileSync(file)

// ── Minimal PNG decoder: 8-bit RGB (type 2) / RGBA (type 6), non-interlaced ──
function decodePNG(buf) {
  let pos = 8
  let width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4)
      bitDepth = data[8]; colorType = data[9]; interlace = data[12]
    } else if (type === 'IDAT') idat.push(data)
    else if (type === 'IEND') break
    pos += 12 + len
  }
  if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6) || interlace !== 0)
    throw new Error(`unsupported png: depth=${bitDepth} color=${colorType} interlace=${interlace}`)
  const bpp = colorType === 6 ? 4 : 3
  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * bpp
  const out = Buffer.alloc(height * stride)
  let p = 0
  for (let y = 0; y < height; y++) {
    const filter = raw[p++]
    const row = raw.subarray(p, p + stride); p += stride
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null
    const cur = out.subarray(y * stride, (y + 1) * stride)
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0
      const b = prev ? prev[x] : 0
      const c = prev && x >= bpp ? prev[x - bpp] : 0
      let v = row[x]
      if (filter === 1) v += a
      else if (filter === 2) v += b
      else if (filter === 3) v += (a + b) >> 1
      else if (filter === 4) {
        const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c)
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c)
      }
      cur[x] = v & 0xff
    }
  }
  return { width, height, bpp, data: out }
}

const { width, height, bpp, data } = decodePNG(buf)
console.log(`IMAGE: ${width}x${height}`)

const px = (x, y) => {
  const i = (y * width + x) * bpp
  return [data[i], data[i + 1], data[i + 2]]
}
const hex = (r, g, b) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b

// ── Palette: quantize to 32-level buckets ──
const counts = new Map()
for (let y = 0; y < height; y += 2) {
  for (let x = 0; x < width; x += 2) {
    const [r, g, b] = px(x, y)
    const key = `${r >> 4},${g >> 4},${b >> 4}`
    const e = counts.get(key) || { n: 0, r: 0, g: 0, b: 0 }
    e.n++; e.r += r; e.g += g; e.b += b
    counts.set(key, e)
  }
}
const total = [...counts.values()].reduce((s, e) => s + e.n, 0)
console.log('\nPALETTE (top 28):')
;[...counts.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 28).forEach(([k, e]) => {
  console.log(`${hex(Math.round(e.r / e.n), Math.round(e.g / e.n), Math.round(e.b / e.n))}  ${(100 * e.n / total).toFixed(2)}%`)
})

// ── Row bands: dominant color family per 24px band ──
console.log('\nROW BANDS (24px):')
const classify = (r, g, b) => {
  const l = lum(r, g, b)
  if (l < 70) return 'K'                          // dark ink
  if (r > 200 && g > 200 && b > 200 && Math.abs(r - b) < 25) return '.' // white/cream
  if (b > 180 && g > 180 && r < 190) return 'c'   // sky/cyan
  if (r > 220 && g > 220 && b < 190) return 'y'   // yellow
  if (r > 200 && g > 150 && g < 210 && b < 140) return 'o' // orange
  if (r > 160 && g > 140 && b > 110 && r > b + 40 && g > b + 30) return 'b' // beige/tan
  if (r < 130 && g < 90 && b > 60) return 'p'     // purple
  if (l < 160) return 'k'                         // mid gray
  return '?'
}
for (let y0 = 0; y0 < height; y0 += 24) {
  const tally = {}
  for (let y = y0; y < Math.min(y0 + 24, height); y += 3) {
    for (let x = 0; x < width; x += 6) {
      const c = classify(...px(x, y))
      tally[c] = (tally[c] || 0) + 1
    }
  }
  const dom = Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([c, n]) => `${c}:${(100 * n / Object.values(tally).reduce((s, v) => s + v, 0)).toFixed(0)}%`).join(' ')
  console.log(`y=${String(y0).padStart(4)}  ${dom}`)
}

// ── ASCII map: 128 cols x 96 rows ──
console.log('\nASCII MAP (K=ink . =light c=cyan y=yellow o=orange b=beige p=purple k=mid):')
const COLS = 128, ROWS = 96
const cw = width / COLS, ch = height / ROWS
for (let ry = 0; ry < ROWS; ry++) {
  let line = ''
  for (let rx = 0; rx < COLS; rx++) {
    const tally = {}
    for (let dy = 0; dy < ch; dy += 4) {
      for (let dx = 0; dx < cw; dx += 4) {
        const x = Math.min(width - 1, Math.round(rx * cw + dx))
        const y = Math.min(height - 1, Math.round(ry * ch + dy))
        const c = classify(...px(x, y))
        tally[c] = (tally[c] || 0) + 1
      }
    }
    line += Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
  }
  console.log(String(Math.round(ry * ch)).padStart(4) + ' ' + line)
}
