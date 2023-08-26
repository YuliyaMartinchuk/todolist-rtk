import {Dispatch} from "redux";
import {authAPI, LoginType} from "../api/todolist-api";
import {setInitializedAC, setStatusAC, setStatusACType} from "./appReducer";
import {Result_Code} from "./tasksReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState = {
    isLoggedIn: false
}

type initialStateType = typeof initialState

export const authReducer = (state: initialStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case "login/SET-IS-LOGGED-IN":
            return {...state, isLoggedIn: action.payload.value}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) => {
    return {type: "login/SET-IS-LOGGED-IN", payload: {value}} as const
}

export const loginTC = (data: LoginType) => async (dispatch: Dispatch) => {
    try {
        dispatch(setStatusAC("loading"))
        const res = await authAPI.login(data)
        if (res.data.resultCode === Result_Code.OK) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setStatusAC("succeeded"))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        const error = (e as Error).message
        handleServerNetworkError(dispatch, error);
    }
}

export const logOutTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setStatusAC("loading"))
        const res = await authAPI.logOut()
        if (res.data.resultCode === Result_Code.OK) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setStatusAC("succeeded"))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        const error = (e as Error).message
        handleServerNetworkError(dispatch, error);
    }
}


export const meTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setStatusAC("loading"))
        const res = await authAPI.me()
        if (res.data.resultCode === Result_Code.OK) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setStatusAC("succeeded"))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    } catch (e) {
        const error = (e as Error).message
        handleServerNetworkError(dispatch, error);
    } finally {
        dispatch(setInitializedAC(true))
    }
}

type ActionsType =
    ReturnType<typeof setIsLoggedInAC>
    | setStatusACType