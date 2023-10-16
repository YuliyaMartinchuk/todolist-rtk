import React, { useEffect } from "react"
import "app/ui/App.css"
import Container from "@mui/material/Container"
import LinearProgress from "@mui/material/LinearProgress"
import { Navigate, Route, Routes } from "react-router-dom"
import CircularProgress from "@mui/material/CircularProgress/CircularProgress"
import { useAppSelector } from "app/store"
import { RequestStatusType } from "app/model/appSlice"
import { authThunks } from "features/auth/model/authSlice"

import { Login } from "features/auth/ui/Login/Login"
import { TodolistsList } from "features/TodolistsList/TodolistsList"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Typography from "@mui/material/Typography"
import { ErrorSnackbar } from "common/components"
import { useActions } from "common/hooks/useActions"

function App() {
  const isInitialized = useAppSelector<boolean>((state) => state.app.isInitialized)
  const status = useAppSelector<RequestStatusType>((state) => state.app.status)
  const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn)

  const { initializeApp, logOut } = useActions(authThunks)

  const LogOutHandler = () => {
    logOut()
  }
  useEffect(() => {
    initializeApp()
  }, [])

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="App">
      <ErrorSnackbar />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              News
            </Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={LogOutHandler}>
                Log out
              </Button>
            )}
          </Toolbar>
          {status === "loading" && <LinearProgress color="secondary" />}
        </AppBar>
      </Box>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path="*" element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App