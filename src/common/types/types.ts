export type BaseResponse<T = {}> = {
  resultCode: number
  messages: string[]
  data: T
}
