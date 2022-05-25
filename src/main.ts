import Asciify from "./lib/asciify"

const asc = new Asciify({ tileSize: 6, fontSize: 8, characterPool: 'CURTISMAYFIELD' })

document.querySelector('#change_file')?.addEventListener('change', async ({target}) => {
  // @ts-ignore
  const file = target.files[0]
  
  await asc.loadImage(file)
  const result = asc.render()

  document.querySelector('#asciified')?.remove()
  result.id = 'asciified'
  document.querySelector('#pics')?.appendChild(result)
})