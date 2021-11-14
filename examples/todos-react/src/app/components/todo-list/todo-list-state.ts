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

type Command = readonly [State, Effect<Action>]

const init = (todos: TodoDict, todoFilter: TodoFilter): Command => {
  return [{ todos, todoFilter }, Effect.none()]
}

const update = (state: State, action: Action, effects: Effects): Command => {
  switch (action[0]) {
    case 'set-todos': {
      const {
        Todos: { compareTodos }
      } = effects
      const [, todos] = action

      return [
        Dict.isEqual(state.todos, todos, compareTodos) ? state : { ...state, todos },
        Effect.none()
      ]
    }

    case 'set-todo-filter': {
      const [, todoFilter] = action

      return [state.todoFilter === todoFilter ? state : { ...state, todoFilter }, Effect.none()]
    }

    case 'start-todo-edit': {
      const { todos } = state
      const [, key] = action

      const todo = todos[key]

      if (todo === undefined) {
        return [state, Effect.none()]
      }

      return [{ ...state, editedTodoKey: key }, Effect.none()]
    }

    case 'confirm-todo-edit': {
      const {
        Todos: { updateTodo }
      } = effects
      const { todos } = state
      const [, key, text] = action

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

    case 'cancel-todo-edit': {
      return [{ ...state, editedTodoKey: undefined }, Effect.none()]
    }

    case 'remove-todo': {
      const {
        Todos: { removeTodo }
      } = effects
      const [, key] = action

      return [
        { ...state, todos: Dict.omit(key, state.todos) },
        Effect.from({
          result: () => removeTodo(key)
        })
      ]
    }

    case 'toggle-completed': {
      const {
        Todos: { updateTodo }
      } = effects
      const [, key] = action
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

    case 'show-todo-filter-alert': {
      const {
        Alert: { showError }
      } = effects
      const [, message] = action

      return [state, Effect.from({ result: () => showError(message) })]
    }
  }
}

export type TodoListState = State
export type TodoListAction = Action

export const TodoListState = { init, update } as const
export const TodoListAction = Action
