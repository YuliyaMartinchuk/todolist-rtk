import { Dispatch } from "redux"
import { appActions } from "app/appReducer"
import { BaseResponseType } from "common/types"

export const handleServerAppError = <T>(dispatch: Dispatch, data: BaseResponseType<T>, showError: boolean = true) => {
  if (showError) {
    if (data.messages.length) {
      dispatch(appActions.setError({ error: data.messages[0] }))
    } else {
      dispatch(appActions.setError({ error: "Some error occurred" }))
    }
  }
  dispatch(appActions.setStatus({ status: "failed" }))
}
