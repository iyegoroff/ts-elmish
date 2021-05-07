import { Effect } from '@ts-elmish/railway-effects'
import { pipe } from 'pipe-ts'
import { Dict } from 'ts-micro-dict'
import { AsyncResult } from 'ts-railway'
import { Todo, TodoDict } from '../../../domain/todos/types'
import { Effects } from '../../effects/types'

type State = {
  readonly text: string
  readonly allTodosCompleted?: boolean
}

type Action =
  | readonly ['set-text', string]
  | readonly ['add-todo']
  | readonly ['set-all-todos-completed', boolean]
  | readonly ['todo-dict-changed', TodoDict]

// #region Action
const Action = {
  setText: (arg0: string): Action => ['set-text', arg0],
  addTodo: (): Action => ['add-todo'],
  setAllTodosCompleted: (arg0: boolean): Action => ['set-all-todos-completed', arg0],
  todoDictChanged: (arg0: TodoDict): Action => ['todo-dict-changed', arg0]
} as const
// #endregion

type Command = readonly [State, Effect<Action>]

const init = ({ Todos: { loadTodoDict } }: Effects): Command => {
  return [
    { text: '' },
    Effect.from({
      asyncResult: loadTodoDict,
      success: Action.todoDictChanged
    })
  ]
}

const setTextUpdate = (state: State, [, text]: readonly ['set-text', string]): Command => {
  return [{ ...state, text }, Effect.none()]
}

const addTodoUpdate = (
  { text, ...state }: State,
  _action: readonly ['add-todo'],
  { Todos: { addTodo } }: Effects
): Command => {
  return [
    { ...state, text: '' },
    Effect.from({
      asyncResult: () => addTodo(text)
    })
  ]
}

const setAllTodosCompletedUpdate = (
  state: State,
  [, allTodosCompleted]: readonly ['set-all-todos-completed', boolean],
  { Todos: { loadTodoDict, updateTodoDict } }: Effects
): Command => {
  return [
    { ...state, allTodosCompleted },
    Effect.from({
      asyncResult: pipe(
        loadTodoDict,
        AsyncResult.map(Dict.map((todo: Todo) => ({ ...todo, completed: allTodosCompleted }))),
        AsyncResult.map(updateTodoDict)
      )
    })
  ]
}

const todoDictChangedUpdate = (
  state: State,
  [, todoDict]: readonly ['todo-dict-changed', TodoDict]
): Command => {
  const allTodosCompleted = Dict.every(({ completed }) => completed, todoDict)
  return [{ ...state, allTodosCompleted }, Effect.none()]
}

// #region update
const update = (state: State, action: Action, effects: Effects): Command => {
  switch (action[0]) {
    case 'set-text':
      return setTextUpdate(state, action)

    case 'add-todo':
      return addTodoUpdate(state, action, effects)

    case 'set-all-todos-completed':
      return setAllTodosCompletedUpdate(state, action, effects)

    case 'todo-dict-changed':
      return todoDictChangedUpdate(state, action)
  }
}
// #endregion

export type TodoInputState = State
export type TodoInputAction = Action

export const TodoInputState = { init, update } as const
export const TodoInputAction = Action
