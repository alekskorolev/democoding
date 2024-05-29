import { DynamicModule, Module } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@lib/config';

@Module({
  imports: [
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: MongoModule,
      providers: [
        {
          provide: 'MONGO_OPTIONS',
          useValue: options,
        },
        MongoService,
      ],
      exports: [
        MongoService,
      ],
      global: true,
    }
  }
}
