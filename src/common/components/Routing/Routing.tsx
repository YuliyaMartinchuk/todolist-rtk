import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { TodolistsList } from "features/TodolistsList/TodolistsList"
import { Login } from "features/auth/ui/Login/Login"
import Container from "@mui/material/Container"

export const Routing = () => {
  return (
    <Container fixed>
      <Routes>
        <Route path={"/"} element={<TodolistsList />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
        <Route path="*" element={<Navigate to={"/404"} />} />
      </Routes>
    </Container>
  )
}
