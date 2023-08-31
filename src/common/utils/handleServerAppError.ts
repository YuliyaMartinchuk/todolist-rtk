import { Dispatch } from "redux"
import { appActions } from "app/appReducer"
import { BaseResponse } from "common/types"

export const handleServerAppError = <T>(dispatch: Dispatch, data: BaseResponse<T>) => {
  const error = data.messages[0]
  if (error) {
    dispatch(appActions.setError({ error: error }))
  } else {
    dispatch(appActions.setError({ error: "some error" }))
  }
  dispatch(appActions.setStatus({ status: "failed" }))
}
