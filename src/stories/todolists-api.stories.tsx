import React, { useEffect, useState } from "react"
import { tasksApi } from "features/TodolistsList/tasksApi"
import { todolistsApi } from "features/TodolistsList/todolistsApi"

export default {
  title: "API",
}

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todolistsApi.getTodolist().then((res) => {
      setState(res.data)
    })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const title = "NEW TITLE"
    todolistsApi.createTodoLists(title).then((res) => {
      setState(res.data)
    })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "81ee1df0-e192-45db-8265-9839ff2ff23f"
    todolistsApi.deleteTodolist(todolistId).then((res) => {
      setState(res.data)
    })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "5cab166d-593e-4982-a5fe-c3a3e2d55f21"
    const title = "UPDATE TITLE"
    todolistsApi.updateTodolist({ todolistId, title }).then((res) => {
      setState(res.data)
    })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "33d7f09c-30bd-4857-9c5d-c17bf5be727d"
    tasksApi.getTasks(todolistId).then((res) => {
      setState(res.data)
    })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const CreateTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "33d7f09c-30bd-4857-9c5d-c17bf5be727d"
    const title = "1.4TASK"
    tasksApi.createTasks({ todolistId, title }).then((res) => {
      setState(res.data)
    })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "33d7f09c-30bd-4857-9c5d-c17bf5be727d"
    const taskId = "8288b75a-7b78-46ef-80ea-2f24defe1a05"
    tasksApi.deleteTasks({ todolistId, taskId }).then((res) => {
      setState(res.data)
    })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTasks = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    const todolistId = "33d7f09c-30bd-4857-9c5d-c17bf5be727d"
    const taskId = "f70df724-4ca4-48ba-ba7a-40158d8151b2"

    tasksApi
      .updateTasks(todolistId, taskId, {
        title: "1.2TASK",
        description: "",
        status: 0,
        priority: 0,
        startDate: "",
        deadline: "",
      })
      .then((res) => {
        setState(res.data)
      })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}
