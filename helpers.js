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

export const getTiles = (picture, cb=(imageData, row, column) => {}, tileSize=8, focusGradientOpacity=0) => {
  const { height, width } = picture
  CANVAS.height = height
  CANVAS.width = width

  const ctx = CANVAS.getContext('2d')
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(picture, 0, 0, width, height)

  const imgRadius = Math.sqrt(width**2 + height**2)

  const focusGradient = ctx.createRadialGradient(
    width / 2 | 0, 
    height / 2 | 0,
    Math.sqrt(imgRadius),
    0,
    0,
    imgRadius
  )
  focusGradient.addColorStop(0, 'transparent')
  focusGradient.addColorStop(1, 'black')
  ctx.globalAlpha = focusGradientOpacity / 100
  ctx.fillStyle = focusGradient
  ctx.fillRect(0, 0, width, height)
  ctx.globalAlpha = 1

  const imageData = ctx.getImageData(0, 0, height, width).data

  for(let i=0; i<width/tileSize; i++){
    for(let j=0; j<height/tileSize; j++){
      const index = j * height * tileSize * 4 + i * tileSize * 4

      const localID = [
        imageData[index],
        imageData[index+1],
        imageData[index+2],
      ]
      cb(localID, i, j)
    }
  }

  return imageData
}

export const hueRotations = {
  'linear forward': (minHue, maxHue, iterator, direction) => {
    let hue = iterator+direction
    if(hue > maxHue || hue < minHue)
      hue = minHue
    
    return [hue, direction]
  },
  'linear back and forth': (minHue, maxHue, iterator, direction) => {
    let hue = iterator + direction
    if(hue > maxHue)
      direction = -1
    if(hue < minHue)
      direction = 1
    
    return [hue, direction]
  },
  'random': (minHue, maxHue, iterator, direction) => {
    const seed = Math.random() * (maxHue - minHue) + minHue | 0
    return [seed, direction]
  },
  'scatter': (minHue, maxHue, iterator, direction) => {
    const seed = (Math.sin(iterator % (Math.PI * 100)) + 1) / 2
    const hue = seed * (maxHue - minHue) + minHue
    return [hue, direction]
  }
}

export const characterDistributions = {
  'row' : (charpool, row, column) => {
    return charpool.charAt(row % charpool.length)
  },
  'column' : (charpool, row, column) => {
    return charpool.charAt(column % charpool.length)
  },
  'random' : (charpool, row, column) => {
    return charpool.charAt(Math.random() * charpool.length | 0)
  }
}

export const jitter = (position, threshold, maxOffset) => {
  const seed = Math.random() 
  if(threshold < seed)
    return position
  
  return position + (Math.floor((seed - 0.5) * maxOffset))
}