import React from 'react'
import { ElmishMemo, ElmishProps } from '@ts-elmish/react'
import { TodoListState, TodoListAction } from '../todo-list-state'

export const TodoList: React.FunctionComponent<
  ElmishProps<TodoListState, TodoListAction>
> = ElmishMemo(function TodoList() {
  return <div>TodoList</div>
})
