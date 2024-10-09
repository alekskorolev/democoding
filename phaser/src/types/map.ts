export interface IBuilding {
  id: string
  title: string
  sprite: string
  plan: string
}

export type TPosition = [number, number]; // [x, y]
export type TRouteType = 'map'|'building';
export type TRoute = [TRouteType, string, TPosition]; // [type, id, exit position]

export interface IBarrierOption {
  way: number
  view: number
  bullet: number
}

export interface ITexture {
  texturpack: string
  index: number
}

export interface IEntrans {
  position: TPosition
  route: TRoute
}

export interface IObject {
  position: TPosition
  image: string
  destructible: boolean
  barrier: IBarrierOption
}

export interface IMap {
  id: string
  title: string
  desctription: string
  texture: Array<Array<ITexture>>
  objects: Array<IObject>
  buildings: Array<IBuilding>
}
