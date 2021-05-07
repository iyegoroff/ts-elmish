import React from 'react'
import { ElmishMemo, ElmishProps } from '@ts-elmish/react'
import { TodoState, TodoAction } from '../todo-state'

export const Todo: React.FunctionComponent<ElmishProps<TodoState, TodoAction>> = ElmishMemo(
  function Todo({ text }) {
    return <div>{text}</div>
  }
)
