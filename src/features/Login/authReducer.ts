import { Dispatch } from "redux"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { appActions } from "app/appReducer"
import { clearTasksAndTodolists } from "common/actions/commonActions"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { authAPI, LoginType } from "features/Login/authApi"
import { Result_Code } from "common/enums"
import { createAppAsyncThunk } from "common/utils"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
  },
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginType>("auth/login", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(appActions.setStatus({ status: "loading" }))
    const res = await authAPI.login(arg)
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(appActions.setStatus({ status: "succeeded" }))
      return { isLoggedIn: true }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (e) {
    const error = (e as Error).message
    handleServerNetworkError(dispatch, error)
    return rejectWithValue(null)
  }
})

const logOut = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  try {
    dispatch(appActions.setStatus({ status: "loading" }))
    const res = await authAPI.logOut()
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(appActions.setStatus({ status: "succeeded" }))
      dispatch(clearTasksAndTodolists())
      return { isLoggedIn: false }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  } catch (e) {
    const error = (e as Error).message
    handleServerNetworkError(dispatch, error)
    return rejectWithValue(null)
  }
})

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

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { login, logOut }
