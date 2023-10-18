import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

const slice = createSlice({
  name: "app",
  initialState: {
    isInitialized: false,
    status: "loading" as RequestStatusType,
    error: null as string | null,
  },
  reducers: {
    setError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => {
          return action.type.endsWith("/pending")
        },
        (state, action) => {
          state.status = "loading"
        }
      )
      .addMatcher(
        (action) => {
          return action.type.endsWith("/fulfilled")
        },
        (state, action) => {
          state.status = "succeeded"
        }
      )
      .addMatcher(
        (action) => {
          return action.type.endsWith("/rejected")
        },
        (state, action) => {
          state.status = "failed"
        }
      )
  },
})

export const appSlice = slice.reducer
export const appActions = slice.actions
