import React, { useEffect } from 'react'
import { ElmishMemo, ElmishProps } from '@ts-elmish/react'
import { pipe } from 'pipe-ts'
import { TodoListState, TodoListAction } from '../todo-list-state'
import { Domain } from '../../../../domain'

const {
  Todos: { listenTodoDictChanges, listenTodoFilterChanges }
} = Domain

export const TodoList: React.FunctionComponent<
  ElmishProps<TodoListState, TodoListAction>
> = ElmishMemo(function TodoList({ dispatch }) {
  useEffect(
    () =>
      listenTodoDictChanges({
        success: pipe(TodoListAction.setTodos, dispatch)
      }),
    []
  )

  useEffect(
    () =>
      listenTodoFilterChanges({
        success: pipe(TodoListAction.setTodoFilter, dispatch)
      }),
    []
  )

  return <div>TodoList</div>
})
