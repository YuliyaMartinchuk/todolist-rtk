import React, { memo, useCallback, useEffect } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsThunks,
} from "features/TodolistsList/model/todolists/todolistsSlice"
import { RequestStatusType } from "app/model/appSlice"
import { TaskDomainType } from "features/TodolistsList/TodolistsList"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice"
import { AddItemForm, EditableSpan } from "common/components"
import { useActions } from "common/hooks/useActions"
import { Tasks } from "features/TodolistsList/ui/Todolist/Tasks/Tasks"
import { FilterTasksButtons } from "features/TodolistsList/ui/Todolist/FilterTasksButtons/FilterTasksButtons"

type Props = {
  todolist: TodolistDomainType
  title: string
  tasks: TaskDomainType[]
  entityStatus: RequestStatusType
  filter: FilterValuesType
}

export const Todolist: React.FC<Props> = memo(({ todolist, title, tasks, entityStatus, filter }) => {
  const { getTask, createTask } = useActions(tasksThunks)
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)

  useEffect(() => {
    getTask(todolist.id)
  }, [])

  const removeTodolistHandler = () => removeTodolist(todolist.id)

  const addTaskCallBack = useCallback(
    (title: string) => {
      createTask({ todolistId: todolist.id, title }).unwrap()
    },
    [todolist.id]
  )
  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle({ todolistId: todolist.id, title: title })
    },
    [todolist.id]
  )

  return (
    <div>
      <h3>
        <EditableSpan oldTitle={title} callBack={changeTodolistTitleHandler} />
        <IconButton aria-label="delete" disabled={entityStatus === "loading"} onClick={removeTodolistHandler}>
          <DeleteIcon />
        </IconButton>
      </h3>
      <div>
        <AddItemForm disabled={entityStatus === "loading"} callBack={addTaskCallBack} />
      </div>
      <div>
        <Tasks tasks={tasks} todolist={todolist} />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  )
})
