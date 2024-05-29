import { Inject, Injectable } from '@nestjs/common';
import { TOrderState, TOrderType } from '@lib/types';
import { ITick, IOrder, IOrders } from '@lib/types/index.d';
import { StateService } from '@app/cmd/state.service';
import { StreamService } from '@app/cmd/stream.service';
import { TicksService } from '@app/cmd/ticks.service';

const STOP_LEVEL = 0.002;
@Injectable()
export class OrderService {
  @Inject(StateService)
  private readonly state: StateService;

  @Inject(TicksService)
  private readonly ticks: TicksService;

  @Inject(StreamService)
  private readonly stream: StreamService;
  private out: Symbol;

  private last = { bid: 0, ask: 0};

  async run(file: string, out: string): Promise<void> {
    if (out) {
      this.out = this.stream.open(out, 'write');
    }
    const csv = this.stream.openCsvStream(file);
    this.stream.onRead(csv, (line: string) => this.tick(this.ticks.parseTick(line)));
    this.stream.start(csv);
    await this.stream.waitOnStopRead(csv);
    process.stdout.write('\n');
  }

  tick(tick: ITick) {
    const { sel, buy } = this.getOrders(tick);
    this.state.count++;
    if (this.state.count % 500 === 0) {
      this.state.showInfo();
    }
    if (tick.bid > 0) this.checkBuy(buy, tick);
    if (tick.ask > 0) this.checkSel(sel, tick);
  }

  checkBuy(order: IOrder, tick: ITick): void {
    if (!this.state.buy) {
      this.state.buy = order;
      return;
    }
    if (this.state.buy.open > order.open) {
      this.state.buy = order;
      return;
    }
    this.state.buy = this.calcBuyOrder(this.state.buy, tick);
    if (this.state.buy.state !== TOrderState.OPEN) {
      //if (this.state.buy.state === TOrderState.CLOSE_PROFIT) {

      //this.state.buy.prices = this.getPrices(this.state.buy.ticks, this.state.buy.openTime);
      this.state.orders.push(this.state.buy);
      this.saveOrder(this.state.buy)
      //}
      this.state.buy = undefined;
      return;
    }
  }

  saveOrder(order: IOrder) {
    const {
      price,
      type,
      state,
      openTime,
      closeTime,
      open,
      close,
      stop,
      profit
    } = order;
    this.stream.write(this.out, [price, type, state, openTime, closeTime, open, close, stop, profit]);
  }

  checkSel(order: IOrder, tick: ITick): void {
    if (!this.state.sel) {
      this.state.sel = order;
      return;
    }
    if (this.state.sel.open < order.open) {
      this.state.sel = order;
      return;
    }
    this.state.sel = this.calcSelOrder(this.state.sel, tick);
    if (this.state.sel.state !== TOrderState.OPEN) {
      //if (this.state.sel.state === TOrderState.CLOSE_PROFIT) {

      //this.state.sel.prices = this.getPrices(this.state.sel.ticks, this.state.sel.openTime);
      this.state.orders.push(this.state.sel);
      this.saveOrder(this.state.sel)

      //}
      this.state.sel = undefined;
      return;
    }
  }

  getOrders(tick: ITick): IOrders {
    const buy: IOrder = {
      type: TOrderType.BUY,
      state: TOrderState.OPEN,
      openTime: tick.time,
      open: tick.ask,
      stop: tick.bid - STOP_LEVEL,
      profit: tick.bid - tick.ask
    }
    const sel: IOrder = {
      type: TOrderType.SELL,
      state: TOrderState.OPEN,
      openTime: tick.time,
      open: tick.bid,
      stop: tick.ask + STOP_LEVEL,
      profit: tick.bid - tick.ask
    }
    return { sel, buy }
  }

  calcBuyOrder(ord: IOrder, tick: ITick): IOrder {
    let order = this.fixProfit(ord, tick.time, tick.bid - ord.open, tick.bid);
    order = this.closeStop(order.stop, tick.bid, order, tick);
    if (order.state !== TOrderState.OPEN) return order;
    const stop = tick.bid - STOP_LEVEL;
    if (order.stop < stop) order.stop = stop;
    order.price = tick.bid;
    return order;
  }
  calcSelOrder(ord: IOrder, tick: ITick): IOrder {
    let order = this.fixProfit(ord, tick.time, ord.open - tick.ask, tick.ask);
    order = this.closeStop(tick.ask, order.stop, order, tick);
    if (order.state !== TOrderState.OPEN) return order;
    const stop = tick.ask + STOP_LEVEL;
    if (order.stop > stop) order.stop = stop; 
    order.price = tick.ask;
    return order;
  }
  fixProfit(order: IOrder, time: Date, profit: number, price: number): IOrder {
    order.profit = profit;
    order.closeTime = time;
    order.close = price;
    return order;
  }
  fixProfit_(order: IOrder, time: Date, profit: number, price: number): IOrder {
    if (profit > order.profit) {
      order.profit = profit;
      order.closeTime = time;
      order.close = price;
    }
    return order;
  }
  closeStop(a: number, b: number, order: IOrder, tick: ITick): IOrder {
    if (a >= b) {
      if (order.profit > 0) {
        order.state = TOrderState.CLOSE_PROFIT;
      } else {
        order.state = TOrderState.CLOSE_LOSS;
        order.closeTime = tick.time;
        order.close = order.stop;
      }
    }
    return order;
  }
}