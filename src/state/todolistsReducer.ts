import {TodolistApi, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {RequestStatusType,  setStatusAC} from "./appReducer";
import { ErrorType, Result_Code} from "./tasksReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios";

const initialState: TodolistDomainType[] = []

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const todolistsReducer = (state = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "CHANGE-FILTER": {
            return state.map(el => el.id === action.payload.todolistId ? {...el, filter: action.payload.value} : el)
        }

        case "REMOVE-TODOLIST": {
            return state.filter(el => el.id !== action.payload.todolistId)
        }

        case "ADD-TODOLIST": {
            return [{...action.payload.todolist, filter: "all", entityStatus: "idle"}, ...state]
        }

        case "UPDATE-TODOLIST": {
            return state.map(el => el.id === action.payload.todolistId ? {
                ...el,
                title: action.payload.updateTitle
            } : el)

        }
        case "SET-TODOLIST": {
            return action.payload.todolist.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        }
        case "CHANGE-TODOLIST-STATUS": {
            return state.map(el => el.id === action.payload.todolistId ? {
                ...el,
                entityStatus: action.payload.status
            } : el)
        }
        default:
            return state
    }
}

export const changeFilterAC = (todolistId: string, value: FilterValuesType) => {
    return {type: "CHANGE-FILTER", payload: {todolistId, value}} as const
}

export const updateTodolistTitleAC = (todolistId: string, updateTitle: string) => {
    return {type: "UPDATE-TODOLIST", payload: {todolistId, updateTitle}} as const
}

export const removeTodolistAC = (todolistId: string) => {
    return {type: "REMOVE-TODOLIST", payload: {todolistId}} as const
}

export const addTodoliststAC = (todolist: TodolistType) => {
    return {type: "ADD-TODOLIST", payload: {todolist}} as const
}

export const setTodoliststAC = (todolist: TodolistType[]) => {
    return {type: "SET-TODOLIST", payload: {todolist}} as const
}

export const changeTodolistStatusAC = (todolistId: string, status: RequestStatusType) => {
    return {type: "CHANGE-TODOLIST-STATUS", payload: {todolistId, status}} as const
}


export const getTodoliststTC = () => async (dispatch: Dispatch) => {
    dispatch(setStatusAC("loading"))
    try {
        const res = await TodolistApi.getTodolist()
        dispatch(setTodoliststAC(res.data))
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


export const deleteTodolistTC = (todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(setStatusAC("loading"))
    dispatch(changeTodolistStatusAC(todolistId, "loading"))

    try {
        const res = await TodolistApi.deleteTodolist(todolistId)
        if (res.data.resultCode === Result_Code.OK) {
            dispatch(removeTodolistAC(todolistId))
            dispatch(setStatusAC("succeeded"))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        if (axios.isAxiosError<ErrorType>(e)) {
            const error = e.response ? e.response?.data.messages[0].message : e.message
            handleServerNetworkError(dispatch, error)
            dispatch(changeTodolistStatusAC(todolistId, "idle"))
            return
        }
        const error = (e as Error).message
        handleServerNetworkError(dispatch, error)
        dispatch(changeTodolistStatusAC(todolistId, "idle"))
    }
}

export const createTodolistTC = (newTitle: string) => async (dispatch: Dispatch) => {
    dispatch(setStatusAC("loading"))
    try {
        const res = await TodolistApi.createTodoLists(newTitle)
        if (res.data.resultCode === Result_Code.OK) {
            dispatch(addTodoliststAC(res.data.data.item))
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

export const changeTodolistTC = (todolistId: string, updateTitle: string) => async (dispatch: Dispatch) => {
    dispatch(setStatusAC("loading"))
    try {
        const res = await TodolistApi.updateTodolist(todolistId, updateTitle)
        if (res.data.resultCode === Result_Code.OK) {
            dispatch(updateTodolistTitleAC(todolistId, updateTitle))
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


type changeFilterACType = ReturnType<typeof changeFilterAC>
export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export type addTodoliststACType = ReturnType<typeof addTodoliststAC>
type updateTodolistTitleACType = ReturnType<typeof updateTodolistTitleAC>
export type setTodoliststACType = ReturnType<typeof setTodoliststAC>
export type changeTodolistStatusACType = ReturnType<typeof changeTodolistStatusAC>

export type ActionsType = changeFilterACType
    | removeTodolistACType
    | addTodoliststACType
    | updateTodolistTitleACType
    | setTodoliststACType
    | changeTodolistStatusACType
