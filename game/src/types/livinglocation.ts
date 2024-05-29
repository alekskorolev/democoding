export interface IBuilding {
  id: string
  title: string
  sprite: string
  plan: string
}

export interface ILivindLocation {
  id: string
  title: string
  map: string
  buildings: Array<IBuilding>
}
