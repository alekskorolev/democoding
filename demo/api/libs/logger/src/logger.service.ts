import { existsSync } from 'fs';
import { resolve } from 'path';
import { ConsoleLogger, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@lib/config';

type TLevel = 'all' | 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'off';
type TLogLevel = 'verbose' | 'debug' | 'log' | 'warn' | 'error' | 'fatal';

export interface ILoggerOptions {
  logLevel?: TLevel
  writeToFile?: boolean
  logDirectory?: string
  context?: string
}
const ALL_LEVELS: Array<TLogLevel> = [
  'verbose',
  'debug',
  'log',
  'warn',
  'error',
  'fatal',
];
const LEVELS = {
  all: ALL_LEVELS,
  verbose: ALL_LEVELS,
  debug: ALL_LEVELS.slice(1,),
  info: ALL_LEVELS.slice(2,),
  warn: ALL_LEVELS.slice(3,),
  error: ALL_LEVELS.slice(4,),
  fatal: ALL_LEVELS.slice(5,),
  off: [],
}
// TODO: сделать подключение разных способов хранения логов, изменения уровня логирования
@Injectable()
export class LoggerService extends ConsoleLogger {
  context?: string;

  static inject(options: ILoggerOptions = {}) {
    return function setContext<T extends { new (...args: any[]): {} }>(constructor: T) {
      if (!options.context) options.context = constructor.name;
      return class extends constructor {
        logger: LoggerService = new LoggerService(options);

        config: ConfigService;

        constructor(...args) {
          super(...args);
          if (this.config && !options.logLevel) {
            this.logger.setLogLevels(LEVELS[this.config.get('LOG_LEVEL', 'all')]);
          }
        }
      };
    }
  }

  constructor(
    @Inject('LOGGER_OPTIONS') options: ILoggerOptions
  ) {
    super()
    if (options.context) this.setContext(options.context);
    this.setLogLevels(LEVELS[options.logLevel || 'all']);
  }
}
