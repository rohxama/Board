const fs = require('fs')
const { decodePNG } = require('./pnglib.cjs')

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
