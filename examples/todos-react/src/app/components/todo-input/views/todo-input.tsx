import React, { ChangeEvent, useCallback, KeyboardEvent, useEffect } from 'react'
import { ElmishProps } from '@ts-elmish/react'
import { pipe } from 'pipe-ts'
import { usePipe } from 'use-pipe-ts'
import { TodoInputState, TodoInputAction } from '../todo-input-state'
import { Effects } from '../../../effects'
import { container, todoInput, toggleAll, toggleLabel } from './todo-input.css'

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

    const onToggleAll = usePipe(TodoInputAction.toggleAllTodosCompleted, dispatch)

    const onChange = usePipe(changeEventValue, TodoInputAction.setText, dispatch)

    const onKeyPress = useCallback(
      ({ code }: KeyboardEvent) =>
        code === 'Enter' ? dispatch(TodoInputAction.addTodo()) : undefined,
      [dispatch]
    )

    console.log('render TodoInput')

    return (
      <div className={container}>
        <button className={toggleAll} onClick={onToggleAll}>
          <div className={toggleLabel[allTodosCompleted ? 'selected' : 'unselected']}>❯</div>
        </button>
        <input
          className={todoInput}
          placeholder={'What needs to be done?'}
          value={text}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      </div>
    )
  })
