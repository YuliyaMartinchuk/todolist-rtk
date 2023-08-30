import { AnyAction, combineReducers } from "redux"
import { tasksReducer } from "features/TodolistsList/tasksReducer"
import { todolistsReducer } from "features/TodolistsList/todolistsReducer"
import { ThunkDispatch } from "redux-thunk"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { appReducer } from "app/appReducer"
import { authReducer } from "features/Login/authReducer"
import { configureStore } from "@reduxjs/toolkit"

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

export const store = configureStore({ reducer: rootReducer })

export type AppRootState = ReturnType<typeof store.getState>

export type AppDispatch = ThunkDispatch<AppRootState, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector

// @ts-ignore
window.store = store
