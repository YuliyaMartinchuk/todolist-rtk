import { BaseResponseType } from "common/types"
import { AxiosResponse } from "axios"
import { TodolistType, UpdateTodolistTitleArgType } from "features/TodolistsList/api/todolistsApi.types"
import { instance } from "common/api"

export const todolistsApi = {
  getTodolist() {
    return instance.get<TodolistType[]>(`todo-lists`)
  },
  createTodoLists(title: string) {
    return instance.post<
      BaseResponseType<{ item: TodolistType }>,
      AxiosResponse<BaseResponseType<{ item: TodolistType }>>,
      { title: string }
    >("todo-lists", { title })
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todolistId}`)
  },
  updateTodolist(arg: UpdateTodolistTitleArgType) {
    return instance.put<BaseResponseType, AxiosResponse<BaseResponseType>, { title: string }>(
      `todo-lists/${arg.todolistId}`,
      {
        title: arg.title,
      }
    )
  },
}
