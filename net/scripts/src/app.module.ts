import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ParseCommand, PrepareCommand } from './app.command';
import { Config } from '~/libs/config'
import { KnexModule } from 'nestjs-knex';
import { KnexConfig } from '~/libs/knex.config';

@Module({
  imports: [
    Config,
    KnexModule.forRootAsync({
      useClass: KnexConfig
    })
  ],
  controllers: [],
  providers: [AppService, ParseCommand, PrepareCommand],
})
export class AppModule {}
