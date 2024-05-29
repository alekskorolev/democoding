import { ConfigService } from '@lib/config';
import { LoggerService } from '@lib/logger';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { sign, verify } from 'jsonwebtoken';

@LoggerService.inject()
@Injectable()
export class JwtService {
  private readonly key: string;
  private readonly pub: string;
  private readonly secret: string;
  private readonly logger: LoggerService;
  private readonly activateExp: string;
  constructor(
    private readonly config: ConfigService
  ) {
    this.key = readFileSync(config.getOrThrow('JWT_PRIVATE_KEY')).toString();
    this.pub = readFileSync(config.getOrThrow('JWT_PUBLIC_KEY')).toString();
    this.secret = config.getOrThrow('JWT_SECRET');
    this.activateExp = config.get('JWT_ACTIVATE_EXPIRATION');
  }

  async createActivationCode(login: string): Promise<string> {
    const token = await sign({ login }, this.secret, { expiresIn: this.activateExp });
    this.logger.debug(token);
    return token;
  }

  async verifyActivationCode(token: string): Promise<string> {
    const data = await verify(token, this.secret);
    this.logger.debug(data);
    return data.login;
  }

  async sign(data: unknown): Promise<string> {
    //const token = await sign(data, this.key, { algorithm: 'RS256' });
    const token = await sign(data, this.secret)
    this.logger.debug([token, new Date().getTime()]);
    return token;
  }

  async verify(token: string): Promise<unknown> {
    const data = await verify(token, this.secret);
    this.logger.debug(data);
    return data;
  }
}
