import { TOrderState, TOrderType, TrderType } from "@lib/types"
import { ISmoozedTick, ITick } from "@lib/types/tiks"

export interface IOrder {
  price?: number,
  type: TOrderType,
  state: TOrderState,
  openTime: Date,
  closeTime?: Date,
  open: number,
  close?: number,
  stop: number,
  profit: number,
  ticks?: Array<ITick>,
  sticks?: Array<ISmoozedTick>,
  prices?: Array<Array<number>>,
  predict?: { sel: number, buy: number }
}
export interface IOrders {
  sel: IOrder,
  buy: IOrder,
  index?: number,
  closed?: boolean
}