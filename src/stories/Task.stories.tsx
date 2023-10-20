import type { Meta, StoryObj } from "@storybook/react"
import React, { FC, useState } from "react"
import { Props, Task } from "features/TodolistsList/ui/Todolist/Tasks/Task/Task"
import { TaskPriorities, TaskStatuses } from "common/enums"
import { ReduxStoreProviderDecorator } from "common/utils"

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Task> = {
  title: "TODOLISTS/Task",
  component: Task,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  args: {
    task: {
      id: "adsw",
      title: "JS",
      status: TaskStatuses.Completed,
      description: "",
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: "1",
      order: 0,
      addedDate: "",
      entityStatus: "idle",
    },
    todolistId: "olh",
  },
  decorators: [ReduxStoreProviderDecorator],
}

export default meta
type Story = StoryObj<typeof Task>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const TaskIsDoneStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
}

export const TaskIsNotStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    task: {
      id: "adsw",
      title: "CSS",
      status: TaskStatuses.New,
      description: "",
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: "1",
      order: 0,
      addedDate: "",
      entityStatus: "idle",
    },
    todolistId: "olh",
  },
}

const TaskWithHook: FC<Props> = (args) => {
  const [task, setTask] = useState(args.task)

  const changeTaskStatus = () => {
    setTask({ ...task, status: TaskStatuses.New }) //??
  }
  const updateTask = (taskId: string, updateTitle: string) => {
    setTask({ ...task, title: updateTitle })
  }

  return <Task task={task} todolistId={args.todolistId} />
}

export const TaskWithHookStory: Story = {
  render: (args) => <TaskWithHook task={args.task} todolistId={args.todolistId} />,
}
