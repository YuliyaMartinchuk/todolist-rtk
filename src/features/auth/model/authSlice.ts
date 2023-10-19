import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import { appActions } from "app/model/appSlice"
import { clearTasksAndTodolists } from "common/actions/commonActions"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { authAPI, LoginType } from "features/auth/api/authApi"
import { Result_Code } from "common/enums"
import { createAppAsyncThunk } from "common/utils"
import { BaseResponseType } from "common/types"
import { thunkTryCatch } from "common/utils/thunkTryCatch"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(authThunks.login.fulfilled, authThunks.logOut.fulfilled, authThunks.initializeApp.fulfilled),
      (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      }
    )
  },
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginType, { rejectValue: BaseResponseType | null }>(
  "auth/login",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    const res = await authAPI.login(arg)
    if (res.data.resultCode === Result_Code.OK) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

const logOut = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
  const res = await authAPI.logOut()
  const { dispatch, rejectWithValue } = thunkAPI
  if (res.data.resultCode === Result_Code.OK) {
    dispatch(clearTasksAndTodolists())
    return { isLoggedIn: false }
  } else {
    return rejectWithValue(null)
  }
})

export const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/initializeApp",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      const res = await authAPI.me()
      if (res.data.resultCode === Result_Code.OK) {
        return { isLoggedIn: true }
      } else {
        return rejectWithValue(null)
      }
    } catch (e) {
      return rejectWithValue(null)
    } finally {
      dispatch(appActions.setInitialized({ isInitialized: true }))
    }
  }
)

export const authSlice = slice.reducer
export const authThunks = { login, logOut, initializeApp }
