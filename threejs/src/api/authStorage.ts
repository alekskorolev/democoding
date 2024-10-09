export default class AuthStorage {
  private jwt: string|null

  private KEY = 'session:token'

  constructor() {
    this.jwt = localStorage.getItem(this.KEY);
  }

  public get token(): string|null {
    return this.jwt;
  }

  public set token(value: string|null) {
    this.jwt = value;
    if (value) {
      localStorage.setItem(this.KEY, value);
    } else {
      localStorage.removeItem(this.KEY);
    }
  }
}

export const authStorage = new AuthStorage();
