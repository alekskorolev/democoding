export interface ICeil {
  itemid: string
  count: number
}

export interface IGrid {
  w: number
  h: number
}
export interface IInventory {
  ceils: Array<ICeil>
  grid: IGrid
}

export interface ISurvivorStatus {
  health: number
  stamina: number
}

export interface ISurvivorState {
  intellectual: number
  inventive: number
  intuitive: number

  dextereous: number
  enduring: number
  strong: number

  smell: number
  sight: number
  hearing: number
}

export interface ISurvivor {
  nickname: string
  inventory: IInventory
  status: ISurvivorStatus
  state: ISurvivorState
}
