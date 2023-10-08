export type FieldErrorType = {
  error: string
  field: string
}

export type BaseResponseType<T = {}> = {
  resultCode: number
  messages: string[]
  data: T
  fieldsErrors: FieldErrorType[]
}
