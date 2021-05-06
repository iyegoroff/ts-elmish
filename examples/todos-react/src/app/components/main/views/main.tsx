import React from 'react'
import { ElmishMemo, ElmishProps } from '@ts-elmish/react'
import { pipe } from 'pipe-ts'
import { MainState, MainAction } from '../main-state'
import { Footer } from '../../footer'
import { TodoInput } from '../../todo-input'
import { TodoList } from '../../todo-list'
import { header, main } from './main.css'

export const Main: React.FunctionComponent<ElmishProps<MainState, MainAction>> = ElmishMemo(
  function Main({ dispatch, footer, todoInput, todoList }) {
    return (
      <div className={main}>
        <h1 className={header}>todos</h1>
        <TodoInput {...todoInput} dispatch={pipe(MainAction.todoInputAction, dispatch)} />
        <TodoList {...todoList} dispatch={pipe(MainAction.todoListAction, dispatch)} />
        <Footer {...footer} dispatch={pipe(MainAction.footerAction, dispatch)} />
      </div>
    )
  }
)
