import React, { ChangeEvent, KeyboardEvent, memo, useState } from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { BaseResponseType } from "common/types"

export type Props = {
  callBack: (newTitle: string) => Promise<any>
  disabled?: boolean
}

export const AddItemForm: React.FC<Props> = memo(({ callBack, disabled }) => {
  let [title, setTitle] = useState("")
  let [error, setError] = useState<string | null>(null)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const addItemHandler = () => {
    let newTitle = title.trim()
    if (newTitle !== "") {
      callBack(newTitle)
        .then((res) => {
          setTitle("")
        })
        .catch((e: BaseResponseType) => {
          setError(e.messages[0])
        })
    } else {
      setError("Title is required")
    }
  }

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error) setError(null)
    if (e.charCode === 13) {
      addItemHandler()
    }
  }

  const muiStyles = {
    maxWidth: "40px",
    maxHeight: "40px",
    minWidth: "40px",
    minHeight: "40px",
    backgroundColor: "black",
  }

  return (
    <div>
      <TextField
        error={!!error}
        value={title}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        disabled={disabled}
        id="outlined-basic"
        label={error ? "Title is required" : "Type out smth."}
        variant="outlined"
        size="small"
      />
      <Button variant="contained" onClick={addItemHandler} style={muiStyles} disabled={disabled}>
        +
      </Button>
    </div>
  )
})
