import React from "react"
import { TaskStatuses } from "common/enums"
import { Task } from "features/TodolistsList/todolists/ui/Todolist/Tasks/Task"
import { TodolistDomainType } from "features/TodolistsList/todolists/model/todolistsSlice"
import { TaskDomainType } from "features/TodolistsList/tasks/api/tasksApi.types"

type Props = {
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
