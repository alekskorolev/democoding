import { Module } from '@nestjs/common';
import { TradeController, SampleController, SmoozeController, TrainController, SortController, SmplController, TfsController } from './cmd.controller';
import { StateService } from '@app/cmd/state.service';
import { OrderService } from '@app/cmd/order.service';
import { SampleService } from '@app/cmd/sample.service';
import { TicksService } from '@app/cmd/ticks.service';
import { StreamService } from '@app/cmd/stream.service';
import { TrainService } from '@app/cmd/train.service';
import { TradeService } from '@app/cmd/trade.service';
import { SmplService } from '@app/cmd/smpl.service';

@Module({
  imports: [],
  controllers: [
    TradeController,
    SampleController,
    SmoozeController,
    TrainController,
    SortController,
    SmplController,
    TfsController
  ],
  providers: [
    StateService,
    SampleService,
    OrderService,
    TicksService,
    StreamService,
    TrainService,
    TradeService,
    SmplService,
    // controllers
    TradeController,
    SampleController,
    SmoozeController,
    TrainController,
    SortController,
    SmplController,
    TfsController
  ]
})
export class CmdModule {}
