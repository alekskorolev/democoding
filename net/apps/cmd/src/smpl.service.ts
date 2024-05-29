import { StateService } from '@app/cmd/state.service';
import { StreamService } from '@app/cmd/stream.service';
import { TOrderType } from '@lib/types';
import { IOrder, ISmoozedTick } from '@lib/types/index.d';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SmplService {
  @Inject(StateService)
  private readonly state: StateService;

  @Inject(StreamService)
  private readonly stream: StreamService;
  private sel: Symbol;
  private buy: Symbol;

  async run(source: string, sel: string, buy: string) {
    this.sel = this.stream.open(sel, 'write');
    this.buy = this.stream.open(buy, 'write');
    await this.getSamples(source)
  }

  async getSamples(file: string): Promise<void> {
    const stream = this.stream.open(file, 'read');
    this.stream.onRead(stream, (line: string) => {
      const {price, type, state, openTime, closeTime, open, close, stop, profit, prices} = JSON.parse(line);
      const predict = Math.sign(profit) * Math.atan(50 * Math.pow(125 * profit, 4) * Math.sqrt((new Date(closeTime).valueOf() - new Date(openTime).valueOf())/1000000))/1.57;
      const out = type === TOrderType.BUY ? this.buy : this.sel;
      this.stream.write(out, [[predict], prices]);
    });
    this.stream.start(stream);
    await this.stream.waitOnStopRead(stream);
    this.state.next();
    return;
  }
}