import React, { useCallback, useEffect } from "react"
import "app/App.css"
import { Todolist } from "features/TodolistsList/Todolist/Todolist"
import { Grid, Paper } from "@mui/material"
import { tasksThunks } from "features/TodolistsList/tasksReducer"
import { FilterValuesType, todolistsActions, todolistsThunks } from "features/TodolistsList/todolistsReducer"
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

  const { getTodolistst, removeTodolist, addTodolist, changeTodolistTitle } = useActions(todolistsThunks)
  const { deleteTask, updateTask, createTask } = useActions(tasksThunks)
  const { changeTodolistFilter } = useActions(todolistsActions)

  useEffect(() => {
    if (!isLoggedIn) return
    getTodolistst()
  }, [])

  const removeTask = useCallback(
    (todolistId: string, taskId: string) => {
      deleteTask({ todolistId, taskId })
    },
    [dispatch]
  )

  const changeStatus = useCallback(
    (todolistId: string, taskId: string, status: TaskStatuses) => {
      updateTask({ todolistId, taskId, domainModel: { status } })
    },
    [dispatch]
  )

  const changeFilter = useCallback(
    (todolistId: string, filter: FilterValuesType) => {
      changeTodolistFilter({ todolistId, filter })
    },
    [dispatch]
  )

  const removeTodolistCB = useCallback(
    (todolistId: string) => {
      removeTodolist(todolistId)
    },
    [dispatch]
  )

  const addTask = useCallback(
    (todolistId: string, title: string) => {
      createTask({ todolistId, title })
    },
    [dispatch]
  )

  const addTodolists = useCallback(
    (newTitle: string) => {
      addTodolist(newTitle)
    },
    [dispatch]
  )

  const changeTaskTitle = useCallback(
    (todolistId: string, taskId: string, title: string) => {
      updateTask({ todolistId, taskId, domainModel: { title } })
    },
    [dispatch]
  )

  const updateTodolistTitle = useCallback(
    (todolistId: string, title: string) => {
      changeTodolistTitle({ todolistId, title })
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
                  removeTodolist={removeTodolistCB}
                  updateTask={changeTaskTitle}
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
