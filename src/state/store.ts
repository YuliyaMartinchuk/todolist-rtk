import { AnyAction, combineReducers } from "redux"
import { tasksReducer } from "./tasksReducer"
import { todolistsReducer } from "./todolistsReducer"
import { ThunkDispatch } from "redux-thunk"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { appReducer } from "./appReducer"
import { authReducer } from "./authReducer"
import { configureStore } from "@reduxjs/toolkit"

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

export const store = configureStore({ reducer: rootReducer })

export type AppRootStateType = ReturnType<typeof store.getState>

type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppDispatchType>()

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store
