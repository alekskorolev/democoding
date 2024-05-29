import { OrderService } from "@app/cmd/order.service";
import { SampleService } from "@app/cmd/sample.service";
import { StateService } from "@app/cmd/state.service";
import { StreamService } from "@app/cmd/stream.service";
import { TicksService } from "@app/cmd/ticks.service";
import { TOrderState } from "@lib/types";
import { IOrder, ISmoozedTick, ITick } from "@lib/types/index.d";
import { Inject, Injectable } from "@nestjs/common";
import { NeuralNetwork } from "brain.js";
import { INeuralNetworkData } from "brain.js/dist/neural-network";

@Injectable()
export class TradeService {
  @Inject(StateService)
  private readonly state: StateService;

  @Inject(StreamService)
  private readonly stream: StreamService;
  private out: Symbol;

  @Inject(OrderService)
  private readonly order: OrderService;

  @Inject(TicksService)
  private readonly tickS: TicksService;

  @Inject(SampleService)
  private readonly sample: SampleService;

  private selOrders: Array<IOrder> = [];
  private buyOrders: Array<IOrder> = [];
  private closed: number = 0;
  private canSel: boolean = true;
  private canBuy: boolean = true;
  private profit: number = 0;
  private profitClosed: number = 0;
  private lossClosed: number = 0;

  private ticks: Array<ISmoozedTick> = [];

  private net: NeuralNetwork<INeuralNetworkData, INeuralNetworkData>;

  async run(file: string, ticks: string, out: string): Promise<void> {
    this.state.show(`start train\nin: ${file}, out: ${out}\n`)
    const netData = await this.loadNet(file);

    this.out = this.stream.open(out, 'write');
    this.net = new NeuralNetwork();
    this.net.fromJSON(netData);
    await this.startTick(ticks);
  }

  async loadNet(file): Promise<any> {
    return new Promise(res => {
      this.state.show('Load net data\n');
      const stream = this.stream.open(file, 'read');
      this.stream.onRead(stream, (line: string) => {
        const netData = JSON.parse(line);
        res(netData);
      });
      this.stream.start(stream);
      return;
    });
  }

  async startTick(file: string) {
    const csv = this.stream.openCsvStream(file);
    this.stream.onRead(csv, (line: string) => {
      const tick = this.tickS.parseTick(line)
      this.tickS.addTick(tick, (stick: ISmoozedTick) => {
        this.netTick(tick, stick);
      });
      this.tick(tick);
    });
    this.stream.start(csv);
    await this.stream.waitOnStopRead(csv);
    process.stdout.write('\n');
  }

  tick(tick: ITick) {
    this.selOrders = this.selOrders.filter(order => {
      const ord = this.order.calcSelOrder(order, tick);
      if (ord.state !== TOrderState.OPEN) {
        this.stream.write(this.out, ord);
        this.closed += 1;
        this.profit += ord.profit;
        if (ord.profit > 0) {
          this.profitClosed += 1;
        } else {
          this.lossClosed += 1;
        }
        return false;
      }
      return true;
    });
    this.buyOrders = this.buyOrders.filter(order => {
      const ord = this.order.calcBuyOrder(order, tick);
      if (ord.state !== TOrderState.OPEN) {
        this.stream.write(this.out, ord);
        this.closed += 1;
        this.profit += ord.profit;
        if (ord.profit > 0) {
          this.profitClosed += 1;
        } else {
          this.lossClosed += 1;
        }
        return false;
      }
      return true;
    });
    this.state.show(
      `[${
        tick.time.toLocaleString()
      }] Calc orders , profit ${
        this.profit
      }; opened: buy ${
        this.buyOrders.length
      }, sel ${
        this.selOrders.length
      }; closed: ${
        this.closed
      }, loss: ${this.lossClosed}, prof: ${this.profitClosed}`
    );
  }

  netTick(tick: ITick, stick: ISmoozedTick) {
    this.ticks.push(stick);
    this.ticks = this.ticks.slice(-50);
    if (this.ticks.length<50) return;
    const { sel, buy } = this.order.getOrders(tick);

    const buySample = this.sample.getSamples(this.ticks, buy).reduce((acc, s) => ([...acc, ...s]), []);
    const buyPredict = this.net.run(buySample)[0];
    const selSample = this.sample.getSamples(this.ticks, sel).reduce((acc, s) => ([...acc, ...s]), []);
    const selPredict = this.net.run(selSample)[0];

    if (buyPredict > 0.9 && selPredict > 0.5) {
      const lastBuy = this.buyOrders[this.selOrders.length -1];
      if (!lastBuy || lastBuy.stop > lastBuy.open) {
        this.buyOrders.push({...buy, prices: buySample, predict: { sel: selPredict, buy: buyPredict }});
      }
    }

    if (selPredict < -0.9 && buyPredict < -0.5) {
      const lastSel = this.selOrders[this.selOrders.length -1];
      if (!lastSel || lastSel.stop < lastSel.open) {
        this.selOrders.push({...sel, prices: selSample, predict: { sel: selPredict, buy: buyPredict }});
      }
    }
  }
}