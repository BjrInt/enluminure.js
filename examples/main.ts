import Enluminure from "../src/enluminure"
import { CharacterDistributions, HueRotations } from "../src/types"

const options = [
  {
    tileSize: 8, 
    fontSize: 10, 
    characterDistribution: CharacterDistributions.RANDOM,
    characterPool: 'X', 
    hueMax: 130,
    hueMin: 0,
    hueRotation: HueRotations.SCATTER,
  },

  {
    tileSize: 4, 
    fontSize: 9, 
    characterDistribution: CharacterDistributions.RANDOM,
    hueRotation: HueRotations.RANDOM,
    characterPool: '(Û)', 
    hueMax: 200,
    hueMin: 140,
    jitterProbability: .65,
    maxJitterOffsetX: 60,
    maxJitterOffsetY: 60,
    luminanceFactor: 150,
  },

  {
    tileSize: 12, 
    fontSize: 15,
    fontFamily: 'serif', 
    hueRotation: HueRotations.SCATTER,
    characterPool: 'ENLUMINURE', 
    hueMax: 360,
    hueMin: 290,
    backgroundColor: "red"
  }
]

const load = async () => {
  for(const option of options) {
    const i = new Enluminure(option)
    await i.loadImage('./pics/original.jpg')
    const src = i.render()
  
    const img = document.createElement('img')
    img.src = src
    document.querySelector('#pics')?.appendChild(img)
  }
}

load()