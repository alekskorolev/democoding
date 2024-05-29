import { DynamicModule, Module } from '@nestjs/common';
import { ILoggerOptions, LoggerService } from './logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  static register(options: ILoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOGGER_OPTIONS',
          useValue: options,
        },
        LoggerService,
      ],
      exports: [
        LoggerService,
      ],
      global: true,
    }
  }
}