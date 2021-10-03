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

// #region Action
const Action = {
  setTodoFilter: (arg0: TodoFilter): Action => ['set-todo-filter', arg0],
  todoDictChanged: (arg0: TodoDict): Action => ['todo-dict-changed', arg0],
  clearCompletedTodos: (): Action => ['clear-completed-todos'],
  handleTodoFilterAlert: (arg0: TodoFilterLoadError): Action => ['handle-todo-filter-alert', arg0]
} as const
// #endregion

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

const setTodoFilterUpdate = (
  state: State,
  [, todoFilter]: readonly ['set-todo-filter', TodoFilter]
): Command => {
  return [state.todoFilter === todoFilter ? state : { ...state, todoFilter }, Effect.none()]
}

const todoDictChangedUpdate = (
  state: State,
  [, todos]: readonly ['todo-dict-changed', TodoDict]
): Command => {
  const activeAmount = activeTodosAmount(todos)

  const hasCompleted = hasCompletedTodos(todos)

  return [
    hasCompleted !== state.hasCompletedTodos || activeAmount !== state.activeTodosAmount
      ? { ...state, activeTodosAmount: activeAmount, hasCompletedTodos: hasCompleted }
      : state,
    Effect.none()
  ]
}

const handleTodoFilterAlertUpdate = (
  state: State,
  [, message]: readonly ['handle-todo-filter-alert', TodoFilterLoadError],
  { Alert: { showError }, Todos: { updateTodoFilter } }: Effects
): Command => {
  return [
    state,
    Effect.from({
      result: () =>
        AsyncResult.flatMap(() => updateTodoFilter(state.todoFilter), showError(message))
    })
  ]
}

const clearCompletedTodosUpdate = (
  state: State,
  _action: readonly ['clear-completed-todos'],
  { Todos: { clearCompleted } }: Effects
): Command => {
  return [state, Effect.from({ result: clearCompleted })]
}

// #region update
const update = (state: State, action: Action, effects: Effects): Command => {
  switch (action[0]) {
    case 'set-todo-filter':
      return setTodoFilterUpdate(state, action)

    case 'todo-dict-changed':
      return todoDictChangedUpdate(state, action)

    case 'clear-completed-todos':
      return clearCompletedTodosUpdate(state, action, effects)

    case 'handle-todo-filter-alert':
      return handleTodoFilterAlertUpdate(state, action, effects)
  }
}
// #endregion

export type FooterState = State
export type FooterAction = Action

export const FooterState = { init, update } as const
export const FooterAction = Action
