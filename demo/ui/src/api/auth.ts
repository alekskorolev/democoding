import { IRegData } from 'shared/types';
import axios, { Axios } from 'axios';
import { IAuthData } from '@libs/shared';

interface IApiOptions {
  baseUrl: string;
}

export default class AuthApi {
  private client: Axios;

  constructor({ baseUrl }: IApiOptions) {
    const url = `${baseUrl}\id`;
    this.client = axios.create({
      baseURL: url
    });
  }

  async registration(data: IRegData) {
    return this.client.post('registration', data);
  }

  async authenticate(data: IAuthData) {
    return this.client.post('authentication', data);
  }
}