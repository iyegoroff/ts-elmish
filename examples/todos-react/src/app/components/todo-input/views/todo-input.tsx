import React, { ChangeEvent, useCallback, KeyboardEvent, useEffect } from 'react'
import { ElmishMemo, ElmishProps } from '@ts-elmish/react'
import { pipe } from 'pipe-ts'
import { isDefined } from 'ts-is-defined'
import { TodoInputState, TodoInputAction } from '../todo-input-state'
import { Domain } from '../../../../domain'
import { noRender } from '../../../../util'
import { todoInput } from './todo-input.css'

const {
  Todos: { listenTodoDictChanges }
} = Domain

export const TodoInput: React.FunctionComponent<
  ElmishProps<TodoInputState, TodoInputAction>
> = ElmishMemo(function TodoInput({ dispatch, text, allTodosCompleted }) {
  useEffect(
    () =>
      listenTodoDictChanges({
        success: pipe(TodoInputAction.todoDictChanged, dispatch)
      }),
    []
  )

  const onChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      dispatch(TodoInputAction.setText(value)),
    []
  )

  const onKeyPress = useCallback(
    ({ code }: KeyboardEvent) =>
      code === 'Enter' ? dispatch(TodoInputAction.addTodo()) : undefined,
    []
  )

  return isDefined(allTodosCompleted) ? (
    <input
      className={todoInput}
      placeholder={'What needs to be done?'}
      value={text}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
  ) : (
    noRender
  )
})
