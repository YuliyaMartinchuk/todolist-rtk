import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"

import { useAppDispatch } from "app/model/store"
import { useSelector } from "react-redux"
import { selectIsLoggedIn } from "features/auth/model/authSelector"
import { authThunks } from "features/auth/model/authSlice"

export function ButtonAppBar() {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()
  const LogOutHandler = () => {
    dispatch(authThunks.logOut())
  }
  return (
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
          {/*<Button color="inherit">Login</Button>*/}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
