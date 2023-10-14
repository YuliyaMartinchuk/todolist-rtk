import { LoginType } from "features/auth/api/authApi"
import { useAppSelector } from "app/store"
import { FormikHelpers, useFormik } from "formik"
import { authThunks } from "features/auth/model/authSlice"
import { BaseResponseType } from "common/types"
import { useActions } from "common/hooks/useActions"

type FormikErrorType = Partial<Omit<LoginType, "captcha">>

export const useLogin = () => {
  const { login } = useActions(authThunks)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = "Required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address"
      }

      if (!values.password) {
        errors.password = "Required"
      } else if (values.password?.length < 4) {
        errors.password = "Please add more symbols"
      }
      return errors
    },
    onSubmit: (values, formikHelpers: FormikHelpers<LoginType>) => {
      login(values)
        .unwrap()
        .then((res) => {})
        .catch((err: BaseResponseType) => {
          if (err.fieldsErrors) {
            err.fieldsErrors.forEach((err) => {
              formikHelpers.setFieldError(err.field, err.error)
            })
          }
        })
    },
  })
  return { formik, isLoggedIn }
}
