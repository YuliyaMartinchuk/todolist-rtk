import React, {useCallback, useEffect} from 'react';
import '../App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from "./AddItemForm";
import {Grid, Paper} from "@mui/material";
import {updateTaskTC, createTaskTC, deleteTaskTC} from "../state/tasksReducer";
import {
    changeFilterAC, changeTodolistTC, createTodolistTC, deleteTodolistTC, FilterValuesType, getTodoliststTC,
} from "../state/todolistsReducer";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch, useAppSelector} from "../state/store";
import {todoliststsSelector} from "../state/selectors";
import {TaskStatuses, TaskType} from "../api/todolist-api";
import {RequestStatusType} from "../state/appReducer";
import {Navigate} from "react-router-dom";

export type AssocTaskType = {
    [key: string]: TaskDomainType[]
}

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}


export const TodolistsList: React.FC = () => {

    let todolists = useSelector(todoliststsSelector)
    let tasks = useSelector<AppRootStateType, AssocTaskType>(state => state.tasks)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()


    useEffect(() => {
        if (!isLoggedIn) return
        dispatch(getTodoliststTC())
    }, [])

    const removeTask = useCallback((todolistId: string, taskId: string) => {
        dispatch(deleteTaskTC(todolistId, taskId))
    }, [dispatch])

    const changeStatus = useCallback((todolistId: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todolistId, taskId, {status}))

    }, [dispatch])

    const changeFilter = useCallback((todolistId: string, value: FilterValuesType) => {
        dispatch(changeFilterAC(todolistId, value))
    }, [dispatch])

    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(deleteTodolistTC(todolistId))
    }, [dispatch])

    const addTask = useCallback((todolistId: string, title: string) => {
        dispatch(createTaskTC(todolistId, title))
    }, [dispatch])

    const addTodolists = useCallback((newTitle: string) => {
        dispatch(createTodolistTC(newTitle))
    }, [dispatch])

    const updateTask = useCallback((todolistId: string, taskId: string, updateTitle: string) => {
        dispatch(updateTaskTC(todolistId, taskId, {title: updateTitle}))
    }, [dispatch])

    const updateTodolistTitle = useCallback((todolistId: string, updateTitle: string) => {
        dispatch(changeTodolistTC(todolistId, updateTitle))
    }, [dispatch])


    if (!isLoggedIn) return <Navigate to={'/login'}/>

    return (
        <>
            <Grid container style={{padding: "10px"}}>
                <AddItemForm callBack={addTodolists}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        return <Grid item key={tl.id}>
                            <Paper elevation={5} style={{padding: "10px"}}>
                                <Todolist
                                    todolistId={tl.id}
                                    title={tl.title}
                                    tasks={tasks[tl.id]}
                                    filter={tl.filter}
                                    entityStatus={tl.entityStatus}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    removeTodolist={removeTodolist}
                                    updateTask={updateTask}
                                    updateTodolistTitle={updateTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    );
}


