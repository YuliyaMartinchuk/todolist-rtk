import { Dispatch } from "redux"
import { ResponseType } from "api/todolist-api"
import { appActions } from "state/appReducer"

export const handleServerNetworkError = (dispatch: Dispatch, error: string) => {
  dispatch(appActions.setError({ error: error }))
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
