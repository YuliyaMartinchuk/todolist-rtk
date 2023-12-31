import { appActions, RequestStatusType } from "app/model/appSlice"
import { todolistsThunks } from "features/TodolistsList/todolists/model/todolistsSlice"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "common/utils"
import { Result_Code } from "common/enums"
import { tasksApi } from "features/TodolistsList/tasks/api/tasksApi"
import {
  AddTaskArg,
  AssocTaskType,
  RemoveTaskArg,
  TaskDomainType,
  TaskType,
  UpdateTaskArg,
  UpdateTaskModelType,
} from "features/TodolistsList/tasks/api/tasksApi.types"
import { clearTasksAndTodolists } from "common/actions"

const slice = createSlice({
  name: "tasks",
  initialState: {} as AssocTaskType,
  reducers: {
    changeEntityTaskStatus: (
      state,
      action: PayloadAction<{ todolistId: string; taskId: string; entityStatus: RequestStatusType }>
    ) => {
      const tasksForTodolist = state[action.payload.todolistId]
      const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId)
      if (index !== -1)
        tasksForTodolist[index] = {
          ...tasksForTodolist[index],
          entityStatus: action.payload.entityStatus,
        }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTask.fulfilled, (state, action) => {
        action.payload.tasks.forEach((task) => {
          state[action.payload.todolistId].push({
            ...task,
            entityStatus: "idle",
          })
        })
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const tasksForCurrentTodolist = state[action.payload.task.todoListId]
        tasksForCurrentTodolist.unshift({
          ...action.payload.task,
          entityStatus: "idle",
        })
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasksForTodolist = state[action.payload.todolistId]
        const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) tasksForTodolist[index] = { ...tasksForTodolist[index], ...action.payload.domainModel }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasksForTodolist = state[action.payload.todolistId]
        const index = tasksForTodolist.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) tasksForTodolist.splice(index, 1)
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(todolistsThunks.getTodolistst.fulfilled, (state, action) => {
        action.payload.todolists.forEach((todo) => {
          state[todo.id] = []
        })
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return {}
      })
  },
})

const getTask = createAppAsyncThunk<{ todolistId: string; tasks: TaskType[] }, string>(
  "tasks/getTasks",
  async (todolistId) => {
    const res = await tasksApi.getTasks(todolistId)
    const tasks = res.data.items
    return { todolistId, tasks }
  }
)

const createTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArg>("tasks/createTask", async (arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  const res = await tasksApi.createTasks(arg)
  if (res.data.resultCode === Result_Code.OK) {
    const task = res.data.data.item
    return { task }
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: false })
  }
})

export const removeTask = createAppAsyncThunk<RemoveTaskArg, RemoveTaskArg>(
  "tasks/deleteTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    dispatch(
      tasksActions.changeEntityTaskStatus({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        entityStatus: "loading",
      })
    )
    const res = await tasksApi.deleteTasks(arg)
    if (res.data.resultCode === Result_Code.OK) {
      return arg
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true })
    }
  }
)

const updateTask = createAppAsyncThunk<UpdateTaskArg, UpdateTaskArg>("tasks/updateTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI
  const task = getState().tasks[arg.todolistId].find((t: TaskDomainType) => t.id === arg.taskId)
  if (!task) {
    dispatch(appActions.setError({ error: "Task not found in the state" }))
    return rejectWithValue(null)
  }
  const apiModel: UpdateTaskModelType = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    deadline: task.deadline,
    ...arg.domainModel,
  }
  const res = await tasksApi.updateTasks(arg.todolistId, arg.taskId, apiModel)
  if (res.data.resultCode === Result_Code.OK) {
    return arg
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: true })
  }
})

export const tasksSlice = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { getTask, createTask, updateTask, removeTask }
