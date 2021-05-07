import { Effect } from '@ts-elmish/railway-effects'
import { pipeWith } from 'pipe-ts'
import { Dict } from 'ts-micro-dict'
import { TodoFilter, TodoDict } from '../../../domain/todos/types'
import { Effects } from '../../effects/types'

type State = {
  readonly activeTodosAmount?: number
  readonly selectedTodoFilter?: TodoFilter
}

type Action =
  | readonly ['set-selected-todo-filter', TodoFilter]
  | readonly ['todo-dict-changed', TodoDict]

// #region Action
const Action = {
  setSelectedTodoFilter: (arg0: TodoFilter): Action => ['set-selected-todo-filter', arg0],
  todoDictChanged: (arg0: TodoDict): Action => ['todo-dict-changed', arg0]
} as const
// #endregion

type Command = readonly [State, Effect<Action>]

const init = ({ Todos: { loadTodoFilter, loadTodoDict } }: Effects): Command => {
  return [
    {},
    Effect.batch(
      Effect.from({
        result: loadTodoFilter,
        success: Action.setSelectedTodoFilter
      }),
      Effect.from({
        asyncResult: loadTodoDict,
        success: Action.todoDictChanged
      })
    )
  ]
}

const setSelectedTodoFilterUpdate = (
  state: State,
  [, selectedTodoFilter]: readonly ['set-selected-todo-filter', TodoFilter]
): Command => {
  return [{ ...state, selectedTodoFilter }, Effect.none()]
}

const todoDictChangedUpdate = (
  state: State,
  [, todos]: readonly ['todo-dict-changed', TodoDict]
): Command => {
  const activeTodosAmount = pipeWith(
    todos,
    Dict.filter(({ completed }) => !completed),
    Dict.length
  )

  return [{ ...state, activeTodosAmount }, Effect.none()]
}

// #region update
const update = (state: State, action: Action): Command => {
  switch (action[0]) {
    case 'set-selected-todo-filter':
      return setSelectedTodoFilterUpdate(state, action)

    case 'todo-dict-changed':
      return todoDictChangedUpdate(state, action)
  }
}
// #endregion

export type FooterState = State
export type FooterAction = Action

export const FooterState = { init, update } as const
export const FooterAction = Action
