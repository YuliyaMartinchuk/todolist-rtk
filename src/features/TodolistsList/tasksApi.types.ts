import { TaskPriorities, TaskStatuses } from "common/enums"

export type AddTaskArg = {
  todolistId: string
  title: string
}

export type UpdateTaskArg = {
  todolistId: string
  taskId: string
  domainModel: UpdateDomainTaskModelType
}

export type GetTaskBaseResponse = {
  totalCount: number
  error: string | null
  items: TaskType[]
}

export type UpdateTaskModelType = {
  title: string
  description: string
  status?: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}

export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
