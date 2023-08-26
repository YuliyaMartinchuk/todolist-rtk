import React from 'react';
// import './App.css';
// import {TaskType, Todolist} from './Todolist';
// import {v1} from 'uuid';
// import {AddItemForm} from "./components/AddItemForm";
// import {Grid, Paper} from "@mui/material";
// import ButtonAppBar from "./components/ButtonAppBar";
// import Container from '@mui/material/Container'
// import {addTaskAC, changeStatusAC, removeTaskAC, tasksReducer, updateTaskAC} from "./state/tasksReducer";
// import {
//     addTodoliststAC,
//     changeFilterAC,
//     removeTodolistAC,
//     todolistsReducer,
//     updateTodolistTitleAC
// } from "./state/todolistsReducer";
//
// export type FilterValuesType = "all" | "active" | "completed";
// export type TodolistType = {
//     id: string
//     title: string
//     filter: FilterValuesType
// }
//
// export type AssocTaskType = {
//     [key: string]: Array<TaskType>
// }
//
//
// function AppWithReducers() {
//     let todolistId1 = v1();
//     let todolistId2 = v1();
//
//     // let [todolists, setTodolists] = useState<Array<TodolistType>>([
//
//     let [todolists, dispatchTodolists] = useReducer(todolistsReducer, [
//         {id: todolistId1, title: "What to learn", filter: "all"},
//         {id: todolistId2, title: "What to buy", filter: "all"}
//     ])
//
//     // let [tasks, setTasks] = useState<AssocTaskType>({
//
//     let [tasks, dispatchTasks] = useReducer(tasksReducer, {
//         [todolistId1]: [
//             {id: v1(), title: "HTML&CSS", isDone: true},
//             {id: v1(), title: "JS", isDone: true}
//         ],
//         [todolistId2]: [
//             {id: v1(), title: "Milk", isDone: true},
//             {id: v1(), title: "React Book", isDone: true}
//         ],
//
//     });
//
//     const removeTask = (todolistId: string, taskId: string) => {
//         dispatchTasks(removeTaskAC(todolistId, taskId))
//     }
//
//     const changeStatus = (todolistId: string, taskId: string, status: TaskStatuses) => {
//         dispatchTasks(changeStatusAC(todolistId, taskId, isDone))
//
//     }
//
//     const changeFilter = (todolistId: string, value: FilterValuesType) => {
//         dispatchTodolists(changeFilterAC(todolistId, value))
//     }
//
//     const removeTodolist = (todolistId: string) => {
//         let action = removeTodolistAC(todolistId)
//         dispatchTodolists(action)
//         dispatchTasks(action)
//     }
//
//     const addTask = (todolistId: string, title: string) => {
//         dispatchTasks(addTaskAC(todolistId, title))
//     }
//
//     const addTodolists = (newTitle: string) => {
//         let action = addTodoliststAC(newTitle)
//         dispatchTodolists(action)
//         dispatchTasks(action)
//
//     }
//
//     const updateTask = (todolistId: string, taskId: string, updateTitle: string) => {
//         dispatchTasks(updateTaskAC(todolistId, taskId, updateTitle))
//     }
//
//     const updateTodolistTitle = (todolistId: string, updateTitle: string) => {
//         dispatchTodolists(updateTodolistTitleAC(todolistId, updateTitle))
//     }
//
//     return (
//         <div className="App">
//             <ButtonAppBar/>
//             <Container fixed>
//                 <Grid container style={{padding: "10px"}}>
//                     <AddItemForm callBack={addTodolists}/>
//                 </Grid>
//
//                 <Grid container spacing={3}>
//                     {
//                         todolists.map(tl => {
//                             let taskForTodolist = tasks[tl.id];
//                             let tasksForTodolist = taskForTodolist;
//
//                             if (tl.filter === "active") {
//                                 tasksForTodolist = taskForTodolist.filter(t => !t.isDone);
//                             }
//                             if (tl.filter === "completed") {
//                                 tasksForTodolist = taskForTodolist.filter(t => t.isDone);
//                             }
//
//                             return <Grid item key={tl.id}>
//                                 <Paper elevation={5} style={{padding: "10px"}}>
//                                     <Todolist
//
//                                         todolistId={tl.id}
//                                         title={tl.title}
//                                         tasks={tasksForTodolist}
//                                         removeTask={removeTask}
//                                         changeFilter={changeFilter}
//                                         addTask={addTask}
//                                         changeTaskStatus={changeStatus}
//                                         filter={tl.filter}
//                                         removeTodolist={removeTodolist}
//                                         updateTask={updateTask}
//                                         updateTodolistTitle={updateTodolistTitle}
//                                     />
//                                 </Paper>
//                             </Grid>
//                         })
//                     }
//                 </Grid>
//             </Container>
//
//         </div>
//     );
// }
//
// export default AppWithReducers;
