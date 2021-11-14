import { Effect } from '@ts-elmish/railway-effects'
import { pipe } from 'pipe-ts'
import { AsyncResult } from 'ts-railway'
import { Dict } from 'ts-micro-dict'
import { TodoFilter, TodoDict, TodoFilterLoadError, Todo } from '../../../domain/todos/types'
import { Effects } from '../../effects/types'

type State = {
  readonly activeTodosAmount: number
  readonly hasCompletedTodos: boolean
  readonly todoFilter: TodoFilter
}

type Action =
  | readonly ['set-todo-filter', TodoFilter]
  | readonly ['todo-dict-changed', TodoDict]
  | readonly ['clear-completed-todos']
  | readonly ['handle-todo-filter-alert', TodoFilterLoadError]

const Action = {
  setTodoFilter: (arg0: TodoFilter): Action => ['set-todo-filter', arg0],
  todoDictChanged: (arg0: TodoDict): Action => ['todo-dict-changed', arg0],
  clearCompletedTodos: (): Action => ['clear-completed-todos'],
  handleTodoFilterAlert: (arg0: TodoFilterLoadError): Action => ['handle-todo-filter-alert', arg0]
} as const

type Command = readonly [State, Effect<Action>]

const activeTodosAmount = pipe(
  Dict.filter<Todo>(({ completed }) => !completed),
  Dict.length
)

const hasCompletedTodos = (todos: TodoDict) => Dict.length(todos) - activeTodosAmount(todos) > 0

const init = (todos: TodoDict, todoFilter: TodoFilter): Command => {
  return [
    {
      todoFilter,
      activeTodosAmount: activeTodosAmount(todos),
      hasCompletedTodos: hasCompletedTodos(todos)
    },
    Effect.none()
  ]
}

const update = (state: State, action: Action, effects: Effects): Command => {
  switch (action[0]) {
    case 'set-todo-filter': {
      const [, todoFilter] = action

      return [state.todoFilter === todoFilter ? state : { ...state, todoFilter }, Effect.none()]
    }

    case 'todo-dict-changed': {
      const [, todos] = action

      const activeAmount = activeTodosAmount(todos)
      const hasCompleted = hasCompletedTodos(todos)

      return [
        hasCompleted !== state.hasCompletedTodos || activeAmount !== state.activeTodosAmount
          ? { ...state, activeTodosAmount: activeAmount, hasCompletedTodos: hasCompleted }
          : state,
        Effect.none()
      ]
    }

    case 'clear-completed-todos': {
      const {
        Todos: { clearCompleted }
      } = effects

      return [state, Effect.from({ result: clearCompleted })]
    }

    case 'handle-todo-filter-alert': {
      const {
        Alert: { showError },
        Todos: { updateTodoFilter }
      } = effects
      const [, message] = action

      return [
        state,
        Effect.from({
          result: () =>
            AsyncResult.flatMap(() => updateTodoFilter(state.todoFilter), showError(message))
        })
      ]
    }
  }
}

export type FooterState = State
export type FooterAction = Action

export const FooterState = { init, update } as const
export const FooterAction = Action
