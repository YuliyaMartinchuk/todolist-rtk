import { Dispatch } from "redux"
import { authAPI, LoginType } from "api/todolist-api"
import { Result_Code } from "./tasksReducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { appActions } from "state/appReducer"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      //return { ...state, isLoggedIn: action.payload.value };
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
})

export const authReducer = slice.reducer
export const authActions = slice.actions

export const loginTC = (data: LoginType) => async (dispatch: Dispatch) => {
  try {
    dispatch(appActions.setStatus({ status: "loading" }))
    const res = await authAPI.login(data)
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      dispatch(appActions.setStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    const error = (e as Error).message
    handleServerNetworkError(dispatch, error)
  }
}

export const logOutTC = () => async (dispatch: Dispatch) => {
  try {
    dispatch(appActions.setStatus({ status: "loading" }))
    const res = await authAPI.logOut()
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
      dispatch(appActions.setStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    const error = (e as Error).message
    handleServerNetworkError(dispatch, error)
  }
}

export const meTC = () => async (dispatch: Dispatch) => {
  try {
    dispatch(appActions.setStatus({ status: "loading" }))
    const res = await authAPI.me()
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      dispatch(appActions.setStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    const error = (e as Error).message
    handleServerNetworkError(dispatch, error)
  } finally {
    dispatch(appActions.setInitialized({ isInitialized: true }))
  }
}
