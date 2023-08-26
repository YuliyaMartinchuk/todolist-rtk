import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export type PropsType = {
    callBack: (newTitle: string) => void
    disabled?:boolean
}

export const AddItemForm = memo((props: PropsType) => {
    // console.log("AddItemForm")
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const addTask = () => {
        let newTitle = title.trim();
        if (newTitle !== "") {
            props.callBack(newTitle);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) setError(null);
        if (e.charCode === 13) {
            addTask();
        }
    }

    const muiStyles = {
        maxWidth: '40px',
        maxHeight: '40px',
        minWidth: '40px',
        minHeight: '40px',
        backgroundColor: "black"
    }

    return (
        <div>
            <TextField
                error={!!error}
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
                disabled={props.disabled}
                id="outlined-basic"
                label={error ? "Title is required" : "Type out smth."}
                variant="outlined"
                size="small"/>
            <Button variant="contained" onClick={addTask} style={muiStyles} disabled={props.disabled}>+</Button>
        </div>

    );
})

