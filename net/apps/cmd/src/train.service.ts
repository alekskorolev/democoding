import { StateService } from '@app/cmd/state.service';
import { StreamService } from '@app/cmd/stream.service';
import { ISample } from '@lib/types/index.d';
import { Inject, Injectable } from '@nestjs/common';
import { NeuralNetwork, NeuralNetworkGPU } from 'brain.js';
import { INeuralNetworkData, INeuralNetworkDatum, INeuralNetworkTrainOptions } from 'brain.js/dist/neural-network';
import { data, layers, ones, randomNormal, sequential, tensor } from '@tensorflow/tfjs';

type TLayers = Array<Array<number>>;
const LAYERS = [
  [50,40,20,7],
  [110,40,10,8],
  [60,50,10,7]
]
const A = [90, 110, 120];
const B = [20, 30, 40];
const C = [10, 50, 80];
const D = [3, 5, 8];

const LAYERS_ = A.reduce((aacc, a) => {
  return [
    ...aacc,
    ...B.reduce((bacc, b) => {
      return [
        ...bacc,
        ...C.reduce((cacc, c) => {
          return [
            ...cacc,
            ...D.map(d => [c, d])
          ]
        }, []).map(c => [b, ...c])
      ]
    }, []).map(b => ([a, ...b]))
  ]
}, []);
console.log(LAYERS.length)

@Injectable()
export class TrainService {
  @Inject(StateService)
  private readonly state: StateService;

  @Inject(StreamService)
  private readonly stream: StreamService;
  private out: Symbol;

  private samples: Array<{input: Array<number>, output: Array<number>}> = [];

  async run(file: string, out: string): Promise<void> {
    this.state.show(`start train\nin: ${file}, out: ${out}\n`)
    await this.getSamples(file);

    // Define a simple model.
    const model = sequential();
    model.add(layers.dense({units: 100, activation: 'relu', inputShape: [150]}));
    model.add(layers.dense({units: 60, activation: 'relu6'}));
    model.add(layers.dense({units: 20, activation: 'linear'}));
    model.add(layers.dense({units: 4, activation: 'sigmoid', }));
    model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
    const sample = this.samples.slice(0, -2);
    function* gdata() {
      for(let i = 0; i<sample.length; i++) {
        yield sample[i].input;
      }
    }
    function* labels() {
      for(let i = 0; i<sample.length; i++) {
        yield sample[i].output;
      }
    }
    const xs = data.generator(gdata);
    const ys = data.generator(labels);
    const ds = data.zip({xs, ys}).shuffle(100 /* bufferSize */).batch(150);
    // Train the model.
    model.fitDataset(ds, {
      epochs: 5,
      callbacks: {
        onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
      }
    }).then(info => {
      console.log(info)
      console.log(
        model.predict(tensor(this.samples[this.samples.length -1].input, [150]))
      );
      console.log(this.samples[this.samples.length -1].output)
    });
  }

  async run__(file: string, out: string): Promise<void> {
    this.state.show(`start train\nin: ${file}, out: ${out}\n`)
    await this.getSamples(file);
    const net = new NeuralNetwork({
      //mode: 'cpu',
      hiddenLayers: LAYERS[0],
      inputSize: 150,
      outputSize: 1
    });
    /*net.train(this.samples, {
      iterations: 20000,
      errorThresh: 0.0000001,
      activation: 'tanh',
      callbackPeriod: 1,
      callback: ({ iterations, error}) => {
        this.state.show(`iterations: ${iterations}, training error: ${error}`);
      }
    });*/
    const netData = net.toJSON();
    this.out = this.stream.open(out, 'write');
    this.stream.write(this.out, netData);
  }

  async run_(file: string, out: string): Promise<void> {
    this.state.show(`start train\nin: ${file}, out: ${out}\n`)
    await this.getSamples(file);
    this.out = this.stream.open(out, 'write', false);
    this.state.show(`Start opts to ${new Date()}\n`)
    let layerOption;
    while(layerOption = LAYERS.shift()) {
      const option = this.checkNetOptions(layerOption);
      this.state.show(`Save opts for ${option.error} error with ${JSON.stringify(layerOption)} layers`);
      this.stream.write(this.out, option);
      this.state.next();
    }
    this.state.show(`End opts to ${new Date()}\n`)
  }

  async sortResults(file: string, out: string): Promise<void> {
    const stream = this.stream.open(file, 'read');
    this.out = this.stream.open(out, 'write', false);
    const options = [];
    this.stream.onRead(stream, (line: string) => {
      const option = JSON.parse(line);
      options.push(option);
    });
    this.stream.start(stream);
    await this.stream.waitOnStopRead(stream);
    options.sort((a, b) => a.error < b.error ? -1 : 1);
    options.forEach(option => this.stream.write(this.out, option));
    return;
  }

  getOptions() {
    const activation = 'tanh';
    //const layers = 2//Math.ceil(2 + Math.random() * 3);
    //const hiddenLayers = Array.from(Array(layers).keys()).map(num => Math.ceil((Math.random() * (150 - (num * 10)))));
    return {
      activation,
      errorThresh: 0.0000001,
      callbackPeriod: 50,
      iterations: 2000
    }
  }
  checkNetOptions(hiddenLayers) {
    const options = this.getOptions();
    const errors: Array<number> = [];
    const net = new NeuralNetwork({
      ...options,
      hiddenLayers,
      callback: ({ iterations, error}) => {
        errors.push(error);
        this.state.show(`iterations: ${iterations}, training error: ${error}`);
      }
    });
    /*net.train(this.samples)*/
    return {
      error: errors[errors.length - 1],
      velocity: errors[0] - errors[errors.length - 1],
      option: {...options, hiddenLayers, callback: undefined}
    };
  }
  async getSamples(file: string): Promise<void> {
    const stream = this.stream.open(file, 'read');
    this.stream.onRead(stream, (line: string) => {
      const [output, input] = JSON.parse(line);
      const sample = {
        input,
        output
      }
      this.samples.push(sample);
      this.state.show(`Load ${this.samples.length} samples.`);
    });
    this.stream.start(stream);
    await this.stream.waitOnStopRead(stream);
    this.state.next();
    return;
  }
}