import { Injectable } from '@nestjs/common';
import { ITick, IOrder } from '@lib/types/index.d';

@Injectable()
export class StateService {
  ticks: Array<ITick> = [];
  orders: Array<IOrder> = [];
  count: number = 0;
  buy?: IOrder;
  sel?: IOrder;
  showInfo(extra?: string) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`proceed ticks: ${this.count} | proceed orders: ${this.orders.length}`);
    if (extra) {
      process.stdout.write(` - ${extra}`);
    }
  }

  show(state: string) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(state);
  }

  next() {
    process.stdout.write('\n');
  }
}