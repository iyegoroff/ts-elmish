import React, { useEffect } from 'react'
import { ElmishProps } from '@ts-elmish/react'
import { pipe } from 'pipe-ts'
import { isDefined } from 'ts-is-defined'
import { FooterState, FooterAction } from '../footer-state'
import { noRender } from '../../../../util'
import { Effects } from '../../../effects'
import { clear, footer, todoFilter, todoFilterItem } from './footer.css'

const {
  Todos: { listenTodoFilterChanges, listenTodoDictChanges, clearCompleted }
} = Effects

export const Footer: React.FunctionComponent<ElmishProps<FooterState, FooterAction>> = React.memo(
  function Footer({ dispatch, activeTodosAmount, selectedTodoFilter, hasCompletedTodos }) {
    useEffect(
      () =>
        listenTodoFilterChanges({
          success: pipe(FooterAction.setSelectedTodoFilter, dispatch)
        }),
      [dispatch]
    )

    useEffect(
      () =>
        listenTodoDictChanges({
          success: pipe(FooterAction.todoDictChanged, dispatch)
        }),
      [dispatch]
    )

    if (
      !(
        isDefined(hasCompletedTodos) &&
        isDefined(activeTodosAmount) &&
        isDefined(selectedTodoFilter)
      )
    ) {
      return noRender
    }

    console.log('render footer')

    return (
      <div className={footer}>
        <div>
          {activeTodosAmount} item{activeTodosAmount === 1 ? '' : 's'} left
        </div>
        <div className={todoFilter}>
          <a
            className={todoFilterItem[selectedTodoFilter === 'all' ? 'selected' : 'unselected']}
            href={'#/'}
          >
            All
          </a>
          <a
            className={todoFilterItem[selectedTodoFilter === 'active' ? 'selected' : 'unselected']}
            href={'#/active'}
          >
            Active
          </a>
          <a
            className={
              todoFilterItem[selectedTodoFilter === 'completed' ? 'selected' : 'unselected']
            }
            href={'#/completed'}
          >
            Completed
          </a>
        </div>
        <button
          className={clear[hasCompletedTodos ? 'visible' : 'hidden']}
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      </div>
    )
  }
)
