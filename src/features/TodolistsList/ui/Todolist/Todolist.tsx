import React, { memo, useCallback, useEffect } from "react"
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolistsSlice"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice"
import { AddItemForm } from "common/components"
import { useActions } from "common/hooks/useActions"
import { Tasks } from "features/TodolistsList/ui/Todolist/Tasks/Tasks"
import { FilterTasksButtons } from "features/TodolistsList/ui/Todolist/FilterTasksButtons/FilterTasksButtons"
import { TodolistTitle } from "features/TodolistsList/ui/Todolist/Tasks/TodolistTitle/TodolistTitle"
import { TaskDomainType } from "features/TodolistsList/api/tasksApi.types"

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
      createTask({ todolistId: todolist.id, title }).unwrap()
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
