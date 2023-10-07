import { v1 } from "uuid"
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
  todolistsReducer,
  todolistsThunks,
} from "features/TodolistsList/todolistsReducer"

let todolistId1: string
let todolistId2: string
let startState: TodolistDomainType[]

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()
  startState = [
    { id: todolistId1, title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: "idle" },
    { id: todolistId2, title: "What to buy", filter: "all", addedDate: "", order: 0, entityStatus: "idle" },
  ]
})

test("correct todolist should be removed", () => {
  const endState = todolistsReducer(
    startState,
    todolistsThunks.removeTodolist.fulfilled({ todolistId: todolistId1 }, "requestId", todolistId1)
  )
  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {
  const todolist = {
    id: "3",
    title: "bread",
    order: 0,
    addedDate: "",
  }
  const endState = todolistsReducer(startState, todolistsActions.addTodolistst({ todolist: todolist }))
  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe("bread")
})

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist"

  const endState = todolistsReducer(
    startState,
    todolistsActions.changeTodolistTitle({ todolistId: todolistId2, title: newTodolistTitle })
  )

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(newTodolistTitle)
})

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValuesType = "completed"

  const endState = todolistsReducer(
    startState,
    todolistsActions.changeTodolistFilter({ todolistId: todolistId2, filter: newFilter })
  )

  expect(endState[0].filter).toBe("all")
  expect(endState[1].filter).toBe(newFilter)
})
