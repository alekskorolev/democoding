import { Inject, Injectable } from '@nestjs/common';
import { Parser, parse } from 'csv-parse';
import { WriteStream, createReadStream, createWriteStream, existsSync, unlinkSync } from 'fs';
import { ITick } from '@lib/types/tiks';

@Injectable()
export class CmdService {
  async LoadTiks(file: string): Promise<Array<ITick>> {
    const stream = this.createStream(file);
    return this.parseTiks(stream);
  }

  createOutputStream(file: string): WriteStream {
    if (existsSync(file)) {
      unlinkSync(file);
    }
    const stream = createWriteStream(file);
    return stream
  }

  destroyOutputStream(stream: WriteStream) {
    stream.close();
  }

  private createStream(file: string): Parser {
    return createReadStream(file).pipe(parse());
  }

  async startTicks(file: string): Promise<void> {
    const stream = this.createStream(file);
    return this.start(stream);
  }

  private async start(parser: Parser): Promise<void> {
    return new Promise((res, rej) => {
      parser.on('data', (row: string) => {
        const item = row.toString().split(/\t/gi);
        const [date, time, bid, ask, _last, _vol, flags] = item;
        /*this.emiter.emit('tick', {
          time: new Date(`${date.replace(/\./gi, '-')}T${time}Z`),
          bid: parseFloat(bid),
          ask: parseFloat(ask),
          flags: parseInt(flags, 10)
        })*/
      }).on('end', () => res());
    })
  }

  private async parseTiks(parser: Parser): Promise<Array<ITick>> {
    const tiks = [];
    let lastBid = null;
    let lastAsk = null;
    return new Promise((res, rej) => {
      parser.on('data', (row: string) => {
        const item = row.toString().split(/\t/gi);
        const [date, time, bid, ask, last, vol, flags] = item;
        lastBid = parseFloat(bid) || lastBid;
        lastAsk = parseFloat(ask) || lastAsk,
        tiks.push({
          time: new Date(`${date.replace(/\./gi, '-')}T${time}Z`),
          bid: lastBid,
          ask: lastAsk,
          flags: parseInt(flags, 10)
        });
      }).on('end', () => res(tiks));
    })
  }
}
