import React, { useCallback, useEffect } from "react"
import "app/ui/App.css"
import { Todolist } from "features/TodolistsList/todolists/ui/Todolist"
import { Grid, Paper } from "@mui/material"
import { todolistsThunks } from "features/TodolistsList/todolists/model/todolistsSlice"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { selectTasks } from "features/TodolistsList/tasks/model/tasksSelector"
import { selectTodolists } from "features/TodolistsList/todolists/model/todolistsSelector"
import { selectIsLoggedIn } from "features/auth/model/authSelector"
import { AddItemForm } from "common/components"
import { useActions } from "common/hooks/useActions"

export const TodolistsList: React.FC = () => {
  const todolists = useSelector(selectTodolists)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const { getTodolistst, addTodolist } = useActions(todolistsThunks)

  useEffect(() => {
    if (!isLoggedIn) return
    getTodolistst()
  }, [])

  const addTodolistCallback = useCallback((newTitle: string) => {
    return addTodolist(newTitle).unwrap()
  }, [])

  if (!isLoggedIn) return <Navigate to={"/login"} />

  return (
    <>
      <Grid container style={{ padding: "10px" }}>
        <AddItemForm callBack={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper elevation={5} style={{ padding: "10px" }}>
                <Todolist todolist={tl} tasks={tasks[tl.id]} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
