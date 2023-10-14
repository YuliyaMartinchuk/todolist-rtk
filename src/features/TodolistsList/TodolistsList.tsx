import React, { useCallback, useEffect } from "react"
import "app/ui/App.css"
import { Todolist } from "features/TodolistsList/ui/Todolist/Todolist"
import { Grid, Paper } from "@mui/material"
import { todolistsThunks } from "features/TodolistsList/model/todolists/todolistsSlice"
import { useSelector } from "react-redux"
import { useAppDispatch } from "app/store"
import { RequestStatusType } from "app/model/appSlice"
import { Navigate } from "react-router-dom"
import { selectTasks } from "features/TodolistsList/model/tasks/tasksSelector"
import { selectTodolists } from "features/TodolistsList/model/todolists/todolistsSelector"
import { selectIsLoggedIn } from "features/auth/model/authSelector"
import { AddItemForm } from "common/components"
import { TaskType } from "features/TodolistsList/api/tasksApi.types"
import { useActions } from "common/hooks/useActions"

export type AssocTaskType = {
  [key: string]: TaskDomainType[]
}

export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType
}

export const TodolistsList: React.FC = () => {
  const todolists = useSelector(selectTodolists)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  const { getTodolistst, addTodolist } = useActions(todolistsThunks)

  useEffect(() => {
    if (!isLoggedIn) return
    getTodolistst()
  }, [])

  const addTodolists = useCallback(
    (newTitle: string) => {
      addTodolist(newTitle)
    },
    [dispatch]
  )

  if (!isLoggedIn) return <Navigate to={"/login"} />

  return (
    <>
      <Grid container style={{ padding: "10px" }}>
        <AddItemForm callBack={addTodolists} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper elevation={5} style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  title={tl.title}
                  tasks={tasks[tl.id]}
                  filter={tl.filter}
                  entityStatus={tl.entityStatus}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
