import { AnyAction, createSlice, isAnyOf, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit"
import { todolistsThunks } from "features/TodolistsList/model/todolists/todolistsSlice"

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

const slice = createSlice({
  name: "app",
  initialState: {
    isInitialized: false,
    status: "idle" as RequestStatusType,
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
      .addMatcher(isPending, (state) => {
        state.status = "loading"
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = "succeeded"
      })
      .addMatcher(isRejected, (state, action: AnyAction) => {
        state.status = "failed"
        if (isAnyOf(todolistsThunks.addTodolist.rejected)) return

        if (action.payload) {
          state.error = action.payload.messages[0]
        } else {
          state.error = action.error.message ? action.error.message : "Some error occurred"
        }
      })
  },
})

export const appSlice = slice.reducer
export const appActions = slice.actions
