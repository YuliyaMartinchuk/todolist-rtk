import React, { FC, memo } from "react"

import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
} from "features/TodolistsList/model/todolists/todolistsSlice"
import { useActions } from "common/hooks/useActions"
import Button, { ButtonProps } from "@mui/material/Button"

type Props = {
  todolist: TodolistDomainType
}

export const FilterTasksButtons: FC<Props> = ({ todolist }) => {
  const { changeTodolistFilter } = useActions(todolistsActions)
  const changeTodolistFilterHandler = (filter: FilterValuesType) => {
    changeTodolistFilter({ todolistId: todolist.id, filter })
  }

  return (
    <div>
      <div style={{ paddingTop: "10px" }}>
        <ButtonWithMemo
          title={"All"}
          variant={todolist.filter === "all" ? "outlined" : "contained"}
          color={"success"}
          onClick={() => changeTodolistFilterHandler("all")}
        />
        <ButtonWithMemo
          title={"Active"}
          variant={todolist.filter === "active" ? "outlined" : "contained"}
          color={"secondary"}
          onClick={() => changeTodolistFilterHandler("active")}
        />
        <ButtonWithMemo
          title={"Completed"}
          variant={todolist.filter === "completed" ? "outlined" : "contained"}
          color={"error"}
          onClick={() => changeTodolistFilterHandler("completed")}
        />
      </div>
    </div>
  )
}

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
