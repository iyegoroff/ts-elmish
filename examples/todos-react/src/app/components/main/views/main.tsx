import React from 'react'
import { ElmishProps } from '@ts-elmish/react'
import { usePipe } from 'use-pipe-ts'
import { MainState, MainAction } from '../main-state'
import { Footer } from '../../footer'
import { TodoInput } from '../../todo-input'
import { TodoList } from '../../todo-list'
import { header, main } from './main.css'

export const Main: React.FunctionComponent<ElmishProps<MainState, MainAction>> = React.memo(
  function Main({ dispatch, ...state }) {
    const todoInputDispatch = usePipe(MainAction.todoInputAction, dispatch)

    const todoListDispatch = usePipe(MainAction.todoListAction, dispatch)

    const footerDispatch = usePipe(MainAction.footerAction, dispatch)

    if ('loading' in state) {
      // eslint-disable-next-line no-null/no-null
      return null
    }

    const { todoInput, todoList, footer } = state

    console.log('render main')

    return (
      <div className={main}>
        <h1 className={header}>todos</h1>
        <TodoInput {...todoInput} dispatch={todoInputDispatch} />
        <TodoList {...todoList} dispatch={todoListDispatch} />
        <Footer {...footer} dispatch={footerDispatch} />
      </div>
    )
  }
)
