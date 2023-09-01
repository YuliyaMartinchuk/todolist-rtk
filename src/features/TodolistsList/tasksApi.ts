import { BaseResponse } from "common/types"
import { AxiosResponse } from "axios"
import { AddTaskArg, GetTaskBaseResponse, TaskType, UpdateTaskModelType } from "features/TodolistsList/tasksApi.types"
import { instance } from "common/api"

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTaskBaseResponse>(`todo-lists/${todolistId}/tasks`)
  },
  createTasks(arg: AddTaskArg) {
    return instance.post<
      BaseResponse<{ item: TaskType }>,
      AxiosResponse<BaseResponse<{ item: TaskType }>>,
      { title: string }
    >(`todo-lists/${arg.todolistId}/tasks`, { title: arg.title })
  },
  deleteTasks(todolistId: string, taskId: string) {
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  updateTasks(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<
      BaseResponse<{ item: TaskType }>,
      AxiosResponse<BaseResponse<{ item: TaskType }>>,
      UpdateTaskModelType
    >(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}