import React, { useCallback, useEffect } from "react"
import "app/App.css"
import { Todolist } from "features/TodolistsList/Todolist/Todolist"
import { Grid, Paper } from "@mui/material"
import { tasksThunks } from "features/TodolistsList/tasksReducer"
import {
  changeTodolistTC,
  createTodolistTC,
  deleteTodolistTC,
  FilterValuesType,
  getTodoliststTC,
  todolistsActions,
} from "features/TodolistsList/todolistsReducer"
import { useSelector } from "react-redux"
import { useAppDispatch } from "app/store"
import { RequestStatusType } from "app/appReducer"
import { Navigate } from "react-router-dom"
import { selectTasks } from "features/TodolistsList/tasksSelector"
import { selectTodolists } from "features/TodolistsList/todolistsSelector"
import { selectIsLoggedIn } from "features/Login/authSelector"
import { AddItemForm } from "common/components"
import { TaskStatuses } from "common/enums"
import { TaskType } from "features/TodolistsList/tasksApi.types"

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

  useEffect(() => {
    if (!isLoggedIn) return
    dispatch(getTodoliststTC())
  }, [])

  const removeTask = useCallback(
    (todolistId: string, taskId: string) => {
      dispatch(tasksThunks.deleteTask({ todolistId, taskId }))
    },
    [dispatch]
  )

  const changeStatus = useCallback(
    (todolistId: string, taskId: string, status: TaskStatuses) => {
      dispatch(tasksThunks.updateTask({ todolistId, taskId, domainModel: { status } }))
    },
    [dispatch]
  )

  const changeFilter = useCallback(
    (todolistId: string, filter: FilterValuesType) => {
      dispatch(todolistsActions.changeTodolistFilter({ todolistId, filter }))
    },
    [dispatch]
  )

  const removeTodolist = useCallback(
    (todolistId: string) => {
      dispatch(deleteTodolistTC(todolistId))
    },
    [dispatch]
  )

  const addTask = useCallback(
    (todolistId: string, title: string) => {
      dispatch(tasksThunks.createTask({ todolistId, title }))
    },
    [dispatch]
  )

  const addTodolists = useCallback(
    (newTitle: string) => {
      dispatch(createTodolistTC(newTitle))
    },
    [dispatch]
  )

  const updateTask = useCallback(
    (todolistId: string, taskId: string, title: string) => {
      dispatch(tasksThunks.updateTask({ todolistId, taskId, domainModel: { title } }))
    },
    [dispatch]
  )

  const updateTodolistTitle = useCallback(
    (todolistId: string, updateTitle: string) => {
      dispatch(changeTodolistTC(todolistId, updateTitle))
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
                  todolistId={tl.id}
                  title={tl.title}
                  tasks={tasks[tl.id]}
                  filter={tl.filter}
                  entityStatus={tl.entityStatus}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  updateTask={updateTask}
                  updateTodolistTitle={updateTodolistTitle}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
