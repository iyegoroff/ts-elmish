import { Effect } from '@ts-elmish/railway-effects'
import { TodoFilter, TodoList } from '../../../domain/todos/types'
import { Effects } from '../../effects/types'

type State = {
  readonly todos: TodoList
  readonly todoFilter: TodoFilter
}

// type Action = | readonly ['set-todos', TodoList] | readonly ['set-todo-filter', TodoFilter] | readonly ['todo-action', keyof TodoList, T]

// #region Action
const Action = {} as const
// #endregion

type Command = readonly [State, Effect<Action>]

const init = (_effects: Effects): Command => {
  return [0, Effect.none()]
}

// #region update
const update = (state: State, _action: Action, _effects: Effects): Command => {
  return [state, Effect.none()]
}
// #endregion

export type TodoListState = State
export type TodoListAction = Action

export const TodoListState = { init, update } as const
export const TodoListAction = Action
