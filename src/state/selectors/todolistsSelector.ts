import {AppRootStateType} from "../store";
import {TodolistDomainType} from "../todolistsReducer";


export const todoliststsSelector = (state:AppRootStateType): TodolistDomainType[] => state.todolists