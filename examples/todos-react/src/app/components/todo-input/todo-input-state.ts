import { Effect } from '@ts-elmish/railway-effects'
import { pipe } from 'pipe-ts'
import { Dict } from 'ts-micro-dict'
import { AsyncResult } from 'ts-railway'
import { Todo, TodoList } from '../../../domain/todos/types'
import { Effects } from '../../effects/types'

type State = {
  readonly text: string
  readonly allTodosCompleted?: boolean
}

type Action =
  | readonly ['set-text', string]
  | readonly ['add-todo']
  | readonly ['set-all-todos-completed', boolean]
  | readonly ['todo-list-changed', TodoList]

// #region Action
const Action = {
  setText: (arg0: string): Action => ['set-text', arg0],
  addTodo: (): Action => ['add-todo'],
  setAllTodosCompleted: (arg0: boolean): Action => ['set-all-todos-completed', arg0],
  todoListChanged: (arg0: TodoList): Action => ['todo-list-changed', arg0]
} as const
// #endregion

type Command = readonly [State, Effect<Action>]

const init = ({ Todos: { loadTodoList } }: Effects): Command => {
  return [
    { text: '' },
    Effect.from({
      asyncResult: loadTodoList,
      success: Action.todoListChanged
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
  { Todos: { loadTodoList, updateTodoList } }: Effects
): Command => {
  return [
    { ...state, allTodosCompleted },
    Effect.from({
      asyncResult: pipe(
        loadTodoList,
        AsyncResult.map(Dict.map((todo: Todo) => ({ ...todo, completed: allTodosCompleted }))),
        AsyncResult.map(updateTodoList)
      )
    })
  ]
}

const todoListChangedUpdate = (
  state: State,
  [, todoList]: readonly ['todo-list-changed', TodoList]
): Command => {
  const allTodosCompleted = Dict.every(({ completed }) => completed, todoList)
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

    case 'todo-list-changed':
      return todoListChangedUpdate(state, action)
  }
}
// #endregion

export type TodoInputState = State
export type TodoInputAction = Action

export const TodoInputState = { init, update } as const
export const TodoInputAction = Action
