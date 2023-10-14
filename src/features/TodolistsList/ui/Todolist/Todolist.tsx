import React, { memo, useCallback, useEffect } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import Button, { ButtonProps } from "@mui/material/Button"
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistsList/model/todolists/todolistsSlice"
import { RequestStatusType } from "app/model/appSlice"
import { TaskDomainType } from "features/TodolistsList/TodolistsList"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice"
import { AddItemForm, EditableSpan } from "common/components"
import { useActions } from "common/hooks/useActions"
import { Tasks } from "features/TodolistsList/ui/Todolist/Tasks/Tasks"

type Props = {
  todolist: TodolistDomainType
  title: string
  tasks: TaskDomainType[]
  entityStatus: RequestStatusType
  filter: FilterValuesType
}

export const Todolist: React.FC<Props> = memo(({ todolist, title, tasks, entityStatus, filter }) => {
  const { getTask, createTask } = useActions(tasksThunks)
  const { changeTodolistFilter } = useActions(todolistsActions)
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)

  useEffect(() => {
    getTask(todolist.id)
  }, [])

  const removeTodolistHandler = () => removeTodolist(todolist.id)

  const onAllClickHandler = useCallback(
    () => changeTodolistFilter({ todolistId: todolist.id, filter: "all" }),
    [todolist.id, changeTodolistFilter]
  )
  const onActiveClickHandler = useCallback(
    () => changeTodolistFilter({ todolistId: todolist.id, filter: "active" }),
    [todolist.id]
  )
  const onCompletedClickHandler = useCallback(
    () => changeTodolistFilter({ todolistId: todolist.id, filter: "completed" }),
    [todolist.id]
  )

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
        <ButtonWithMemo
          title={"All"}
          variant={filter === "all" ? "outlined" : "contained"}
          color={"success"}
          onClick={onAllClickHandler}
        />
        <ButtonWithMemo
          title={"Active"}
          variant={filter === "active" ? "outlined" : "contained"}
          color={"secondary"}
          onClick={onActiveClickHandler}
        />
        <ButtonWithMemo
          title={"Completed"}
          variant={filter === "completed" ? "outlined" : "contained"}
          color={"error"}
          onClick={onCompletedClickHandler}
        />
      </div>
    </div>
  )
})

type ButtonWithMemoPropsType = {
  title: string
  variant: "text" | "outlined" | "contained"
  color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
  onClick: () => void
}

const ButtonWithMemo = memo((props: ButtonProps) => {
  return (
    <Button variant={props.variant} color={props.color} onClick={props.onClick}>
      {props.title}
    </Button>
  )
})
