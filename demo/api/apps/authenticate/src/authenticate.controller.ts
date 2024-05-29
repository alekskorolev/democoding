import { Body, Controller, Get, HttpStatus, Inject, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticateService } from './authenticate.service';
import { IAuthData, IRegData, IVerifyData } from '@lib/shared';
import { LoggerService } from '@lib/logger'; 
import { ConfigService } from '@lib/config';
import { MailService } from '@lib/mail';
import { JwtService } from '@lib/jwt';

@LoggerService.inject()
@Controller('id')
export class AuthenticateController {
  readonly logger: LoggerService;
  private readonly baseUrl: string;

  constructor(
    private readonly service: AuthenticateService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
    private readonly jwt: JwtService,
  ) {
    this.baseUrl = config.getOrThrow('BASE_UI_URL');
  }

  @Get()
  async me() {
    return this.service.getHello();
  }

  @Post('registration')
  async registration(@Body() regData: IRegData, @Res() res: Response): Promise<void> {
    this.logger.debug(regData);
    try {
      const login = await this.service.registration(regData);
      try {
        const code = await this.jwt.createActivationCode(login);
        await this.mail.sendActivation(login, code);
      } catch(e) {
        this.logger.error(e);
      }
      res.json({ login });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  @Post('authentication')
  async authentication(@Body() authData: IAuthData, @Res() res: Response): Promise<void> {
    this.logger.debug(authData);
    try {
      const user = await this.service.authenticate(authData);
      res.json(user);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({ error: error.message });
    }
  }

  @Get('activate')
  async veryfy(@Query('code') code: string, @Res() res: Response): Promise<void> {
    try {
      this.logger.debug(code);
      const login = await this.jwt.verifyActivationCode(code);
      await this.service.activate(login);
      res.redirect(`${this.baseUrl}activation/success`);
    } catch (e) {
      res.redirect(`${this.baseUrl}activation/error`);
    }
  }
}
