import {AppRootStateType} from "../store";
import {TaskType} from "../../api/todolist-api";



export const tasksSelector = (state:AppRootStateType, todolistId:string):Array<TaskType> => state.tasks[todolistId]