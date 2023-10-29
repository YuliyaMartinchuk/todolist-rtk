import React, { useEffect } from "react"
import "app/ui/App.css"
import CircularProgress from "@mui/material/CircularProgress/CircularProgress"
import { authThunks } from "features/auth/model/authSlice"
import { ErrorSnackbar, Header } from "common/components"
import { useActions } from "common/hooks"
import Container from "@mui/material/Container"
import { useRoutes } from "common/components/Routes"
import { useAppSelector } from "app/model/store"

export const App = () => {
  const isInitialized = useAppSelector<boolean>((state) => state.app.isInitialized)

  const { initializeApp } = useActions(authThunks)
  const routes = useRoutes()

  useEffect(() => {
    initializeApp()
  }, [])

  if (!isInitialized) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <Header />
      <Container fixed>{routes}</Container>
    </div>
  )
}
