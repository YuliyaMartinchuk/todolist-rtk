import React from "react"
import Grid from "@mui/material/Grid"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { Navigate } from "react-router-dom"
import { useLogin } from "features/auth/lib/useLogin"
import { selectCaptchaUrl } from "features/auth/model/authSelector"
import { useAppSelector } from "app/store"

export const Login = () => {
  const { formik, isLoggedIn } = useLogin()

  const captchaUrl = useAppSelector(selectCaptchaUrl)

  if (isLoggedIn) return <Navigate to={"/"} />

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <FormLabel>
            <p>
              To log in get registered
              <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                {" "}
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
              {formik.touched.email && formik.errors.email && <div style={{ color: "red" }}>{formik.errors.email}</div>}
              <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps("password")} />
              {formik.touched.password && formik.errors.password && (
                <div style={{ color: "red" }}>{formik.errors.password}</div>
              )}
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox checked={formik.values.rememberMe} {...formik.getFieldProps("rememberMe")} />}
              />
              {captchaUrl && <img src={captchaUrl} alt="captcha-img" />}
              {captchaUrl && (
                <TextField type="password" label="captcha" margin="normal" {...formik.getFieldProps("captcha")} />
              )}
              <Button
                type={"submit"}
                variant={"contained"}
                color={"primary"}
                disabled={!(formik.isValid && formik.dirty)}
              >
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  )
}
