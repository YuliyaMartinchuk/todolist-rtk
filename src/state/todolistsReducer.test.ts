import { v1 } from "uuid"
import {
  addTodoliststAC,
  changeFilterAC,
  FilterValuesType,
  removeTodolistAC,
  TodolistDomainType,
  todolistsReducer,
  updateTodolistTitleAC,
} from "./todolistsReducer"

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
  const endState = todolistsReducer(startState, removeTodolistAC(todolistId1))

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {
  const endState = todolistsReducer(
    startState,
    addTodoliststAC({
      id: "3",
      title: "bread",
      order: 0,
      addedDate: "",
    })
  )

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe("bread")
})

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist"

  const endState = todolistsReducer(startState, updateTodolistTitleAC(todolistId2, newTodolistTitle))

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(newTodolistTitle)
})

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValuesType = "completed"

  const endState = todolistsReducer(startState, changeFilterAC(todolistId2, newFilter))

  expect(endState[0].filter).toBe("all")
  expect(endState[1].filter).toBe(newFilter)
})
