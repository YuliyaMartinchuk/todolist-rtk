import axios, {AxiosResponse} from "axios";


const instance = axios.create(
    {
        baseURL: 'https://social-network.samuraijs.com/api/1.1/',
        withCredentials: true
    }
)

export const authAPI = {
    login(data:LoginType) {
        return instance.post<ResponseType<{userId: number|undefined}>, AxiosResponse<ResponseType<{userId: number|undefined}>>, LoginType>(`auth/login`, data)
    },
    me() {
        return instance.get<ResponseType<UserDate>>(`auth/me`)
    },
    logOut() {
        return instance.delete<ResponseType>('auth/login')
    }
}

export const TodolistApi = {
    getTodolist() {
        return instance.get<TodolistType[]>(`todo-lists`)
    },
    createTodoLists(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>, AxiosResponse<ResponseType<{ item: TodolistType }>>, { title: string }>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${todolistId}`, {title})
    },
    getTasks(todolistId: string) {
        return instance.get<GetTaskResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    createTasks(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{ item: TaskType }>>, { title: string }>(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTasks(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTasks(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{ item: TaskType }>>, UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }

}
export type ResponseType<T = {}> = {
    resultCode: number
    messages: string[]
    data: T
}

type GetTaskResponseType = {
    totalCount: number
    error: string | null
    items: TaskType[]
}

 export type UpdateTaskModelType = {
     title: string
     description: string
     status?: TaskStatuses
     priority: TaskPriorities
     startDate: string
     deadline: string
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type LoginType = {
    email: string
    password: string
    rememberMe: boolean
}

export type UserDate = {
    id: number
    email: string
    login: string
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}


// type CreateTodoListsResponseType<T={items:TodolistType}> = {
//     resultCode: number
//     messages: string[]
//     data: T
// }
// type DeleteTodolistResponseType<T={}> = {
//     resultCode: number
//     messages: string[]
//     data: T
// }
// type UpdateTodolistResponseType<T={}> = {
//     resultCode: number
//     messages: string[]
//     data: T
// }
//type CreateTaskResponseType<T={items:TaskType}> = {
//     resultCode: number
//     messages: string[]
//     data: T
// }
// type DeleteTaskResponseType<T={}> = {
//     resultCode: number
//     messages: string[]
//     data: T
// }
// type UpdateTaskResponseType<T={}> = {
//     resultCode: number
//     messages: string[]
//     data: T
// }