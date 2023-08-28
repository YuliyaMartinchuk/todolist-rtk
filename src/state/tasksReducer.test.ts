import { tasksActions, tasksReducer } from "./tasksReducer"
import { TaskPriorities, TaskStatuses } from "api/todolist-api"
import { AssocTaskType } from "components/TodolistsList"
import { todolistsActions } from "state/todolistsReducer"

let startState: AssocTaskType

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
        entityStatus: "idle",
      },
    ],
  }
})

test("correct task should be deleted from correct array", () => {
  const action = tasksActions.removeTask({ todolistId: "todolistId2", taskId: "2" })

  const endState = tasksReducer(startState, action)

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatuses.New,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        description: "",
        priority: TaskPriorities.Low,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
    ],
  })
})

test("correct task should be added to correct array", () => {
  const task = {
    id: "1",
    title: "juce",
    status: TaskStatuses.New,
    description: "",
    priority: TaskPriorities.Low,
    startDate: "",
    deadline: "",
    todoListId: "todolistId2",
    order: 0,
    addedDate: "",
  }
  const action = tasksActions.addTask({ task: task })
  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(4)
  expect(endState["todolistId2"][0].id).toBeDefined()
  expect(endState["todolistId2"][0].title).toBe("juce")
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New)
})

test("status of specified task should be changed", () => {
  const model = {
    title: "juce",
    description: "",
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate: "",
    deadline: "",
  }
  const action = tasksActions.updateTask({ todolistId: "todolistId2", taskId: "2", model: model })
  const endState = tasksReducer(startState, action)
  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New)
  expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed)
})

test("title of specified task should be changed", () => {
  const model = {
    title: "tea",
    description: "",
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate: "",
    deadline: "",
  }
  const action = tasksActions.updateTask({ todolistId: "todolistId2", taskId: "2", model: model })

  const endState = tasksReducer(startState, action)

  expect(endState["todolistId2"][1].title).toBe("tea")
  expect(endState["todolistId1"][1].title).toBe("JS")
})

test("new array should be added when new todolist is added", () => {
  const todolist = {
    id: "3",
    title: "bread",
    order: 0,
    addedDate: "",
  }
  const action = todolistsActions.addTodolistst({ todolist: todolist })

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2")
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const action = todolistsActions.removeTodolist({ todolistId: "todolistId2" })

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
})
