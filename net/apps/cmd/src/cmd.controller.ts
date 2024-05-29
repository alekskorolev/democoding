import { resolve } from 'path';
import { Command, CommandRunner, Option } from 'nest-commander';
import { existsSync } from 'fs';
import { OrderService } from '@app/cmd/order.service';
import { SampleService } from '@app/cmd/sample.service';
import { TicksService } from '@app/cmd/ticks.service';
import { TrainService } from '@app/cmd/train.service';
import { TradeService } from '@app/cmd/trade.service';
import { SmplService } from '@app/cmd/smpl.service';
import { layers, randomNormal, sequential } from '@tensorflow/tfjs';

const WORKDIR = resolve(__dirname, '../../../data/');

abstract class BaseRunner extends CommandRunner {
  @Option({
    flags: '--file [string]',
  })
  parseFilename(name?: string): string|undefined {
    if (!name) return;
    const path = resolve(WORKDIR, name)
    if (existsSync(path)) {
      return path;
    }
    throw new Error(`File ${name} not exist`);
  }
  @Option({
    flags: '--out [string]',
  })
  parseOutName(name?: string): string|undefined {
    if (!name) return;
    return resolve(WORKDIR, name)
  }
}


@Command({
  name: 'smooze',
})
export class SmoozeController extends BaseRunner {
  constructor(
    private readonly service: TicksService
  ) {
    super();
  }

  async run(_: string[], options?: Record<string, any>): Promise<void> {
    const { file, out} = options;
    await this.service.run(file, out);
  }
}

@Command({
  name: 'sample',
})
export class SampleController extends BaseRunner {
  constructor(
    private readonly service: SampleService
  ) {
    super();
  }

  async run(_: string[], options?: Record<string, any>): Promise<void> {
    const { file, ticks, out } = options;
    await this.service.run(file, ticks, out);
  }

  @Option({
    flags: '--ticks [string]',
  })
  parseTicksname(name?: string): string|undefined {
    if (!name) return;
    const path = resolve(WORKDIR, name)
    if (existsSync(path)) {
      return path;
    }
    throw new Error(`File ${name} not exist`);
  }
}

@Command({
  name: 'train',
})
export class TrainController extends BaseRunner {
  constructor(
    protected readonly service: TrainService
  ) {
    super();
  }

  async run(_: string[], options?: Record<string, any>): Promise<void> {
    const { file, out } = options;
    await this.service.run(file, out);
  }
}

@Command({
  name: 'sort'
})
export class SortController extends TrainController {
  async run(_: string[], options?: Record<string, any>): Promise<void> {
    const { file, out } = options;
    await this.service.sortResults(file, out);
  }
}

@Command({
  name: 'trade',
})
export class TradeController extends BaseRunner { 
  constructor(
    private readonly service: TradeService
  ) {
    super();
  }

  async run(_: string[], options?: Record<string, any>): Promise<void> {
    const { file, ticks, out } = options;
    await this.service.run(file, ticks, out);
  }

  @Option({
    flags: '--ticks [string]',
  })
  parseTicksname(name?: string): string|undefined {
    if (!name) return;
    const path = resolve(WORKDIR, name)
    if (existsSync(path)) {
      return path;
    }
    throw new Error(`File ${name} not exist`);
  }
}


@Command({
  name: 'smpl',
})
export class SmplController extends BaseRunner { 
  constructor(
    private readonly service: SmplService
  ) {
    super();
  }

  async run(_: string[], options?: Record<string, any>): Promise<void> {
    const { file, ticks, out } = options;
    await this.service.run(file, ticks, out);
  }

  @Option({
    flags: '--ticks [string]',
  })
  parseTicksname(name?: string): string|undefined {
    if (!name) return;
    const path = resolve(WORKDIR, name)
    return path;
  }
}

@Command({
  name: 'tfs',
})
export class TfsController extends CommandRunner { 
  constructor(
    private readonly service: SmplService
  ) {
    super();
  }

  async run(_: string[], options?: Record<string, any>): Promise<void> {
    // Define a simple model.
    const model = sequential();
    model.add(layers.dense({units: 100, activation: 'relu', inputShape: [10]}));
    model.add(layers.dense({units: 1, activation: 'linear'}));
    model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

    const xs = randomNormal([100, 10]);
    const ys = randomNormal([100, 1]);

    // Train the model.
    model.fit(xs, ys, {
      epochs: 100,
      callbacks: {
        onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
      }
    });
  }
}