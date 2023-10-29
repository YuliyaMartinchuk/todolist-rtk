import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import { appActions } from "app/model/appSlice"
import { clearTasksAndTodolists } from "common/actions/commonActions"
import { authAPI, LoginType, securityApi } from "features/auth/api/authApi"
import { Result_Code } from "common/enums"
import { createAppAsyncThunk } from "common/utils"
import { BaseResponseType } from "common/types"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    captchaUrl: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCaptcha.fulfilled, (state, action) => {
        state.captchaUrl = action.payload.captchaUrl
      })
      .addMatcher(
        isAnyOf(authThunks.login.fulfilled, authThunks.logOut.fulfilled, authThunks.initializeApp.fulfilled),
        (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("login/fulfilled"),
        (state) => {
          state.captchaUrl = ""
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
    } else if (res.data.resultCode === Result_Code.CAPTCHA_ERROR) {
      dispatch(getCaptcha())
      return rejectWithValue(res.data)
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

const getCaptcha = createAppAsyncThunk<CaptchaArgType, undefined>("auth/getCaptcha", async (_, { rejectWithValue }) => {
  try {
    const res = await securityApi.getCaptchaUrl()
    return { captchaUrl: res.data.url }
  } catch (e) {
    return rejectWithValue(null)
  }
})

export const authSlice = slice.reducer
export const authThunks = { login, logOut, initializeApp, getCaptcha }
export type CaptchaArgType = {
  captchaUrl: string
}
