import React, { ChangeEvent, useCallback, KeyboardEvent, useEffect } from 'react'
import { ElmishProps } from '@ts-elmish/react'
import { pipe } from 'pipe-ts'
import { isDefined } from 'ts-is-defined'
import { usePipe } from 'use-pipe-ts'
import { TodoInputState, TodoInputAction } from '../todo-input-state'
import { noRender } from '../../../../util'
import { Effects } from '../../../effects'
import { todoInput } from './todo-input.css'

const {
  Todos: { listenTodoDictChanges }
} = Effects

const changeEventValue = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => value

export const TodoInput: React.FunctionComponent<ElmishProps<TodoInputState, TodoInputAction>> =
  React.memo(function TodoInput({ dispatch, text, allTodosCompleted }) {
    useEffect(
      () =>
        listenTodoDictChanges({
          success: pipe(TodoInputAction.todoDictChanged, dispatch)
        }),
      [dispatch]
    )

    const onChange = usePipe(changeEventValue, TodoInputAction.setText, dispatch)

    const onKeyPress = useCallback(
      ({ code }: KeyboardEvent) =>
        code === 'Enter' ? dispatch(TodoInputAction.addTodo()) : undefined,
      [dispatch]
    )

    if (!isDefined(allTodosCompleted)) {
      return noRender
    }

    console.log('render TodoInput')

    return (
      <input
        className={todoInput}
        placeholder={'What needs to be done?'}
        value={text}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    )
  })
