import type {Meta, StoryObj} from '@storybook/react';
import {action} from '@storybook/addon-actions'


import React, {ChangeEvent, FC, KeyboardEvent, useState} from "react";
import TextField from "@mui/material/TextField/TextField";
import {AddItemForm, PropsType} from "../components/AddItemForm";
import Button from "@mui/material/Button";


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof AddItemForm> = {
    title: 'TODOLIST/AddItemForm',
    component: AddItemForm,
    // This component will have an automatically generated  entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    // tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        callBack: {
            description: "Button clicked inside form",
            action:"clicked"
        },
    },
};

export default meta;
type Story = StoryObj<typeof AddItemForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const AddItemFormStory: Story = {
    // More on args: https://storybook.js.org/docs/react/writing-stories/args
    args: {
        callBack: action("Button clicked inside form")
    }
};

const AddItemFormError: FC<PropsType> =  (props)=>{

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
        if (e.charCode  === 13) {
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
                id="outlined-basic"
                label={error ? "Title is required" : "Type out smth."}
                variant="outlined"
                size="small"/>
            <Button variant="contained" onClick={addTask} style={muiStyles}>+</Button>
        </div>

    );
}

export const AddItemFormErrorStory:Story = {
    render: (args)=> <AddItemFormError callBack={args.callBack}/>
}


