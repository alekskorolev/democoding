import { NestFactory } from '@nestjs/core';
import { AuthenticateModule } from './authenticate.module';
import { ConfigService } from '@lib/config';
import { LoggerService } from '@lib/logger';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticateModule);
  const config = app.get<ConfigService>(ConfigService);
  const logger = app.get<LoggerService>(LoggerService);
  app.useLogger(logger);
  const port = config.getOrThrow('PORT');
  await app.listen(port);
  logger.log(`Application start on port ${port}`, 'NestFactory');
}
bootstrap();
