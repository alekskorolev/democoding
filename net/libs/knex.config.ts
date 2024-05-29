import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexModuleOptions, KnexModuleOptionsFactory } from 'nestjs-knex';

@Injectable()
export class KnexConfig implements KnexModuleOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createKnexModuleOptions(): KnexModuleOptions {
    return {
      config: {
          client: 'pg',
          connection: {
          host: this.config.getOrThrow('DB_HOST'),
          port: this.config.getOrThrow('DB_PORT'),
          user: this.config.getOrThrow('DB_USER'),
          database: this.config.getOrThrow('DB_NAME'),
          password: this.config.getOrThrow('DB_PASSWORD'),
          ssl: this.config.getOrThrow('DB_SSL') ? { rejectUnauthorized: false } : false,
        }
      }
    }
  }
}
