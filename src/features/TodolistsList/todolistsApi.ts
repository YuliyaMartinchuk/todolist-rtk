import { BaseResponse } from "common/types"
import { AxiosResponse } from "axios"
import { TodolistType } from "features/TodolistsList/Todolist/todolistsApi.types"
import { instance } from "common/api"

export const todolistsApi = {
  getTodolist() {
    return instance.get<TodolistType[]>(`todo-lists`)
  },
  createTodoLists(title: string) {
    return instance.post<
      BaseResponse<{ item: TodolistType }>,
      AxiosResponse<BaseResponse<{ item: TodolistType }>>,
      { title: string }
    >("todo-lists", { title })
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<BaseResponse>(`todo-lists/${todolistId}`)
  },
  updateTodolist(todolistId: string, title: string) {
    return instance.put<BaseResponse, AxiosResponse<BaseResponse>, { title: string }>(`todo-lists/${todolistId}`, {
      title,
    })
  },
}
