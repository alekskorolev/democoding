export interface ICredentialData {
  login: string
  password: string
}
export interface IAuthData extends ICredentialData {
  remember: boolean
}
export interface IRegData extends ICredentialData {
  repassword: string
}

export interface IVerifyData {
  code: string
}