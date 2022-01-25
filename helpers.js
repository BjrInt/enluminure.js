const CANVAS = document.createElement('canvas')

export const getCharacterLuminance = (letter, tileSize=8) => {
  CANVAS.height = tileSize
  CANVAS.width = tileSize

  const ctx = CANVAS.getContext('2d')
  ctx.clearRect(0, 0, tileSize, tileSize)

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, tileSize, tileSize)
  ctx.fillStyle = 'black'
  ctx.font = tileSize + 'px Courrier'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(letter, 0, 0)

  let sum = 0

  for(let i=0;i<tileSize;i++){
    for(let j=0;j<tileSize;j++){
      const rgb = ctx.getImageData(i, j, 1, 1).data[0]
      sum += rgb
    }
  }

  ctx.clearRect(0, 0, tileSize, tileSize)

  return sum
}

const last = ar => ar[ar.length - 1]

export const getTiles = (picture, cb=(imageData, row, column) => {}, tileSize=8, offset=4) => {
  const { height, width } = picture
  CANVAS.height = height
  CANVAS.width = width

  const ctx = CANVAS.getContext('2d')
  ctx.clearRect(0, 0, height, width)
  ctx.drawImage(picture, 0, 0, height, width)

  const r = []

  for(let i=0; i<width/tileSize; i++){
    r.push([])
    for(let j=0; j<height/tileSize; j++){
      const imageData = ctx.getImageData(i * tileSize + offset, j * tileSize + offset, 1, 1).data
      cb(imageData, i, j)
      last(r).push(imageData)
    }
  }

  return r
}