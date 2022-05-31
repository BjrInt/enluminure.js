import Enluminure from "../src/enluminure"
import { CharacterDistributions, HueRotations } from "../src/types"

const enluminure = new Enluminure()

const populateSelect = (select, _enum) => {
  Object.values(_enum).forEach(v => {
    const option = document.createElement('option')
    option.value = v
    option.innerText = v
    select?.appendChild(option)
  })
}

populateSelect(document.getElementById('hueRotation'), HueRotations)
populateSelect(document.getElementById('characterDistribution'), CharacterDistributions)


Object.entries(enluminure.getOptions()).forEach(([optionName, optionValue]) => {
  const input = document.getElementById(optionName)
  if(input){
    input.value = optionValue
  }
})

const renderAndDisplay = () => {
  const result = enluminure.render()

  let img : HTMLImageElement = document.querySelector('#enluminure')
  if(!img){
    img = document.createElement('img')
    img.id = 'enluminure'
    document.querySelector('#pics')?.appendChild(img)
  }

  img.src = result
}

document
.querySelectorAll('.param_input')
.forEach(item => (
  item.addEventListener('change', async ({target}) => {
    const { value, id } = target
    enluminure.setOptions({
      [id]: value
    })

    renderAndDisplay()
  })
))

document.querySelector('#change_file')
?.addEventListener('change', async ({target}) => {
  await enluminure.loadImage(target.files[0])
  renderAndDisplay()
})