const fs = require('fs')
const { decodePNG } = require('./pnglib.cjs')

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