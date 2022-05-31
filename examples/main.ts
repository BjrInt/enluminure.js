import Enluminure from "../src/enluminure"
import { CharacterDistributions, HueRotations } from "../src/types"

const enluminure = new Enluminure()

const populateSelect = (select: HTMLSelectElement, _enum: any) => {
  Object.values(_enum).forEach((v: string) => {
    const option = document.createElement('option')
    option.value = v
    option.innerText = v
    select?.appendChild(option)
  })
}
// @ts-ignore
populateSelect(document.getElementById('hueRotation'), HueRotations)
// @ts-ignore
populateSelect(document.getElementById('characterDistribution'), CharacterDistributions)


Object.entries(enluminure.getOptions()).forEach(([optionName, optionValue]) => {
  const input = document.getElementById(optionName)
  if(input){
    // @ts-ignore
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
    // @ts-ignore
    const { value, id } = target
    enluminure.setOptions({
      [id]: value
    })

    renderAndDisplay()
  })
))

document.querySelector('#change_file')
?.addEventListener('change', async ({target}) => {
  // @ts-ignore
  await enluminure.loadImage(target.files[0])
  renderAndDisplay()
})