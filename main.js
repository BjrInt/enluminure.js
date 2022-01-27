import './style.css'
import { getTiles, hueRotations } from "./helpers"

const options = {
  luminanceFactor: 100,
  invert: false,
  hueMin: 0,
  hueMax: 10,
  saturation: 100,
  tileSize: 6,
  fontSize: 6,
  characterPool: 'ELONMUSK',
  hueRotation: 'linear forward'
}


const img =  document.querySelector('img')
const canvas = document.querySelector('#asciified')
const ctx = canvas.getContext('2d')

const render = () => {
  canvas.height = img.height
  canvas.width = img.width
  let txtI = 0

  ctx.fillStyle = options.invert ? 'white' : 'black'
  ctx.fillRect(0, 0, img.width, img.height)
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
  ctx.font = options.fontSize + 'px monospace'

  const minHue = Math.min(options.hueMin, options.hueMax)
  const maxHue = Math.max(options.hueMin, options.hueMax)
  let [hue, direction] = hueRotations[options.hueRotation](minHue, maxHue, minHue, 1)

  getTiles(img, (id, i, j) => {
    const [r, g, b] = id
    let luminance = (r + g + b) / (255 * 3) * 100 * (options.luminanceFactor / 100) | 0
    if(options.invert)
      luminance = 100 - luminance
    
    const hueR = hueRotations[options.hueRotation](minHue, maxHue, hue, direction)
    hue = hueR[0]
    direction = hueR[1]

    
    ctx.fillStyle = `hsl(${hue}, ${options.saturation}%, ${luminance}%)`
    ctx.fillText(options.characterPool.charAt(txtI % options.characterPool.length), i*options.tileSize, j*options.tileSize)

  }, options.tileSize, 0)
}

const hueRotationSelect = document.querySelector('#hueRotation')
for (const hueOptions in hueRotations) {
  const opt = document.createElement('option')
  opt.innerText = hueOptions
  opt.value = hueOptions
  hueRotationSelect.appendChild(opt)
}

document.querySelectorAll('.param_input').forEach(el => {
  el.addEventListener('change', ({target}) => {
    options[target.name] = target.type === 'checkbox' ? target.checked : target.value
    render()
  })
})

document.querySelector('#change_file').addEventListener('change', e => {
  const reader = new FileReader()
  reader.addEventListener('load', (event) => {
    img.src = event.target.result
    render()
  })
  reader.readAsDataURL(e.target.files[0])
})

// Fix netlify not loading assets
setTimeout(render, 600)