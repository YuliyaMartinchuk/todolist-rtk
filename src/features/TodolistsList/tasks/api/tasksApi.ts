import { BaseResponseType } from "common/types"
import { AxiosResponse } from "axios"
import {
  AddTaskArg,
  GetTaskBaseResponseType,
  RemoveTaskArg,
  TaskType,
  UpdateTaskModelType,
} from "features/TodolistsList/tasks/api/tasksApi.types"
import { instance } from "common/api"

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTaskBaseResponseType>(`todo-lists/${todolistId}/tasks`)
  },
  createTasks(arg: AddTaskArg) {
    return instance.post<
      BaseResponseType<{ item: TaskType }>,
      AxiosResponse<BaseResponseType<{ item: TaskType }>>,
      { title: string }
    >(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title })
  },
  deleteTasks(arg: RemoveTaskArg) {
    return instance.delete<BaseResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
  },
  updateTasks(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<
      BaseResponseType<{ item: TaskType }>,
      AxiosResponse<BaseResponseType<{ item: TaskType }>>,
      UpdateTaskModelType
    >(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}
