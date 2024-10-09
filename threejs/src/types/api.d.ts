interface RequestResult {
  success: boolean
  error?: string|null
}
export interface LoginRequestResult extends RequestResult {
  accessToken?: string
}

export interface ProfileEntity {
  id: string
  name: string
  email: string
}

export interface ProfileRequestResult extends RequestResult {
  profile?: ProfileEntity
}

export interface AvatarUploadResult extends RequestResult {
  fileurl?: string|null
}

export interface ProfilesRequestResult extends RequestResult {
  profiles?: Array<ProfileEntity>
}
