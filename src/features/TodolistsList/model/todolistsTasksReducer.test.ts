import {
  TodolistDomainType,
  todolistsSlice,
  todolistsThunks,
} from "features/TodolistsList/model/todolists/todolistsSlice"
import { tasksSlice } from "features/TodolistsList/model/tasks/tasksSlice"
import { AssocTaskType } from "features/TodolistsList/api/tasksApi.types"

test("ids should be equals", () => {
  const startTasksState: AssocTaskType = {}
  const startTodolistsState: TodolistDomainType[] = []

  const todolist = {
    id: "3",
    title: "bread",
    order: 0,
    addedDate: "",
  }

  const action = todolistsThunks.addTodolist.fulfilled({ todolist: todolist }, "requestId", todolist.title)

  const endTasksState = tasksSlice(startTasksState, action)
  const endTodolistsState = todolistsSlice(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
