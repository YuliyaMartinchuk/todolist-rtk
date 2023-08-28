import { TodolistApi, TodolistType } from "api/todolist-api"
import { Dispatch } from "redux"
import { appActions, RequestStatusType } from "app/appReducer"
import { ErrorType, Result_Code } from "features/TodolistsList/tasksReducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import axios from "axios"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/commonActions"

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    addTodolistst: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      // return [{ ...action.payload.todolist, filter: "all", entityStatus: "idle" }, ...state]
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    },
    removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
      // return state.filter((el) => el.id !== action.payload.todolistId)
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
      if (index !== -1) state.splice(index, 1)
    },
    changeTodolistTitle: (state, action: PayloadAction<{ todolistId: string; title: string }>) => {
      //return state.map((el) => el.id === action.payload.todolistId ? { ...el, title: action.payload.updateTitle, } : el)
      //1v
      // const todolist = state.find((todo) => todo.id === action.payload.todolistId)
      // if (todolist) {todolist.title = action.payload.updateTitle}
      //2 v
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
      if (index !== -1) state[index].title = action.payload.title
    },
    changeTodolistFilter: (state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) => {
      //return state.map((el) => (el.id === action.payload.todolistId ? { ...el, filter: action.payload.value } : el))
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
      if (index !== -1) state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatus: (
      state,
      action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>
    ) => {
      // return state.map((el) => el.id === action.payload.todolistId ? { ...el, entityStatus: action.payload.entityStatus, } : el)
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus
    },
    setTodolistst: (state, action: PayloadAction<{ todolist: TodolistType[] }>) => {
      //return action.payload.todolist.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
      //1 v
      //return action.payload.todolist.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
      //2v
      action.payload.todolist.forEach((todo) => {
        state.push({ ...todo, filter: "all", entityStatus: "idle" })
      })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearTasksAndTodolists.type, () => {
      return []
    })
  },
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

export const getTodoliststTC = () => async (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  try {
    const res = await TodolistApi.getTodolist()
    dispatch(todolistsActions.setTodolistst({ todolist: res.data }))
    dispatch(appActions.setStatus({ status: "succeeded" }))
  } catch (e) {
    if (axios.isAxiosError<ErrorType>(e)) {
      const error = e.response ? e.response?.data.messages[0].message : e.message
      handleServerNetworkError(dispatch, error)
      return
    }
    const error = (e as Error).message
    handleServerNetworkError(dispatch, error)
  }
}

export const deleteTodolistTC = (todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: "loading" }))
  try {
    const res = await TodolistApi.deleteTodolist(todolistId)
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(todolistsActions.removeTodolist({ todolistId }))
      dispatch(appActions.setStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    if (axios.isAxiosError<ErrorType>(e)) {
      const error = e.response ? e.response?.data.messages[0].message : e.message
      handleServerNetworkError(dispatch, error)
      dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: "idle" }))
      return
    }
    const error = (e as Error).message
    handleServerNetworkError(dispatch, error)
    dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: "idle" }))
  }
}

export const createTodolistTC = (newTitle: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  try {
    const res = await TodolistApi.createTodoLists(newTitle)
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(todolistsActions.addTodolistst({ todolist: res.data.data.item }))
      dispatch(appActions.setStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    if (axios.isAxiosError<ErrorType>(e)) {
      const error = e.response ? e.response?.data.messages[0].message : e.message
      handleServerNetworkError(dispatch, error)
      return
    }
    const error = (e as Error).message
    handleServerNetworkError(dispatch, error)
  }
}

export const changeTodolistTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  try {
    const res = await TodolistApi.updateTodolist(todolistId, title)
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(todolistsActions.changeTodolistTitle({ todolistId, title }))
      dispatch(appActions.setStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    if (axios.isAxiosError<ErrorType>(e)) {
      const error = e.response ? e.response?.data.messages[0].message : e.message
      handleServerNetworkError(dispatch, error)
      return
    }
    const error = (e as Error).message
    handleServerNetworkError(dispatch, error)
  }
}