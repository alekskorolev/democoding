import { StateService } from '@app/cmd/state.service';
import { StreamService } from '@app/cmd/stream.service';
import { IOrder, ISmoozedTick } from '@lib/types/index.d';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SampleService {
  @Inject(StateService)
  private readonly state: StateService;

  @Inject(StreamService)
  private readonly stream: StreamService;
  private out: Symbol;

  private orders: Array<IOrder> = [];
  private ticks: Array<ISmoozedTick> = [];
  private min: number = 1000000;
  private max: number = 0;

  async run(ordersFile: string, ticksFile: string, out: string): Promise<void> {
    this.state.show('start reading\n')
    await this.getOrders(ordersFile);
    this.out = this.stream.open(out, 'write');
    await this.streamTicks(ticksFile);
    this.state.show('exit\n');
  }

  async streamTicks(file: string): Promise<void> {
    const stream = this.stream.open(file, 'read');
    let tickCount = 0;
    this.stream.onRead(stream, (line: string) => {
      const [
        start,
        stop,
        count,
        [openask, openbid],
        [closeask, closebid],
        [minask, minbid],
        [maxask, maxbid]
      ] = JSON.parse(line);
      const tick: ISmoozedTick = {
        start: new Date(start),
        stop: new Date(stop),
        open: {ask: openask, bid: openbid},
        close: {ask: closeask, bid: closebid},
        max: {ask: maxask, bid: maxbid},
        min: {ask: minask, bid: minbid},
        count
      }
      this.ticks.push(tick);
      if (this.ticks.length > 50) {
        this.ticks = this.ticks.slice(-50);
      }
      tickCount++;
      this.state.show(`Load ${this.ticks.length} ticks to cache | ${tickCount} over | ${this.orders.length} left orders`);
      // if (this.orders.length === 0) throw new Error('orders out')
      this.checkOrders(tick);
    });
    this.stream.start(stream);
    await this.stream.waitOnStopRead(stream);
    this.state.next();
    //this.state.show(`Max value: ${this.max}, min value: ${this.min}\n`)
    return;
  }

  saveOrder(order: IOrder) {
    const {
      type,
      openTime,
      closeTime,
      profit } = order;
      const result = type * Math.atan(50 * Math.pow(125 * profit, 4) * Math.sqrt((closeTime.valueOf() - openTime.valueOf())/1000000))/1.57;
    const sticks = this.getSamples(this.ticks, order);
    this.stream.write(this.out, [
      [result], sticks
    ]);
  }

  getSamples(ticks: Array<ISmoozedTick>, order: IOrder): any {
    return ticks.map((tick: ISmoozedTick) => {
      const {
        start,
        stop,
        open,
        close,
        max,
        min,
        count
      } = tick;
      const field = order.type > 0 ? 'bid' : 'ask';
      const mid = order.open - ((close[field] + open[field] + min[field] + max[field])/4);
      const a = Math.sign(mid) * Math.atan(Math.sqrt(Math.abs(mid * 10000000)))/1.57;
      const b = Math.atan(1/Math.pow(count / 10, 2))/1.57;
      const period = stop.valueOf() - start.valueOf();
      const c = period === 0 ? 1 : Math.atan(10000/(period))/1.57;
      return [
        a,
        b,
        c,
      ];
    });
  }

  checkOrders(tick: ISmoozedTick) {
    this.orders = this.orders.filter((order: IOrder) => {
      if (order.openTime < tick.stop) {
        this.saveOrder(order);
        return false;
      }
      return true;
    });
  }

  async getOrders(file: string): Promise<void> {
    const stream = this.stream.open(file, 'read');
    this.stream.onRead(stream, (line: string) => {
      const [price, type, state, openTime, closeTime, open, close, stop, profit] = JSON.parse(line);
      this.orders.push({
        price,
        type,
        state,
        openTime: new Date(openTime),
        closeTime: new Date(closeTime),
        open,
        close,
        stop,
        profit,
        sticks: []
      });
      this.state.show(`Load ${this.orders.length} orders`);
    });
    this.stream.start(stream);
    await this.stream.waitOnStopRead(stream);
    this.state.next();
    return;
  }

}