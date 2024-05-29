import { existsSync } from 'fs';
import { resolve } from 'path';
import { Inject, Injectable } from '@nestjs/common';
import { configDotenv } from 'dotenv';

@Injectable()
export class ConfigService {
  private readonly env: Record<string,any>;

  constructor(@Inject('CONFIG_OPTIONS') private options: Record<string, any>) {
    const path = this.getEnvPath(options.path);
    const { error, parsed } = configDotenv({ path, encoding: 'utf8' });
    if (error) {
      throw new Error(`Config file not parsed with ${error}`);
    }
    this.env = Object.assign({}, parsed, process.env);
  }
  getEnvPath(dest: string): string {
    const env: string | undefined = process.env.NODE_ENV;
    const fallback: string = resolve(`${dest}/.env`);
    const filename: string = env ? `${env}.env` : 'development.env';
    let filePath: string = resolve(`${dest}/${filename}`);
  
    if (!existsSync(filePath)) {
      filePath = fallback;
    }
  
    return filePath;
  }

  get(key: string, fallback?: unknown) {
    return this.env[key] || fallback;
  }

  getOrThrow(key: string) {
    if (key in this.env) {
      return this.env[key];
    }
    throw new Error(`Config property '${key}' must be configured`);
  }
}
