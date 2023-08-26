
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    isInitialized: false,
    status: 'loading' as RequestStatusType,
    error: null as string | null

}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
        case "APP/SET-ERROR":
            return {...state, error: action.payload.error}
        case "APP/SET-INITIALIZED":
            return {...state, isInitialized: action.payload.isInitialized}
        default:
            return state
    }
}


export const setStatusAC = (status: RequestStatusType) => {
    return {type: 'APP/SET-STATUS', payload: {status}} as const
}

export const setErrorAC = (error: string | null) => {
    return {type: 'APP/SET-ERROR', payload: {error}} as const
}

export const setInitializedAC  = (isInitialized: boolean) => {
    return {type: 'APP/SET-INITIALIZED', payload: {isInitialized}} as const
}


export type setStatusACType = ReturnType<typeof setStatusAC>
export type setErrorACType = ReturnType<typeof setErrorAC>
export type setInitialized = ReturnType<typeof setInitializedAC >

type ActionsType = setStatusACType | setErrorACType | setInitialized