const fs = require('fs')
const { decodePNG } = require('./pnglib.cjs')

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