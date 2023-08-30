import { AppRootState } from "app/store"

export const selectAppStatus = (state: AppRootState) => state.app.status
export const selectAppIsInitialized = (state: AppRootState) => state.app.isInitialized
export const selectAppError = (state: AppRootState) => state.app.error
