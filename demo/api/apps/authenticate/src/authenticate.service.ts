import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { compare } from 'bcrypt';
import { ConfigService } from '@lib/config';
import { LoggerService } from '@lib/logger';
import { Injectable } from '@nestjs/common';
import { IRegData, ERRORS, IAuthData } from '@lib/shared';
import { User } from './dto/user.schema';

@LoggerService.inject()
@Injectable()
export class AuthenticateService {
  readonly logger: LoggerService;
  constructor(
    private readonly config: ConfigService,
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async registration(data: IRegData): Promise<string> {
    if (data.password !== data.repassword) {
      throw new Error(ERRORS.PASSWORD_NO_MATCH);
    }
    const exist = await this.UserModel.findOne({ login: data.login });
    if (exist) {
      throw new Error(ERRORS.USER_EXIST);
    }
    const user = new this.UserModel(data);
    await user.save();
    return user.login;
  }

  async authenticate(data: IAuthData): Promise<User> {
    const user = await this.UserModel.findOne({ login: data.login });
    if (!user) {
      throw new Error(ERRORS.NOT_FOUND);
    }
    const isMatch = await compare(data.password, user.password);
    if (!isMatch) {
      throw new Error(ERRORS.NOT_FOUND);
    }
    const result = user.toJSON();
    delete result.password;
    return result;
  }

  async activate(login: string): Promise<string> {
    const user = await this.UserModel.findOne({ login });
    if (!user) {
      throw new Error(ERRORS.NOT_FOUND);
    }
    user.confirmed = true;
    await user.save();
    return user.login;
  }
}
