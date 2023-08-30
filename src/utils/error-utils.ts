import { Dispatch } from "redux"
import { ResponseType } from "api/todolist-api"
import { appActions } from "app/appReducer"
import axios from "axios"
import { AppDispatch } from "app/store"

export const handleServerNetworkError = (dispatch: AppDispatch, err: unknown): void => {
  let errorMessage = "Some error occurred"
  // ❗Проверка на наличие axios ошибки
  if (axios.isAxiosError(err)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = err.response?.data?.message || err?.message || errorMessage
    // ❗ Проверка на наличие нативной ошибки
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(err)
  }

  dispatch(appActions.setError({ error: errorMessage }))
  dispatch(appActions.setStatus({ status: "failed" }))
}

export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
  const error = data.messages[0]
  if (error) {
    dispatch(appActions.setError({ error: error }))
  } else {
    dispatch(appActions.setError({ error: "some error" }))
  }
  dispatch(appActions.setStatus({ status: "failed" }))
}
