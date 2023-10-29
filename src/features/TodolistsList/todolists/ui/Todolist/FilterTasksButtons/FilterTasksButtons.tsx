import React, { FC, memo } from "react"

import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
} from "features/TodolistsList/todolists/model/todolistsSlice"
import { useActions } from "common/hooks/useActions/useActions"
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

const ButtonWithMemo = memo((props: ButtonProps) => {
  return (
    <Button variant={props.variant} color={props.color} onClick={props.onClick}>
      {props.title}
    </Button>
  )
})
