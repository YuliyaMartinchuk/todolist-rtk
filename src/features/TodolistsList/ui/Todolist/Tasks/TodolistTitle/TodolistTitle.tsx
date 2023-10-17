import React, { useCallback } from "react"
import { EditableSpan } from "common/components"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { useActions } from "common/hooks/useActions"
import { TodolistDomainType, todolistsThunks } from "features/TodolistsList/model/todolists/todolistsSlice"

export type Props = {
  todolist: TodolistDomainType
}

export const TodolistTitle: React.FC<Props> = ({ todolist }) => {
  const { id, entityStatus, title } = todolist
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)
  const removeTodolistHandler = () => removeTodolist(id)
  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle({ todolistId: id, title: title })
    },
    [todolist.id]
  )
  return (
    <h3>
      <EditableSpan oldTitle={title} callBack={changeTodolistTitleHandler} />
      <IconButton aria-label="delete" disabled={entityStatus === "loading"} onClick={removeTodolistHandler}>
        <DeleteIcon />
      </IconButton>
    </h3>
  )
}
