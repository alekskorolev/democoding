export type TRawTick = Array<String>;

export interface ITick {
  time: Date;
  ask: number;
  bid: number;
  flags?: number;
}

export interface IVBar {
  time: Date;
  dur: number
  price: number;
  vec: number;
  ticks: number;
}

export interface ITickVolume {
  ask: number;
  bid: number;
}

export interface ISmoozedTick {
  start: Date;
  stop: Date;
  count: number;
  open: ITickVolume;
  close: ITickVolume;
  min: ITickVolume;
  max: ITickVolume;
}
