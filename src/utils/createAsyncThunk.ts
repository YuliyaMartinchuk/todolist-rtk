import { AppDispatch, AppRootState } from "app/store"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootState
  dispatch: AppDispatch
  rejectValue: null
}>()
