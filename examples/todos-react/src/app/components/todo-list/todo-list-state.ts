import { Effect } from '@ts-elmish/railway-effects'
import { Dict } from 'ts-micro-dict'
import { TodoFilter, TodoDict, TodoFilterLoadError } from '../../../domain/todos/types'
import { Effects } from '../../effects/types'

type TodoKey = keyof TodoDict

type State = {
  readonly todos: TodoDict
  readonly editedTodoKey?: TodoKey
  readonly todoFilter: TodoFilter
}

type Action =
  | readonly ['set-todos', TodoDict]
  | readonly ['set-todo-filter', TodoFilter]
  | readonly ['start-todo-edit', TodoKey]
  | readonly ['confirm-todo-edit', TodoKey, string]
  | readonly ['cancel-todo-edit']
  | readonly ['remove-todo', TodoKey]
  | readonly ['toggle-completed', TodoKey]
  | readonly ['show-todo-filter-alert', TodoFilterLoadError]

// #region Action
const Action = {
  setTodos: (arg0: TodoDict): Action => ['set-todos', arg0],
  setTodoFilter: (arg0: TodoFilter): Action => ['set-todo-filter', arg0],
  startTodoEdit: (arg0: TodoKey): Action => ['start-todo-edit', arg0],
  confirmTodoEdit: (arg0: TodoKey, arg1: string): Action => ['confirm-todo-edit', arg0, arg1],
  cancelTodoEdit: (): Action => ['cancel-todo-edit'],
  removeTodo: (arg0: TodoKey): Action => ['remove-todo', arg0],
  toggleCompleted: (arg0: TodoKey): Action => ['toggle-completed', arg0],
  showTodoFilterAlert: (arg0: TodoFilterLoadError): Action => ['show-todo-filter-alert', arg0]
} as const
// #endregion

type Command = readonly [State, Effect<Action>]

const init = (todos: TodoDict, todoFilter: TodoFilter): Command => {
  return [{ todos, todoFilter }, Effect.none()]
}

const setTodoFilterUpdate = (
  state: State,
  [, todoFilter]: readonly ['set-todo-filter', TodoFilter]
): Command => {
  return [state.todoFilter === todoFilter ? state : { ...state, todoFilter }, Effect.none()]
}

const startTodoEditUpdate = (
  state: State,
  [, key]: readonly ['start-todo-edit', TodoKey]
): Command => {
  const { todos } = state
  const todo = todos[key]

  if (todo === undefined) {
    return [state, Effect.none()]
  }

  return [{ ...state, editedTodoKey: key }, Effect.none()]
}

const confirmTodoEditUpdate = (
  state: State,
  [, key, text]: readonly ['confirm-todo-edit', TodoKey, string],
  { Todos: { updateTodo } }: Effects
): Command => {
  const { todos } = state
  const todo = todos[key]

  if (todo === undefined) {
    return [state, Effect.none()]
  }

  const updatedTodo = { ...todo, text }

  return [
    { ...state, todos: Dict.put(key, updatedTodo, todos), editedTodoKey: undefined },
    Effect.from({
      result: () => updateTodo(key, updatedTodo)
    })
  ]
}

const cancelTodoEditUpdate = (state: State, _action: readonly ['cancel-todo-edit']): Command => {
  return [{ ...state, editedTodoKey: undefined }, Effect.none()]
}

const removeTodoUpdate = (
  state: State,
  [, key]: readonly ['remove-todo', TodoKey],
  { Todos: { removeTodo } }: Effects
): Command => {
  return [
    { ...state, todos: Dict.omit(key, state.todos) },
    Effect.from({
      result: () => removeTodo(key)
    })
  ]
}

const setTodosUpdate = (
  state: State,
  [, todos]: readonly ['set-todos', TodoDict],
  { Todos: { compareTodos } }: Effects
): Command => {
  return [
    Dict.isEqual(state.todos, todos, compareTodos) ? state : { ...state, todos },
    Effect.none()
  ]
}

const toggleCompletedUpdate = (
  state: State,
  [, key]: readonly ['toggle-completed', TodoKey],
  { Todos: { updateTodo } }: Effects
): Command => {
  const { todos } = state
  const todo = todos[key]

  if (todo === undefined) {
    return [state, Effect.none()]
  }

  const updatedTodo = { ...todo, completed: !todo.completed }

  return [
    { ...state, todos: Dict.put(key, updatedTodo, todos) },
    Effect.from({ result: () => updateTodo(key, updatedTodo) })
  ]
}

const showTodoFilterAlertUpdate = (
  state: State,
  [, message]: readonly ['show-todo-filter-alert', TodoFilterLoadError],
  { Alert: { showError } }: Effects
): Command => {
  return [state, Effect.from({ result: () => showError(message) })]
}

// #region update
const update = (state: State, action: Action, effects: Effects): Command => {
  switch (action[0]) {
    case 'set-todos':
      return setTodosUpdate(state, action, effects)

    case 'set-todo-filter':
      return setTodoFilterUpdate(state, action)

    case 'start-todo-edit':
      return startTodoEditUpdate(state, action)

    case 'confirm-todo-edit':
      return confirmTodoEditUpdate(state, action, effects)

    case 'cancel-todo-edit':
      return cancelTodoEditUpdate(state, action)

    case 'remove-todo':
      return removeTodoUpdate(state, action, effects)

    case 'toggle-completed':
      return toggleCompletedUpdate(state, action, effects)

    case 'show-todo-filter-alert':
      return showTodoFilterAlertUpdate(state, action, effects)
  }
}
// #endregion

export type TodoListState = State
export type TodoListAction = Action

export const TodoListState = { init, update } as const
export const TodoListAction = Action
