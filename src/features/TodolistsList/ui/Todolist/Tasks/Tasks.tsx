import React from "react"
import { TaskStatuses } from "common/enums"
import { Task } from "features/TodolistsList/ui/Todolist/Tasks/Task/Task"
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolistsSlice"
import { TaskDomainType } from "features/TodolistsList/api/tasksApi.types"

export type Props = {
  tasks: TaskDomainType[]
  todolist: TodolistDomainType
}

export const Tasks: React.FC<Props> = ({ tasks, todolist }) => {
  let tasksForTodolist = tasks

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <>
      {tasksForTodolist?.map((t) => (
        <Task key={t.id} task={t} todolistId={todolist.id} />
      ))}
    </>
  )
}
