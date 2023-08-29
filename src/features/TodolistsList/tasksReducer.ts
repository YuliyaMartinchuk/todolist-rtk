import { TaskType, TodolistApi, UpdateDomainTaskModelType, UpdateTaskModelType } from "api/todolist-api"
import { Dispatch } from "redux"
import { AppRootStateType } from "app/store"
import { appActions, RequestStatusType } from "app/appReducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import axios from "axios"
import { AssocTaskType } from "features/TodolistsList/TodolistsList"
import { todolistsActions } from "features/TodolistsList/todolistsReducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/commonActions"
import { createAppAsyncThunk } from "utils/createAsyncThunk"

const slice = createSlice({
  name: "tasks",
  initialState: {} as AssocTaskType,
  reducers: {
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      // return { ...state, [action.payload.task.todoListId]: [{ ...action.payload.task, entityStatus: "idle" }, ...state[action.payload.task.todoListId],],};
      const tasksForCurrentTodolist = state[action.payload.task.todoListId]
      tasksForCurrentTodolist.unshift(
        { ...action.payload.task, entityStatus: "idle" },
        ...state[action.payload.task.todoListId]
      )
    },
    removeTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
      //return { ...state, [action.payload.todolistId]: state[action.payload.todolistId].filter((el) => el.id !== action.payload.taskId), }
      const tasksForTodolist = state[action.payload.todolistId]
      const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) tasksForTodolist.splice(index, 1)
    },
    updateTask: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; model: UpdateDomainTaskModelType }>
    ) => {
      //return { ...state, [action.payload.todolistId]: state[action.payload.todolistId].map((el) => el.id === action.payload.taskId ? { ...el, ...action.payload.model } : el), }
      const tasksForTodolist = state[action.payload.todolistId]
      const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1) tasksForTodolist[index] = { ...tasksForTodolist[index], ...action.payload.model }
    },
    // setTask: (state, action: PayloadAction<{ todolistId: string; tasks: TaskType[] }>) => {
    //   //return { ...state, [action.payload.todolistId]: action.payload.tasks.map((t: any) => ({ ...t, entityStatus: "idle" })), }
    //   action.payload.tasks.forEach((task) => {
    //     state[action.payload.todolistId].push({ ...task, entityStatus: "idle" })
    //   })
    // },
    changeEntityTaskStatus: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; entityStatus: RequestStatusType }>
    ) => {
      //return { ...state, [action.payload.todolistId]: state[action.payload.todolistId].map((el) => el.id === action.payload.taskId ? { ...el, entityStatus: action.payload.entityStatus } : el), }
      const tasksForTodolist = state[action.payload.todolistId]
      const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1)
        tasksForTodolist[index] = { ...tasksForTodolist[index], entityStatus: action.payload.entityStatus }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTask.fulfilled, (state, action) => {
        action.payload.tasks.forEach((task) => {
          state[action.payload.todolistId].push({ ...task, entityStatus: "idle" })
        })
      })
      .addCase(todolistsActions.addTodolistst, (state, action) => {
        //return { ...state, [action.payload.todolist.id]: [] };
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        //let copyState = { ...state };
        //       delete copyState[action.payload.todolistId];
        //       return copyState;
        delete state[action.payload.todolistId]
      })
      .addCase(todolistsActions.setTodolistst, (state, action) => {
        //const stateCopy = { ...state }
        //       action.payload.todolist.forEach((tl: any) => {
        //         stateCopy[tl.id] = []
        action.payload.todolist.forEach((todo) => {
          state[todo.id] = []
        })
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return {}
      })
  },
})

const getTask = createAppAsyncThunk<{ todolistId: string; tasks: TaskType[] }, string>(
  "tasks/getTask",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    try {
      dispatch(appActions.setStatus({ status: "loading" }))
      const res = await TodolistApi.getTasks(todolistId)
      const tasks = res.data.items
      dispatch(appActions.setStatus({ status: "succeeded" }))
      return { todolistId, tasks }
    } catch (e) {
      if (axios.isAxiosError<ErrorType>(e)) {
        const error = e.response ? e.response?.data.messages[0].message : e.message
        handleServerNetworkError(dispatch, error)
        return rejectWithValue(null)
      }
      const error = (e as Error).message
      handleServerNetworkError(dispatch, error)
      return rejectWithValue(null)
    }
  }
)

export const deleteTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  dispatch(tasksActions.changeEntityTaskStatus({ todolistId, taskId, entityStatus: "loading" }))
  try {
    const res = await TodolistApi.deleteTasks(todolistId, taskId)
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(tasksActions.removeTask({ todolistId, taskId }))
      dispatch(appActions.setStatus({ status: "succeeded" }))
    } else {
      handleServerAppError(dispatch, res.data)
    }
  } catch (e) {
    if (axios.isAxiosError<ErrorType>(e)) {
      const error = e.response ? e.response?.data.messages[0].message : e.message
      handleServerNetworkError(dispatch, error)
      dispatch(tasksActions.changeEntityTaskStatus({ todolistId, taskId, entityStatus: "idle" }))
      return
    }
    const error = (e as Error).message
    handleServerNetworkError(dispatch, error)
    dispatch(tasksActions.changeEntityTaskStatus({ todolistId, taskId, entityStatus: "idle" }))
  }
}

export const createTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }))
  try {
    const res = await TodolistApi.createTasks(todolistId, title)
    if (res.data.resultCode === Result_Code.OK) {
      dispatch(tasksActions.addTask({ task: res.data.data.item }))
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

export const updateTaskTC =
  (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
  async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(appActions.setStatus({ status: "loading" }))
    const task = getState().tasks[todolistId].find((t) => t.id === taskId)

    if (task) {
      const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...domainModel,
      }

      try {
        const res = await TodolistApi.updateTasks(todolistId, taskId, apiModel)
        if (res.data.resultCode === Result_Code.OK) {
          dispatch(tasksActions.updateTask({ todolistId, taskId, model: domainModel }))
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
  }

export enum Result_Code {
  OK = 0,
  ERROR = 1,
  CAPTCHA_ERROR = 10,
}

export type ErrorType = {
  statusCode: number
  messages: [
    {
      message: string
      field: string
    }
  ]
  error: string
}

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { getTask }
