import { ConfigService } from '@lib/config';
import { Injectable } from '@nestjs/common';
import { compile } from 'handlebars';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createTransport } from 'nodemailer';
import { LoggerService } from '@lib/logger';
import { htmlToText } from 'html-to-text';

const TEMPLATES = [
  'activate',
]

@LoggerService.inject()
@Injectable()
export class MailService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();
  private readonly from: string;
  private readonly mailer;
  private readonly logger: LoggerService;
  private readonly base_url: string;

  constructor(private readonly config: ConfigService) {
    if (!config) {
      throw new Error('Config service not injected');
    }
    this.readTemplates();
    this.mailer = createTransport({
      host: config.getOrThrow('MAIL_SERVER'),
      port: config.getOrThrow('MAIL_PORT'),
      auth: {
          user: config.getOrThrow('MAIL_USER'),
          pass: config.getOrThrow('MAIL_PASSWORD'),
      }
    });
    this.from = config.getOrThrow('MAIL_FROM');
    this.base_url = config.getOrThrow('BASE_UI_URL');
  }

  private readTemplates() {
    TEMPLATES.forEach(template => {
      const tpl = readFileSync(resolve(this.config.getOrThrow('MAIL_TEMPLATES'), `./${template}.hbs`)).toString();
      this.templates.set(template, compile(tpl));
    });
  }

  async sendActivation(to: string, code: string): Promise<void> {
    const html = this.templates.get('activate')({ code, url: this.base_url });
    const msg = {
      to,
      from: this.from,
      subject: 'Активируйте учетную запись АК',
      text: htmlToText(html),
      html,
    };
    this.logger.debug(msg);
    const result = await this.mailer.sendMail(msg);
    this.logger.debug(result);
    return result;
  }
}
