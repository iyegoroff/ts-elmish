import React, { useEffect } from 'react'
import { ElmishMemo, ElmishProps } from '@ts-elmish/react'
import { pipe } from 'pipe-ts'
import { isDefined } from 'ts-is-defined'
import { FooterState, FooterAction } from '../footer-state'
import { Domain } from '../../../../domain'
import { noRender } from '../../../../util'
import { clearCompleted, footer, todoFilter, todoFilterItem } from './footer.css'

const {
  Todos: { listenTodoFilterChanges, listenTodoDictChanges }
} = Domain

export const Footer: React.FunctionComponent<ElmishProps<FooterState, FooterAction>> = ElmishMemo(
  function Footer({ dispatch, activeTodosAmount, selectedTodoFilter }) {
    useEffect(
      () =>
        listenTodoFilterChanges({
          success: pipe(FooterAction.setSelectedTodoFilter, dispatch)
        }),
      []
    )

    useEffect(
      () =>
        listenTodoDictChanges({
          success: pipe(FooterAction.todoDictChanged, dispatch)
        }),
      []
    )

    return isDefined(activeTodosAmount) && isDefined(selectedTodoFilter) ? (
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
        <button className={clearCompleted}>Clear completed</button>
      </div>
    ) : (
      noRender
    )
  }
)
