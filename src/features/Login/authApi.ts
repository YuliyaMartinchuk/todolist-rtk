import { AxiosResponse } from "axios"
import { BaseResponse } from "common/types"
import { instance } from "common/api"

export const authAPI = {
  login(data: LoginType) {
    return instance.post<
      BaseResponse<{ userId: number | undefined }>,
      AxiosResponse<BaseResponse<{ userId: number | undefined }>>,
      LoginType
    >(`auth/login`, data)
  },
  me() {
    return instance.get<BaseResponse<UserDate>>(`auth/me`)
  },
  logOut() {
    return instance.delete<BaseResponse>("auth/login")
  },
}

export type LoginType = {
  email: string
  password: string
  rememberMe: boolean
}

export type UserDate = {
  id: number
  email: string
  login: string
}
