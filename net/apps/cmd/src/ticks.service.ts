import { Inject, Injectable } from '@nestjs/common';
import { ISmoozedTick, ITick } from '@lib/types/index.d';
import { StreamService } from '@app/cmd/stream.service';

const SMOOZ_INTERVAL = 0.00003;

@Injectable()
export class TicksService {
  @Inject(StreamService)
  private readonly stream: StreamService;

  private tick: ISmoozedTick;
  private count: number = 0;
  private out: Symbol;
  private last = { bid: 0, ask: 0};
  
  async run(file: string, out: string) {
    if (out) {
      this.out = this.stream.open(out, 'write');
    }
    const csv = this.stream.openCsvStream(file);
    this.stream.onRead(csv, (line: string) => this.addTick(this.parseTick(line)));
    this.stream.start(csv);
    await this.stream.waitOnStopRead(csv);
    process.stdout.write('\n');
  }

  parseTick(line: string): ITick {
    const item = line.toString().split(/\t/gi);
    const [date, time, bid, ask, _last, _vol, flags] = item;
    return {
      time: new Date(`${date.replace(/\./gi, '-')}T${time}Z`),
      bid: parseFloat(bid),
      ask: parseFloat(ask),
      flags: parseInt(flags, 10)
    };
  }
  
  addTick(tick: ITick, cb?: (tick: ISmoozedTick) => void): void {
    let { ask, bid, time } = tick;
    if (!ask) ask = this.last.ask;
    if (!bid) bid = this.last.bid;
    this.last = {ask, bid};
    if (!this.tick) {
      const vol = { ask, bid };
      this.tick = {
        start: time,
        stop: time,
        open: vol,
        close: vol,
        min: vol,
        max: vol,
        count: 1,
      }
      return;
    }
    if (this.outOfSmooz({ ask, bid, time })) {
      cb ? cb(this.tick) : this.saveTick(tick);
      this.tick = undefined;
      return;
    }
    this.updateTick({ ask, bid, time });
  }
  updateTick(tick: ITick) {
    const { ask, bid, time } = tick;
    let { min, max, count } = this.tick;
    min = { ask: Math.min(ask, min.ask), bid: Math.min(bid, min.bid )};
    max = { ask: Math.max(ask, max.ask), bid: Math.max(bid, max.bid )};
    count += 1;
    this.tick = { ...this.tick, min, max, count, stop: time, close: { ask, bid } }
  }
  saveTick(tick) {
    this.count += 1;
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Saved ${this.count} ticks, last tick count: ${JSON.stringify(tick.count)}`);
    if (!this.out) return;
    this.stream.write(this.out, this.formatTick(tick));
  }
  formatTick(tick: ISmoozedTick) {
    const { start, stop, open, close, max, min, count } = tick;
    return [
      start,
      stop,
      count,
      [open.ask, open.bid],
      [close.ask, close.bid],
      [min.ask, min.bid],
      [max.ask, max.bid]
    ];
  }
  outOfSmooz(tick: ITick): boolean {
    const { open } = this.tick
    return (
      (tick.ask >= open.ask + SMOOZ_INTERVAL) ||
      (tick.bid >= open.bid + SMOOZ_INTERVAL) ||
      (tick.ask < open.ask - SMOOZ_INTERVAL) ||
      (tick.bid < open.bid - SMOOZ_INTERVAL)
    );
  }
}