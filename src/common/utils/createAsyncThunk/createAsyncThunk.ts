import { AppDispatch, AppRootState } from "app/model/store"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { BaseResponseType } from "common/types"

/**
 * Creates an async thunk with specific types for the application, using `createAsyncThunk` utility function.
 *
 * @template AppRootState - The type of the root state of the application.
 * @template AppDispatch - The type of the dispatch function from Redux to update the state.
 *
 * @returns {AsyncThunk} An instance of the created async thunk with specified types.
 */

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootState
  dispatch: AppDispatch
  rejectValue: null | RejectValueType
}>()

export type RejectValueType = {
  data: BaseResponseType
  showGlobalError: boolean
}
