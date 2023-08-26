import {AssocTaskType} from "../components/versionApp/AppWithRedux";
import {
    addTodoliststACType,
    removeTodolistACType,
    setTodoliststACType
} from "./todolistsReducer";
import { TaskType, TodolistApi, UpdateDomainTaskModelType, UpdateTaskModelType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, setStatusAC} from "./appReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";

const initialState: AssocTaskType = {}

export const tasksReducer = (state = initialState, action: ActionsType): AssocTaskType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(el => el.id !== action.payload.taskId)
            }
        }
        // case "CHANGE-STATUS": {
        //     return {
        //         ...state, [action.payload.todolistId]: state[action.payload.todolistId].map(
        //             el => el.id === action.payload.taskId ? {...el, status: action.payload.status} : el
        //         )
        //     }
        // }
        case "CHANGE-ENTITY-STATUS-TASK": {
            return {
                ...state, [action.payload.todolistId]: state[action.payload.todolistId].map(
                    el => el.id === action.payload.taskId ? {...el, entityStatus: action.payload.entityStatus} : el
                )
            }
        }
        case "ADD-TASK": {
            return {
                ...state,
                [action.payload.task.todoListId]:
                    [
                        {...action.payload.task, entityStatus: "idle"},
                        ...state[action.payload.task.todoListId]
                    ]
            }
        }
        case "UPDATE-TASK": {
            return {
                ...state, [action.payload.todolistId]: state[action.payload.todolistId].map(
                    el => el.id === action.payload.taskId ? {...el, ...action.payload.model} : el
                )
            }
        }
        case "ADD-TODOLIST": {
            return {...state, [action.payload.todolist.id]: []}
        }
        case "REMOVE-TODOLIST": {
            let copyState = {...state}
            delete copyState[action.payload.todolistId]
            return copyState
        }
        case "SET-TODOLIST": {
            const stateCopy = {...state}
            action.payload.todolist.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "SET-TASK": {
            return {
                ...state, [action.payload.todolistId]:
                    action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
            }
        }

        default:
            return state
    }
}


export const removeTaskAC = (todolistId: string, taskId: string) => {
    return {type: "REMOVE-TASK", payload: {todolistId, taskId}} as const
}

// export const changeStatusAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => {
//     return {type: "CHANGE-STATUS", payload: {todolistId, taskId, model}} as const
// }

export const changeEntityTaskStatusAC = (todolistId: string, taskId: string, entityStatus: RequestStatusType) => {
    return {type: "CHANGE-ENTITY-STATUS-TASK", payload: {todolistId, taskId, entityStatus}} as const
}

export const addTaskAC = (task: TaskType) => {
    return {type: "ADD-TASK", payload: {task}} as const
}

export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => {
    return {type: "UPDATE-TASK", payload: {todolistId, taskId, model}} as const
}

export const setTaskAC = (todolistId: string, tasks: TaskType[]) => {
    return {type: "SET-TASK", payload: {todolistId, tasks}} as const
}


export const getTaskTC = (todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(setStatusAC("loading"))
    try {
        const res = await TodolistApi.getTasks(todolistId)
        dispatch(setTaskAC(todolistId, res.data.items))
        dispatch(setStatusAC("succeeded"))
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            const error = e.response ? e.response?.data.messages[0].message : e.message
            handleServerNetworkError(dispatch, error)
            return
        }
        const error = (e as Error).message
        handleServerNetworkError(dispatch, error)
    }
}

export const deleteTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    dispatch(setStatusAC("loading"))
    dispatch(changeEntityTaskStatusAC(todolistId, taskId, "loading"))
    try {
        const res = await TodolistApi.deleteTasks(todolistId, taskId)
        if (res.data.resultCode === Result_Code.OK) {
        dispatch(removeTaskAC(todolistId, taskId))
        dispatch(setStatusAC("succeeded"))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    }
    catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            const error = e.response ? e.response?.data.messages[0].message : e.message
            handleServerNetworkError(dispatch, error)
            dispatch(changeEntityTaskStatusAC(todolistId, taskId, "idle"))
            return
        }
        const error = (e as Error).message
        handleServerNetworkError(dispatch, error)
        dispatch(changeEntityTaskStatusAC(todolistId, taskId, "idle"))
    }
}

export const createTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setStatusAC("loading"))
    try {
        const res = await TodolistApi.createTasks(todolistId, title)
        if (res.data.resultCode === Result_Code.OK) {
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setStatusAC("succeeded"))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            const error = e.response ? e.response?.data.messages[0].message : e.message
            handleServerNetworkError(dispatch, error)
            return
        }
        const error = (e as Error).message
        handleServerNetworkError(dispatch, error)
    }
}


export const updateTaskTC = (todolistId: string, taskId: string,  domainModel: UpdateDomainTaskModelType) => async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(setStatusAC("loading"))
    const task = getState().tasks[todolistId].find(t => t.id === taskId)

    if (task) {
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
           ...domainModel
        }

        try {
            const res = await TodolistApi.updateTasks(todolistId, taskId, apiModel)
            if (res.data.resultCode === Result_Code.OK) {
                dispatch(updateTaskAC(todolistId, taskId, domainModel))
                dispatch(setStatusAC("succeeded"))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        } catch (e) {
            if (axios.isAxiosError<ErrorType>(e)) {
                const error = e.response ? e.response?.data.messages[0].message : e.message
                handleServerNetworkError(dispatch, error)
                return
            }
            const error = (e as Error).message
            handleServerNetworkError(dispatch, error)
        }
    }
}

export enum Result_Code {
    OK = 0,
    ERROR = 1,
    CAPTCHA_ERROR = 10
}

export type ErrorType = {
    statusCode: number,
    messages: [
        {
            message: string,
            field: string
        }
    ],
    error: string
}

export type ActionsType =
    removeTaskACType
    // | changeStatusACType
    | addTaskACType
    | updateTaskACType
    | addTodoliststACType
    | removeTodolistACType
    | setTodoliststACType
    | setTaskACType
    | changeEntityTaskStatusACTyoe

type removeTaskACType = ReturnType<typeof removeTaskAC>
// type changeStatusACType = ReturnType<typeof changeStatusAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type updateTaskACType = ReturnType<typeof updateTaskAC>
type setTaskACType = ReturnType<typeof setTaskAC>
type changeEntityTaskStatusACTyoe = ReturnType<typeof changeEntityTaskStatusAC>



