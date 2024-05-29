import { ConfigModule } from '@nestjs/config';
import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = env ? `${env}.env` : 'development.env';
  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    console.log(filePath, 1);
    filePath = fallback;
  }

  return filePath;
}

export const Config = ConfigModule.forRoot({ envFilePath: getEnvPath('../env'), isGlobal: true })