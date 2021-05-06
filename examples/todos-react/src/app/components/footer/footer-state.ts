import { Effect } from '@ts-elmish/railway-effects'
import { pipeWith } from 'pipe-ts'
import { Dict } from 'ts-micro-dict'
import { TodoFilter, TodoList } from '../../../domain/todos/types'
import { Effects } from '../../effects/types'

type State = {
  readonly activeTodosAmount?: number
  readonly selectedTodoFilter?: TodoFilter
}

type Action =
  | readonly ['set-selected-todo-filter', TodoFilter]
  | readonly ['todo-list-changed', TodoList]

// #region Action
const Action = {
  setSelectedTodoFilter: (arg0: TodoFilter): Action => ['set-selected-todo-filter', arg0],
  todoListChanged: (arg0: TodoList): Action => ['todo-list-changed', arg0]
} as const
// #endregion

type Command = readonly [State, Effect<Action>]

const init = ({ Todos: { loadTodoFilter, loadTodoList } }: Effects): Command => {
  return [
    {},
    Effect.batch(
      Effect.from({
        result: loadTodoFilter,
        success: Action.setSelectedTodoFilter
      }),
      Effect.from({
        asyncResult: loadTodoList,
        success: Action.todoListChanged
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

const todoListChangedUpdate = (
  state: State,
  [, todos]: readonly ['todo-list-changed', TodoList]
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

    case 'todo-list-changed':
      return todoListChangedUpdate(state, action)
  }
}
// #endregion

export type FooterState = State
export type FooterAction = Action

export const FooterState = { init, update } as const
export const FooterAction = Action
