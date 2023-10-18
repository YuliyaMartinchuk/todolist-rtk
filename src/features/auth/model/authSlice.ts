import { createSlice } from "@reduxjs/toolkit"
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
      (action) => {
        if (
          action.type === "auth/login/fulfilled" ||
          action.type === "auth/logout/fulfilled" ||
          action.type === "app/initializeApp/fulfilled"
        ) {
          return true
        } else {
          return false
        }
      },
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
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.login(arg)
      if (res.data.resultCode === Result_Code.OK) {
        return { isLoggedIn: true }
      } else {
        const isShowAppError = !res.data.fieldsErrors.length
        handleServerAppError(dispatch, res.data, isShowAppError)
        return rejectWithValue(res.data)
      }
    })
  }
)

const logOut = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
  const res = await authAPI.logOut()
  const { dispatch, rejectWithValue } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(clearTasksAndTodolists())
      return { isLoggedIn: false }
    } else {
      handleServerAppError(dispatch, res.data)
      return rejectWithValue(null)
    }
  })
})

export const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/initializeApp",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.me()
      if (res.data.resultCode === Result_Code.OK) {
        return { isLoggedIn: true }
      } else {
        return rejectWithValue(null)
      }
    }).finally(() => {
      dispatch(appActions.setInitialized({ isInitialized: true }))
    })
  }
)

export const authSlice = slice.reducer
export const authThunks = { login, logOut, initializeApp }
