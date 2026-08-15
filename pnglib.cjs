const zlib = require('zlib')

// Decode PNG to RGBA (4 bytes/pixel) regardless of source color type.
function decodePNG(buf) {
  let pos = 8, w = 0, h = 0, colorType = 6, bitDepth = 8
  const chunks = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.slice(pos + 8, pos + 8 + len)
    pos += 12 + len
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9] }
    else if (type === 'IDAT') chunks.push(data)
    else if (type === 'IEND') break
  }
  if (bitDepth !== 8) throw new Error('unsupported bit depth ' + bitDepth)
  const raw = zlib.inflateSync(Buffer.concat(chunks))
  const srcBpp = { 2: 3, 6: 4 }[colorType]
  if (!srcBpp) throw new Error('unsupported color type ' + colorType)
  const stride = w * srcBpp
  const out = Buffer.alloc(w * h * 4)
  let prev = Buffer.alloc(stride), o = 0
  for (let y = 0; y < h; y++) {
    const f = raw[o++]
    const line = raw.slice(o, o + stride); o += stride
    const cur = Buffer.alloc(stride)
    for (let i = 0; i < stride; i++) {
      const a = i >= srcBpp ? cur[i - srcBpp] : 0
      const b = prev[i]
      const c = i >= srcBpp ? prev[i - srcBpp] : 0
      let v = line[i]
      if (f === 1) v += a
      else if (f === 2) v += b
      else if (f === 3) v += (a + b) >> 1
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c }
      cur[i] = v & 0xff
    }
    for (let x = 0; x < w; x++) {
      const src = x * srcBpp, dst = (y * w + x) * 4
      out[dst] = cur[src]; out[dst + 1] = cur[src + 1]; out[dst + 2] = cur[src + 2]; out[dst + 3] = srcBpp === 4 ? cur[src + 3] : 255
    }
    prev = cur
  }
  return { w, h, data: out }
}

module.exports = { decodePNG }