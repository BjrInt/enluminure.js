import './style.css'
import { characterDistributions, getTiles, hueRotations, jitter } from "./helpers"

const options = {
  backgroundColor: '#000',
  luminanceFactor: 100,
  hueMin: 0,
  hueMax: 10,
  saturation: 100,
  tileSize: 6,
  fontSize: 6,
  characterPool: 'ELONMUSK',
  hueRotation: 'linear forward',
  characterDistribution: 'row',
  focusGradientOpacity: 0,
  jitterChance: 0,
  maxJitterOffsetX: 0,
  maxJitterOffsetY: 0,
}

// fix Netlify deployment bugs
const NETLIFY_DELAY = window.location.href.match('localhost') ? 5 : 300

const img =  document.querySelector('img')
const canvas = document.querySelector('#asciified')
const ctx = canvas.getContext('2d')

const createModal = (content, readonly=false) => {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'

  const modal = document.createElement('modal')

  const escText = document.createElement('p')
  escText.innerText = '(press escape to close)'
  modal.appendChild(escText)

  const textarea = document.createElement('textarea')
  textarea.innerText = content
  textarea.readOnly = readonly
  textarea.addEventListener('click', e => e.target.select())
  modal.appendChild(textarea)

  if(!readonly){
    const loadPreset = document.createElement('button')
    loadPreset.className = "load-button"
    loadPreset.innerText = "Load preset"
    loadPreset.addEventListener('click', () => {
      const values = JSON.parse(textarea.value)
      Object.entries(values).forEach(([k, v]) => {
        if(options.hasOwnProperty(k)){
          options[k] = v
          document.getElementById(k).value = v
        }
      })

      render()
      overlay.remove()
    })

    modal.appendChild(loadPreset)
  }
  
  overlay.appendChild(modal)

  document.addEventListener('keyup', e => {
    if(e.code === 'Escape'){
      overlay.remove()
    }
  })

  overlay.addEventListener('click', e => {
    if(e.target.className === 'modal-overlay')
      overlay.remove()
  })

  document.body.appendChild(overlay)
}

const render = () => {
  canvas.height = img.height
  canvas.width = img.width

  ctx.fillStyle = options.backgroundColor
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
    
    const hueR = hueRotations[options.hueRotation](minHue, maxHue, hue, direction)
    hue = hueR[0]
    direction = hueR[1]

    
    ctx.fillStyle = `hsl(${hue}, ${options.saturation}%, ${luminance}%)`
    ctx.fillText(
      characterDistributions[options.characterDistribution](options.characterPool, i, j), 
      jitter(i*options.tileSize, options.jitterChance / 100, options.maxJitterOffsetX / 1000 * canvas.width), 
      jitter(j*options.tileSize, options.jitterChance / 100, options.maxJitterOffsetY / 1000 * canvas.height)
    )

  }, options.tileSize, options.focusGradientOpacity)
}

const hueRotationSelect = document.querySelector('#hueRotation')
for (const hueOptions in hueRotations) {
  const opt = document.createElement('option')
  opt.innerText = hueOptions
  opt.value = hueOptions
  hueRotationSelect.appendChild(opt)
}
const characterDistributionSelect = document.querySelector('#characterDistribution')
for (const cdOptions in characterDistributions) {
  const opt = document.createElement('option')
  opt.innerText = cdOptions
  opt.value = cdOptions
  characterDistributionSelect.appendChild(opt)
}

document.querySelectorAll('.param_input').forEach(el => {
  el.addEventListener('change', ({target}) => {
    options[target.id] = target.type === 'checkbox' ? target.checked : target.value
    render()
  })
})

document.querySelector('#change_file').addEventListener('change', e => {
  const reader = new FileReader()
  reader.addEventListener('load', (event) => {
    img.src = event.target.result
  })
  reader.readAsDataURL(e.target.files[0])
})

document.querySelector('#export-preset').addEventListener('click', () => {
  createModal(JSON.stringify(options), true)
})

document.querySelector('#import-preset').addEventListener('click', () => {
  createModal('', false)
})

render()
img.addEventListener('load', () => {
  setTimeout(render, NETLIFY_DELAY)
})