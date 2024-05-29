import { Module } from '@nestjs/common';
import { AuthenticateController } from './authenticate.controller';
import { AuthenticateService } from './authenticate.service';
import { ConfigModule, ConfigService } from '@lib/config';
import { LoggerModule } from '@lib/logger';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'apps/authenticate/src/dto/user.schema';
import { MailModule } from '@lib/mail';
import { JwtModule } from '@lib/jwt';

@Module({
  imports: [
    ConfigModule.register({ path: './envs' }),
    LoggerModule.register({ context: 'Authenticate' }),
    MailModule,
    JwtModule,
    MongooseModule.forRootAsync({
      async useFactory(config: ConfigService) {
        return {
          uri: config.getOrThrow('MONGO_DB_URI'),
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuthenticateController],
  providers: [AuthenticateService],
})
export class AuthenticateModule {}
