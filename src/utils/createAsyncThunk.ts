import { AppDispatchType, AppRootStateType } from "app/store"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType
  dispatch: AppDispatchType
  rejectValue: null
}>()
