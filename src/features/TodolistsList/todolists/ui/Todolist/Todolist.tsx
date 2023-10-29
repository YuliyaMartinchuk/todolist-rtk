import React, { memo, useCallback, useEffect } from "react"
import { TodolistDomainType } from "features/TodolistsList/todolists/model/todolistsSlice"
import { tasksThunks } from "features/TodolistsList/tasks/model/tasksSlice"
import { AddItemForm } from "common/components"
import { useActions } from "common/hooks/useActions"
import { Tasks } from "features/TodolistsList/todolists/ui/Todolist/Tasks"
import { FilterTasksButtons } from "features/TodolistsList/todolists/ui/Todolist/FilterTasksButtons"
import { TodolistTitle } from "features/TodolistsList/todolists/ui/Todolist/TodolistTitle"
import { TaskDomainType } from "features/TodolistsList/tasks/api"

type Props = {
  todolist: TodolistDomainType
  tasks: TaskDomainType[]
}

export const Todolist: React.FC<Props> = memo(({ todolist, tasks }) => {
  const { getTask, createTask } = useActions(tasksThunks)

  useEffect(() => {
    getTask(todolist.id)
  }, [])

  const addTaskCallBack = useCallback(
    (title: string) => {
      return createTask({ todolistId: todolist.id, title }).unwrap()
    },
    [todolist.id]
  )

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm disabled={todolist.entityStatus === "loading"} callBack={addTaskCallBack} />
      <Tasks tasks={tasks} todolist={todolist} />
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  )
})
