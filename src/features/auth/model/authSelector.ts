import { AppRootState } from "app/model/store"

export const selectIsLoggedIn = (state: AppRootState) => state.auth.isLoggedIn
export const selectCaptchaUrl = (state: AppRootState) => state.auth.captchaUrl
