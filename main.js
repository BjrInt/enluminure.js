import './style.css'
import { getTiles } from "./helpers"

const options = {
  luminanceFactor: 100,
  invert: false,
  hueMin: 0,
  hueMax: 10,
  saturation: 100,
  tileSize: 6,
  fontSize: 6,
  characterPool: 'ELONMUSK'
}


const canvas = document.querySelector('#asciified')
const img =  document.querySelector('img')
canvas.height = img.height
canvas.width = img.width
const ctx = canvas.getContext('2d')

const render = () => {
  let txtI = 0

  ctx.fillStyle = options.invert ? 'white' : 'black'
  ctx.fillRect(0, 0, img.width, img.height)
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
  ctx.font = options.fontSize + 'px monospace'

  const minHue = Math.min(options.hueMin, options.hueMax)
  const maxHue = Math.max(options.hueMin, options.hueMax)
  let hue = minHue

  getTiles(img, (id, i, j) => {
    const [r, g, b] = id
    let luminance = (r + g + b) / (255 * 3) * 100 * (options.luminanceFactor / 100) | 0
    if(options.invert)
      luminance = 100 - luminance
    
    if(hue > maxHue || hue < minHue)
      hue = minHue
    
    ctx.fillStyle = `hsl(${hue}, ${options.saturation}%, ${luminance}%)`
    ctx.fillText(options.characterPool.charAt(txtI % options.characterPool.length), i*options.tileSize, j*options.tileSize)

    hue++
    txtI++
  }, options.tileSize, 0)
}

render()

document.querySelectorAll('.param_input').forEach(() => 
  {
    addEventListener('change', ({target}) => {
      options[target.name] = target.type === 'checkbox' ? target.checked : target.value
      render()
  })
})