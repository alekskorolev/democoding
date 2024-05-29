import { CmdModule } from './cmd.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  await CommandFactory.run(CmdModule);
}
bootstrap();
