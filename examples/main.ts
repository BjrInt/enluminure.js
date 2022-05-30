import Asciify from "../src/ts/enluminure"
import { CharacterDistributions } from "../src/ts/types"

const asc = new Asciify({ tileSize: 10, fontSize: 12, characterPool: 'iokhmfhsdMdjbjz', characterDistribution: CharacterDistributions.RANDOM })

document.querySelector('#change_file')?.addEventListener('change', async ({target}) => {
  // @ts-ignore
  const file = target.files[0]
  
  await asc.loadImage(file)
  const result = asc.render()

  document.querySelector('#asciified')?.remove()
  const img = document.createElement('img')
  img.id = 'asciified'
  img.src = result
  document.querySelector('#pics')?.appendChild(img)
})