import {addTodoliststAC, TodolistDomainType, todolistsReducer} from "./todolistsReducer";
import {tasksReducer} from "./tasksReducer";
import {AssocTaskType} from "../components/versionApp/AppWithRedux";



test('ids should be equals', () => {
    const startTasksState: AssocTaskType = {}
    const startTodolistsState: TodolistDomainType[] = []



    const action = addTodoliststAC({
        id: "3", title: "bread", order: 0, addedDate: ""
    })

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})
