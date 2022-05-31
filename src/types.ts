export enum HueRotations {
  LINEAR_FW = "LINEAR_FORWARD",
  LINEAR_FWBW = "LINEAR_BACK_FORTH",
  RANDOM = "RANDOM",
  SCATTER = "SCATTERED",
}

export enum CharacterDistributions {
  COLUMN = "COLUMN",
  ROW = "ROW",
  RANDOM = "RANDOM"
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
  jitterProbability: number,
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