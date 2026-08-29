const fs = require('fs')
const { decodePNG } = require('./pnglib.cjs')

const img = decodePNG(fs.readFileSync(process.argv[2]))
const isDark = (x, y) => {
  const i = (y * img.w + x) * 4
  const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2]
  return r < 90 && g < 100 && b < 110 && r + g + b < 270
}
// column histogram within scan region
const colCount = new Array(img.w).fill(0)
const rowCount = new Array(img.h).fill(0)
for (let y = 90; y < 700; y++) {
  for (let x = 70; x < 950; x++) {
    if (isDark(x, y)) { colCount[x]++; rowCount[y]++ }
  }
}
console.log('=== columns with >40 dark px (potential rect edges) ===')
for (let x = 0; x < 950; x++) if (colCount[x] > 40) console.log(`x=${x} count=${colCount[x]}`)
console.log('=== rows with >80 dark px (potential rect top/bottom) ===')
for (let y = 0; y < 700; y++) if (rowCount[y] > 80) console.log(`y=${y} count=${rowCount[y]}`)
console.log('=== sample colors of darkest pixels in region ===')
let samples = []
for (let y = 90; y < 700 && samples.length < 12; y++) {
  for (let x = 70; x < 950 && samples.length < 12; x++) {
    if (isDark(x, y)) {
      const i = (y * img.w + x) * 4
      samples.push(`(${x},${y}) rgb(${img.data[i]},${img.data[i + 1]},${img.data[i + 2]})`)
    }
  }
}
console.log(samples.join('\n'))
