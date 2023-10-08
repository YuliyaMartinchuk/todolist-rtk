import { AppDispatch, AppRootState } from "app/store"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BaseResponseType } from "common/types"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootState
  dispatch: AppDispatch
  rejectValue: null | BaseResponseType
}>()
