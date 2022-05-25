export enum HueRotations {
  LINEAR_FW = "Linear Forward",
  LINEAR_FWBW = "Linear Back&Forth",
  RANDOM = "Random",
  SCATTER = "Scattered",
}

export enum CharacterDistributions {
  COLUMN,
  ROW,
}

export type NextHueType = [number, number]

export type AsciifyOptionsType = { 
  backgroundColor: string,
  characterDistribution: CharacterDistributions,
  characterPool: string,
  focusGradientOpacity: number,
  fontFamily: string,
  fontSize: number,
  hueMax: number,
  hueMin: number,
  hueRotation: HueRotations,
  jitterChance: number,
  luminanceFactor: number,
  maxJitterOffsetX: number,
  maxJitterOffsetY: number,
  saturation: number,
  tileSize: number,
}

export type DimensionsType = {
  h: number,
  w: number
}