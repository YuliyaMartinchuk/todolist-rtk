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
    setStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      //return { ...state, status: action.payload.status };
      state.status = action.payload.status
    },
    setError: (state, action: PayloadAction<{ error: string | null }>) => {
      //return { ...state, error: action.payload.error }
      state.error = action.payload.error
    },
    setInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
})

export const appReducer = slice.reducer
export const appActions = slice.actions
