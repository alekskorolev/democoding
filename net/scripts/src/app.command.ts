import { AppService } from "@/src/app.service";
import { NeuralNetwork } from "brain.js";
import { existsSync } from 'fs';
import { writeFile } from "fs/promises";
import { Command, CommandRunner, Option } from "nest-commander";
import { resolve } from "path";

const WORKDIR = resolve(__dirname, '../../data/');
const config = {
  binaryThresh: 0.5,
  hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
  log: true,
  logPeriod: 20,
};

@Command({
  name: 'parse',
})
export class ParseCommand extends CommandRunner {
  constructor(private readonly service: AppService) {
    super();
  }

  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    const { out, file } = options;
    const data = await this.service.parseFile(file);
    data.shift();
    const samples = this.service.buildSamples(data);
    const partIdx = Math.ceil(samples.length * 0.01);
    const trainData = samples.slice(0, partIdx);
    const checkData = samples.slice(partIdx);
    const net = new NeuralNetwork(config);
    net.train(trainData)
    console.log(net.run(checkData[100].input), checkData[100].output)
    //const outFile = out ? out : resolve(WORKDIR, 'bars.json');
    //console.log(options)

    //await writeFile(outFile, JSON.stringify(data));
    console.log(samples.length, samples[0]);
  }

  @Option({
    flags: '--file [string]',
  })
  parseFilename(name?: string): string|undefined {
    const path = resolve(WORKDIR, name)
    if (existsSync(path)) {
      return path;
    }
    return;
  }

  @Option({
    flags: '--out [string]'
  })
  parseOutName(name?: string): string|undefined {
    if (!name) return;
    const path = resolve(WORKDIR, name);
    return path;
  }
}

@Command({
  name: 'prepare'
})
export class PrepareCommand extends CommandRunner {
  constructor(private readonly service: AppService) {
    super();
  }
  async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
    const { file } = options;
    const tiks = await this.service.LoadTiks(file);
    tiks.shift();
    console.log(tiks.length, tiks[9])
    return;
  }

  @Option({
    flags: '--file [string]',
  })
  parseFilename(name?: string): string|undefined {
    const path = resolve(WORKDIR, name)
    if (existsSync(path)) {
      return path;
    }
    throw new Error(`File ${name} not exist`);
  }
}