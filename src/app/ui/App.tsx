import React, { useEffect } from "react"
import "app/ui/App.css"
import CircularProgress from "@mui/material/CircularProgress/CircularProgress"
import { useAppSelector } from "app/store"
import { authThunks } from "features/auth/model/authSlice"
import { ErrorSnackbar, Header, Routing } from "common/components"
import { useActions } from "common/hooks/useActions"

function App() {
  const isInitialized = useAppSelector<boolean>((state) => state.app.isInitialized)

  const { initializeApp } = useActions(authThunks)

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
      <Routing />
    </div>
  )
}

export default App
