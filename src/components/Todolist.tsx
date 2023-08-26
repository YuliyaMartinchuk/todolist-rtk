import React, {memo, useCallback, useEffect} from 'react';

import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button, {ButtonProps} from '@mui/material/Button';
import {Task} from "./Task";
import {TaskStatuses} from "../api/todolist-api";
import {FilterValuesType} from "../state/todolistsReducer";
import {useAppDispatch} from "../state/store";
import {getTaskTC} from "../state/tasksReducer";
import {RequestStatusType} from "../state/appReducer";
import {TaskDomainType} from "./versionApp/AppWithRedux";

// export type TaskType = {
//     id: string
//     title: string
//     status: TaskStatuses
// }

type PropsType = {
    todolistId: string
    title: string
    tasks: TaskDomainType[]
    entityStatus: RequestStatusType
    removeTask: (todolistId: string, taskId: string) => void
    changeFilter: (todolistId: string, value: FilterValuesType) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskStatus: (todolistId: string, taskId: string, status: TaskStatuses) => void
    removeTodolist: (todolistId: string) => void
    filter: FilterValuesType
    updateTask: (todolistId: string, taskId: string, updateTitle: string) => void
    updateTodolistTitle: (todolistId: string, updateTitle: string) => void
}

export const Todolist = memo((props: PropsType) => {
    // console.log("Todolist")
    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(getTaskTC(props.todolistId))
    }, [])

    const removeTodolist = () => props.removeTodolist(props.todolistId)
    const onAllClickHandler = useCallback(() => props.changeFilter(props.todolistId, "all"), [props.todolistId])
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todolistId, "active"), [props.todolistId])
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.todolistId, "completed"), [props.todolistId])

    let tasks = props.tasks;

    if (props.filter === "active") {
        tasks = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }


    const addTaskHandler = useCallback((newTitle: string) => {
        props.addTask(props.todolistId, newTitle)
    }, [props.addTask, props.todolistId])
    const updateTodolistTitleHandler = useCallback((updateTitle: string) => {
        props.updateTodolistTitle(props.todolistId, updateTitle)
    }, [props.updateTodolistTitle, props.todolistId])
    const removeTask = useCallback((taskId:string) => props.removeTask(props.todolistId, taskId),[props.removeTask,props.todolistId])
    const changeTaskStatus = useCallback((taskId:string, status:TaskStatuses) => {
        props.changeTaskStatus(props.todolistId, taskId, status);
    },[props.changeTaskStatus,props.todolistId])
    const updateTask = useCallback((taskID: string, updateTitle: string) => {
        props.updateTask(props.todolistId, taskID, updateTitle)
    }, [props.updateTask, props.todolistId])

    return <div>
        <h3>
            <EditableSpan oldTitle={props.title} callBack={updateTodolistTitleHandler}/>
            <IconButton aria-label="delete" disabled={props.entityStatus === "loading"} onClick={removeTodolist}>
                <DeleteIcon/>
            </IconButton>
        </h3>
        <div>
            <AddItemForm disabled = {props.entityStatus === "loading"} callBack={addTaskHandler}/>
        </div>
        <div>
            {
                tasks.map(t => {
                    return <Task key={t.id}
                                 task={t}
                                 removeTask={removeTask}
                                 changeTaskStatus={changeTaskStatus}
                                 updateTask={updateTask}

                    />
                })
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <ButtonWithMemo title={"All"}
                            variant={props.filter === 'all' ? "outlined" : "contained"}
                            color={"success"}
                            onClick={onAllClickHandler}/>
            <ButtonWithMemo title={"Active"}
                            variant={props.filter === 'active' ? "outlined" : "contained"}
                            color={"secondary"}
                            onClick={onActiveClickHandler}/>
            <ButtonWithMemo title={"Completed"}
                            variant={props.filter === 'completed' ? "outlined" : "contained"}
                            color={"error"}
                            onClick={onCompletedClickHandler}/>
        </div>
    </div>
})

type ButtonWithMemoPropsType = {
    title: string
    variant: 'text' | 'outlined' | 'contained'
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    onClick: () => void
}

const ButtonWithMemo = memo((props: ButtonProps) => {
    return <Button variant={props.variant}
                   color={props.color}
                   onClick={props.onClick}>{props.title}
    </Button>
})