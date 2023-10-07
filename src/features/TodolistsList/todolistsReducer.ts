import { Dispatch } from "redux"
import { appActions, RequestStatusType } from "app/appReducer"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { Result_Code } from "common/enums"
import { todolistsApi } from "features/TodolistsList/todolistsApi"
import { TodolistType } from "features/TodolistsList/Todolist/todolistsApi.types"
import { clearTasksAndTodolists } from "common/actions"
import { createAppAsyncThunk } from "common/utils"

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistTitle: (state, action: PayloadAction<{ todolistId: string; title: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
      if (index !== -1) state[index].title = action.payload.title
    },
    changeTodolistFilter: (state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
      if (index !== -1) state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus: (
      state,
      action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>
    ) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodolistst.fulfilled, (state, action) => {
        action.payload.todolists.forEach((todo) => {
          state.push({ ...todo, filter: "all", entityStatus: "idle" })
        })
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
        if (index !== -1) state.splice(index, 1)
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return []
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      })
  },
})

export const getTodolistst = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  "todolists/getTodolistst",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setStatus({ status: "loading" }))
      const res = await todolistsApi.getTodolist()
      dispatch(appActions.setStatus({ status: "succeeded" }))
      return { todolists: res.data }
    } catch (e) {
      handleServerNetworkError(dispatch, e)
      return rejectWithValue(null)
    }
  }
)

export const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  "todolists/removeTodolist",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      const res = await todolistsApi.deleteTodolist(todolistId)
      if (res.data.resultCode === Result_Code.OK) {
        dispatch(appActions.setStatus({ status: "succeeded" }))
        return { todolistId }
      } else {
        handleServerAppError(dispatch, res.data)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(dispatch, e)
      dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: "idle" }))
      return rejectWithValue(null)
    }
  }
)

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todolists/addTodolistst",
  async (newTitle, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      const res = await todolistsApi.createTodoLists(newTitle)
      if (res.data.resultCode === Result_Code.OK) {
        dispatch(appActions.setStatus({ status: "succeeded" }))
        return { todolist: res.data.data.item }
      } else {
        handleServerAppError(dispatch, res.data)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(dispatch, e)
      return rejectWithValue(null)
    }
  }
)

export const changeTodolistTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  try {
    const res = await todolistsApi.updateTodolist(todolistId, title)
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(todolistsActions.changeTodolistTitle({ todolistId, title }))
      dispatch(appActions.setStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    handleServerNetworkError(dispatch, e)
  }
}

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = { getTodolistst, removeTodolist, addTodolist }
