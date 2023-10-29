import React, { ChangeEvent, KeyboardEvent, memo, useState } from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { RejectValueType } from "common/utils"

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
        .catch((e: RejectValueType) => {
          if (e.data) {
            const messages = e.data.messages
            setError(messages.length ? messages[0] : "Some error occurred")
          }
        })
    } else {
      setError("Title is required")
    }
  }

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error) setError(null)
    if (e.key === "Enter") {
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
        onKeyDown={onKeyDownHandler}
        disabled={disabled}
        id="outlined-basic"
        label={"Type value"}
        variant="outlined"
        size="small"
        helperText={error}
      />
      <Button variant="contained" onClick={addItemHandler} style={muiStyles} disabled={disabled}>
        +
      </Button>
    </div>
  )
})
