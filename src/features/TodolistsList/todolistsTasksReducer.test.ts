import { TodolistDomainType, todolistsActions, todolistsReducer } from "features/TodolistsList/todolistsReducer"
import { tasksReducer } from "features/TodolistsList/tasksReducer"
import { AssocTaskType } from "features/TodolistsList/TodolistsList"

test("ids should be equals", () => {
  const startTasksState: AssocTaskType = {}
  const startTodolistsState: TodolistDomainType[] = []

  const todolist = {
    id: "3",
    title: "bread",
    order: 0,
    addedDate: "",
  }
  const action = todolistsActions.addTodolistst({ todolist: todolist })

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
