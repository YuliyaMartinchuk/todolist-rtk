import React, { useEffect } from "react";
import "./App.css";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import { Navigate, Route, Routes } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { useAppDispatch, useAppSelector } from "./state/store";
import { RequestStatusType } from "./state/appReducer";
import { logOutTC, meTC } from "./state/authReducer";
import { ErrorSnackbar } from "./components/ErrorSnackbar";
import { Login } from "./components/Login";
import { TodolistsList } from "./components/TodolistsList";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";


function App() {

  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized);
  const status = useAppSelector<RequestStatusType>(state => state.app.status);
  const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);

  const LogOutHandler = () => {
    dispatch(logOutTC());
  };
  useEffect(() => {
    dispatch(meTC());
  }, []);

  if (!isInitialized) {
    return <div
      style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
      <CircularProgress />
    </div>;
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
            {isLoggedIn && <Button color="inherit" onClick={LogOutHandler}>Log out</Button>}
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
  );
}

export default App;
