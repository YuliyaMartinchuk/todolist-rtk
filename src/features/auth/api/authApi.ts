import { AxiosResponse } from "axios"
import { BaseResponseType } from "common/types"
import { instance } from "common/api"

export const authAPI = {
  login(data: LoginType) {
    return instance.post<
      BaseResponseType<{ userId: number | undefined }>,
      AxiosResponse<BaseResponseType<{ userId: number | undefined }>>,
      LoginType
    >(`auth/login`, data)
  },
  me() {
    return instance.get<BaseResponseType<UserDate>>(`auth/me`)
  },
  logOut() {
    return instance.delete<BaseResponseType>("auth/login")
  },
}

export type LoginType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: string
}

export type UserDate = {
  id: number
  email: string
  login: string
}
