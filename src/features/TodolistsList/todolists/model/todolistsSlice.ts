import { RequestStatusType } from "app/model/appSlice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Result_Code } from "common/enums"
import { todolistsApi } from "features/TodolistsList/todolists/api/todolistsApi"
import { TodolistType, UpdateTodolistTitleArgType } from "features/TodolistsList/todolists/api/todolistsApi.types"
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
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
        if (index !== -1) state[index].title = action.payload.title
      })
  },
})

export const getTodolistst = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
  "todolists/getTodolistst",
  async (_) => {
    const res = await todolistsApi.getTodolist()
    return { todolists: res.data }
  }
)

export const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  "todolists/removeTodolist",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: "loading" }))
    const res = await todolistsApi.deleteTodolist(todolistId)
    if (res.data.resultCode === Result_Code.OK) {
      return { todolistId }
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true })
    }
  }
)

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todolists/addTodolistst",
  async (newTitle, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const res = await todolistsApi.createTodoLists(newTitle)
    if (res.data.resultCode === Result_Code.OK) {
      return { todolist: res.data.data.item }
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false })
    }
  }
)

export const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
  "todolists/changeTodolistTitle",
  async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const res = await todolistsApi.updateTodolist(arg)
    if (res.data.resultCode === Result_Code.OK) {
      return arg
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true })
    }
  }
)

export const todolistsSlice = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {
  getTodolistst,
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
}
