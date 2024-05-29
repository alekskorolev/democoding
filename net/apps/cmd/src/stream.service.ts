import { ReadStream, WriteStream, createReadStream, createWriteStream, existsSync, unlinkSync } from 'fs';
import { EventEmitter } from 'stream';
import { Interface, createInterface } from 'readline';
import { Parser, parse } from 'csv-parse';
import { Injectable } from '@nestjs/common';
import { EventCallback } from '@lib/types/index.d';

class Emiter extends EventEmitter {
  emit(eventName: 'close'|'start'|'pause'|'resume'|'line', ...args: any[]): boolean {
    return super.emit(eventName, ...args);
  }
}


@Injectable()
export class StreamService extends EventEmitter {
  private streams = new Map<Symbol, WriteStream|ReadStream>;
  private emiters = new Map<Symbol, Emiter>;
  private readers = new Map<Symbol, Interface>;
  open(file: string, type: 'write'|'read' = 'read', over: boolean = true) {
    if (type === 'write') return this.createWriteStream(file, over);
    if (type === 'read') return this.createReadStream(file);
  }

  emit(eventName: 'close'|'start'|'pause'|'resume'|'line', name: Symbol, ...args: any[]): boolean {
    const emiter = this.emiters.get(name);
    if (!emiter) return;
    emiter.emit(eventName, ...args);
  }


  openCsvStream(file: string): Symbol{
    const stream = createReadStream(file);
    const name = Symbol(file);
    this.streams.set(name, stream);
    const emiter = new Emiter();
    this.emiters.set(name, emiter);
    emiter.on('start', () => this.startCsvStream(stream.pipe(parse()), emiter));
    return name;
  }
  private startCsvStream(parser: Parser, emiter: Emiter): void {
    parser.on('data', (line: string) => {
      emiter.emit('line', line);
    }).on('end', () => emiter.emit('close'));
  }

  private createWriteStream(file: string, over: boolean = true): Symbol {
    if (over && existsSync(file)) {
      unlinkSync(file);
    }
    const name = Symbol(file);
    this.streams.set(name, createWriteStream(file));
    return name;
  }

  private createReadStream(file: string): Symbol {
    if (!existsSync(file)) {
      throw new Error(`File ${file} not exist`);
    }
    const name = Symbol(file);
    const stream = createReadStream(file);
    this.streams.set(name, stream);
    const emiter = new Emiter();
    this.emiters.set(name, emiter);
    let reader: Interface;
    this.readers.set(name, reader);
    emiter.on('start', () => {
      reader = createInterface({
        input: stream
      }).on('line', (line: string) => {
        emiter.emit('line', line);
      }).on('close', () => emiter.emit('close'));
    });
    emiter.on('close', () => stream?.close());
    emiter.on('pause', () => stream.pause());
    emiter.on('resume', () => stream.resume());
    return name;
  }

  async waitOnStopRead(name: Symbol): Promise<void> {
    const emiter = this.emiters.get(name);
    const stream = this.streams.get(name) as ReadStream;
    if (!emiter) return;
    return new Promise(res => {
      emiter.on('close', () => {
        res();
      });
    });
  }

  onRead(name: Symbol, cb: EventCallback) {
    const emiter = this.emiters.get(name);
    const stream = this.streams.get(name);
    if (!stream) throw new Error('Stream not found');
    if (stream instanceof WriteStream) throw new Error('Stream is not readeble');
    emiter.on('line', cb)
  }

  write(name: Symbol, line: any) {
    const stream = this.streams.get(name);

    if (!stream) throw new Error('Stream closed');
    if (stream instanceof ReadStream) throw new Error('Stream is not writable');
    
    stream.write(JSON.stringify(line));
    stream.write('\n');
  }

  pause(name: Symbol) {
    const stream = this.readers.get(name);
    if (!stream) return;
    if (stream instanceof WriteStream) return;
    stream.pause();
  }

  resume(name: Symbol) {
    const stream = this.streams.get(name) as ReadStream;
    if (!stream) return;
    if (stream instanceof WriteStream) return;
    stream.resume();
  }

  start(name: Symbol) {
    const emiter = this.emiters.get(name);
    if (!emiter) throw new Error('Stream closed');
    emiter.emit('start');
  }

  close(name: Symbol) {
    const stream = this.streams.get(name);
    const emiter = this.emiters.get(name);
    if (emiter) {
      emiter.emit('close');
      emiter.removeAllListeners();
      this.emiters.delete(name);
    }
    if (stream) {;
      stream.close();
      this.streams.delete(name);
    }
  }
}