import { 
  HueRotations, 
  AsciifyOptionsType,
  DimensionsType,
  CharacterDistributions, 
  NextHueType
} from './types'

class Enluminure{
  private refCanvas: HTMLCanvasElement
  private drawCanvas: HTMLCanvasElement
  private options: AsciifyOptionsType
  private dimensions: DimensionsType
  private imageData?: ImageData

  private getHueRotation = {
    [HueRotations.LINEAR_FW]: (minHue: number, maxHue: number, direction:number, iterator:number) : NextHueType => {
      let hue = iterator+direction
      if(hue > maxHue || hue < minHue)
        hue = minHue
      
      return [hue, direction]
    },
    [HueRotations.LINEAR_FWBW]: (minHue: number, maxHue: number, direction:number, iterator:number) : NextHueType => {
      let hue = iterator + direction
      if(hue > maxHue)
        direction = -1
      if(hue < minHue)
        direction = 1
      
      return [hue, direction]
    },
    [HueRotations.RANDOM]: (minHue: number, maxHue: number, direction:number) : NextHueType => {
      const seed = Math.random() * (maxHue - minHue) + minHue | 0
      return [seed, direction]
    },
    [HueRotations.SCATTER]: (minHue: number, maxHue: number, direction:number, iterator:number) : NextHueType => {
      const seed = (Math.sin(iterator % (Math.PI * 100)) + 1) / 2
      const hue = seed * (maxHue - minHue) + minHue
      return [hue, direction]
    }
  }

  private getClosestMultiple(size: number, divisor: number){
    return size - size % divisor
  }

  private setDimensions(width: number, height: number){
    this.dimensions = { w: this.getClosestMultiple(width, this.options.tileSize), h: this.getClosestMultiple(height, this.options.tileSize) }
    this.refCanvas.width = this.dimensions.w
    this.refCanvas.height = this.dimensions.h
    this.drawCanvas.width = this.dimensions.w
    this.drawCanvas.height = this.dimensions.h
  }

  private imageLoader(file: File) : Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.addEventListener('load', () => resolve(img))
      img.addEventListener('error', err => reject(err))
      img.src = URL.createObjectURL(file)
    })
  }

  private jitter(position: number, threshold: number, maxOffset: number){
    const seed = Math.random() 
    if(threshold < seed)
      return position
    
    return position + (Math.floor((seed - 0.5) * maxOffset))
  }
  
  public constructor(options?: Partial<AsciifyOptionsType>){
    this.refCanvas = document.createElement('canvas')
    this.drawCanvas = document.createElement('canvas')
    this.options = {
      backgroundColor: options?.backgroundColor || '#000',
      characterDistribution: options?.characterDistribution || CharacterDistributions.ROW,
      characterPool: options?.characterPool || 'AŝçîiFÿ',
      focusGradientOpacity: options?.focusGradientOpacity || 0,
      fontFamily: 'monospace',
      fontSize: options?.fontSize || 6,
      hueMin: options?.hueMin || 0,
      hueMax: options?.hueMax || 10,
      hueRotation: options?.hueRotation || HueRotations.LINEAR_FW,
      jitterChance: options?.jitterChance || 0,
      luminanceFactor: options?.luminanceFactor || 100,
      maxJitterOffsetX: options?.maxJitterOffsetX || 0,
      maxJitterOffsetY: options?.maxJitterOffsetY || 0,
      saturation: options?.saturation || 100,
      tileSize: options?.tileSize || 6,
    }
    this.dimensions = { h: 0, w: 0 }

    return this
  }

  public async loadImage(file: File) : Promise<number | undefined>{
    try{
      const img = await this.imageLoader(file)
      this.setDimensions(img.width, img.height)
  
      const ctx = this.refCanvas.getContext('2d') 
      ctx?.drawImage(img, 0, 0)
      this.imageData = ctx?.getImageData(0, 0, this.dimensions.w, this.dimensions.h)

      return (this.imageData?.data.length || 0) / 4
    }
    catch(err){
      throw TypeError('Invalid input (not an image, or unsupported format)')
    }
  }

  public setOptions(options: Partial<AsciifyOptionsType>) : void {
    this.options = { ...this.options, ...options}
    
    if(options.hasOwnProperty('tileSize') && this.imageData !== undefined){
      this.setDimensions(this.imageData?.width, this.imageData?.height)
    }
  }

  public render(target?: string) : string {
    if(!this.imageData)
      throw TypeError('No loaded image')
    
    const rowNb = this.dimensions.h / this.options.tileSize
    const colNb = this.dimensions.w / this.options.tileSize
    const minHue = Math.min(this.options.hueMin, this.options.hueMax)
    const maxHue = Math.max(this.options.hueMin, this.options.hueMax)
    let [hue, direction] = this.getHueRotation[this.options.hueRotation](minHue, maxHue, 1, minHue)

    const numChannels = this.imageData.data.length / (this.dimensions.h * this.dimensions.w)
    if(numChannels !== 4)
      throw Error('Unsupported image data')
    
    const ctx = this.drawCanvas.getContext('2d')
    if(!ctx)
      throw TypeError('Canvas unsupported')
    
    ctx.fillStyle = this.options.backgroundColor
    ctx.fillRect(0, 0, this.dimensions.w, this.dimensions.h)
    ctx.font = this.options.fontSize + 'px ' + this.options.fontFamily
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for(let row=0; row<rowNb; row++){
      for(let col=0; col<colNb; col++){
        const index = row * this.dimensions.w * this.options.tileSize * numChannels + col * this.options.tileSize * numChannels
        const r = this.imageData.data[index]
        const g = this.imageData.data[index+1]
        const b = this.imageData.data[index+2]

        const luminance = (r + g + b) / 765 * this.options.luminanceFactor | 0
        const currentCharacter = this.options.characterPool.charAt(
          this.options.characterDistribution === CharacterDistributions.ROW ? 
          row % this.options.characterPool.length
          : this.options.characterDistribution === CharacterDistributions.COLUMN ?
          col % this.options.characterPool.length
          : Math.random() * this.options.characterPool.length
        )
        
        ctx.fillStyle = `hsl(${hue}, ${this.options.saturation}%, ${luminance}%)`
        ctx.fillText(
          currentCharacter, 
          this.jitter(col * this.options.tileSize, this.options.jitterChance, this.options.maxJitterOffsetX),
          this.jitter(row * this.options.tileSize, this.options.jitterChance, this.options.maxJitterOffsetY)
        )

        const nextHue = this.getHueRotation[this.options.hueRotation](minHue, maxHue, direction, hue)
        hue = nextHue[0]
        direction = nextHue[1] 
      }
    }
    
    return this.drawCanvas.toDataURL(target)
  }
}

export default Enluminure