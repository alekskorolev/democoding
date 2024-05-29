import { Injectable } from '@nestjs/common';
import { Parser, parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { ISourceRow, TSourceData } from '~/types/raw.sourse.d';
import { ISample } from '~/types/sample.d'

const SAMPLE_LENGTH = 15;
const RESULT_LENGTH = 5;

@Injectable()
export class AppService {
  async LoadTiks(file: string): Promise<any> {
    const stream = this.createStream(file);
    return this.parseTiks(stream);
  }

  private async parseTiks(parser: Parser): Promise<any> {
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

  async parseFile(file: string): Promise<TSourceData> {
    const stream = this.createStream(file);
    return this.parseData(stream)
  }

  buildSamples(source: TSourceData): Array<ISample> {
    const sourceLength = SAMPLE_LENGTH + RESULT_LENGTH;
    const samples = [];
    console.log(source.length)
    for (let i = 0; i < (source.length - sourceLength); i++) {
      const sourcePart = source.slice(i, i+sourceLength);
      const sample = this.buildSample(sourcePart);
      samples.push(sample);
    }
    return samples;
  } 

  async parseData(parser: Parser): Promise<TSourceData> {
    const data: TSourceData = [];
    return new Promise(resolve => {
      parser.on('data', (row: string) => {
        const item = this.normalize(row.toString().split(/\t+/gi));
        data.push(item)
      }).on('end', () => {
        resolve(data)
      })
    }) 
  }

  normalize(item: Array<string>): ISourceRow {
    const [ o,c,h,l ] = item.slice(2, 6).map(parseFloat);
    return { o, c, h, l }
  } 

  private createStream(file: string): Parser {
    return createReadStream(file).pipe(parse());
  }

  private buildSample(part: TSourceData): ISample {
    const first = part[0].o
    const input = part.slice(0, SAMPLE_LENGTH).map(({o}) => 1000 * (o - first));
    const output = part.slice(SAMPLE_LENGTH).map(({c}) => 1000 * (c - first));
    return { input, output };
  }
}
