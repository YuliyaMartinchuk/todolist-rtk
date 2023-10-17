import React, { ChangeEvent, memo } from "react"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import { EditableSpan } from "common/components"
import { TaskStatuses } from "common/enums"
import { useActions } from "common/hooks/useActions"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasksSlice"
import s from "./Task.module.css"
import { TaskDomainType } from "features/TodolistsList/api/tasksApi.types"

export type Props = {
  task: TaskDomainType
  todolistId: string
}

export const Task: React.FC<Props> = memo(({ task, todolistId }) => {
  const { removeTask, updateTask } = useActions(tasksThunks)

  const removeTaskHandler = () => removeTask({ todolistId: todolistId, taskId: task.id })

  const сhangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    updateTask({ todolistId: todolistId, taskId: task.id, domainModel: { status } })
  }

  const changeTitleHandler = (title: string) => {
    updateTask({ todolistId: todolistId, taskId: task.id, domainModel: { title } })
  }

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
      <Checkbox onChange={сhangeStatusHandler} checked={task.status === TaskStatuses.Completed} />
      <EditableSpan oldTitle={task.title} callBack={changeTitleHandler} />
      <IconButton aria-label="delete" disabled={task.entityStatus === "loading"} onClick={removeTaskHandler}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
})
