import { Effect } from '@ts-elmish/railway-effects'
import { AsyncResult } from 'ts-railway'
import { Effects } from '../../effects/types'
import { TodoInputAction, TodoInputState } from '../todo-input'
import { FooterAction, FooterState } from '../footer'
import { TodoListAction, TodoListState } from '../todo-list'
import { TodoDict, TodoFilter, TodoFilterLoadError } from '../../../domain/todos/types'

type State =
  | { readonly loading: true }
  | {
      readonly todoInput: TodoInputState
      readonly footer: FooterState
      readonly todoList: TodoListState
    }

type Action =
  | readonly ['load-data']
  | readonly ['data-loaded', readonly [TodoDict, TodoFilter]]
  | readonly ['handle-todo-filter-load-error', TodoFilterLoadError]
  | readonly ['todo-input-action', TodoInputAction]
  | readonly ['footer-action', FooterAction]
  | readonly ['todo-list-action', TodoListAction]

// #region Action
const Action = {
  loadData: (): Action => ['load-data'],
  dataLoaded: (arg0: readonly [TodoDict, TodoFilter]): Action => ['data-loaded', arg0],
  handleTodoFilterLoadError: (arg0: TodoFilterLoadError): Action => [
    'handle-todo-filter-load-error',
    arg0
  ],
  todoInputAction: (arg0: TodoInputAction): Action => ['todo-input-action', arg0],
  footerAction: (arg0: FooterAction): Action => ['footer-action', arg0],
  todoListAction: (arg0: TodoListAction): Action => ['todo-list-action', arg0]
} as const
// #endregion

type Command = readonly [State, Effect<Action>]

const init = (): Command => {
  return [{ loading: true }, Effect.from({ action: ['load-data'] })]
}

const loadDataUpdate = (
  state: State,
  _action: readonly ['load-data'],
  { Todos: { loadTodoDict, loadTodoFilter } }: Effects
): Command => {
  return [
    state,
    Effect.from({
      result: () => AsyncResult.combine(loadTodoDict(), loadTodoFilter()),
      success: Action.dataLoaded,
      failure: Action.handleTodoFilterLoadError
    })
  ]
}

const dataLoadedUpdate = (
  state: State,
  [, [todos, todoFilter]]: readonly ['data-loaded', readonly [TodoDict, TodoFilter]]
): Command => {
  if (!('loading' in state)) {
    return [state, Effect.none()]
  }

  const [todoInput, todoInputEffect] = TodoInputState.init(todos)
  const [footer, footerEffect] = FooterState.init(todos, todoFilter)
  const [todoList, todoListEffect] = TodoListState.init(todos, todoFilter)

  return [
    { todoInput, footer, todoList },
    Effect.batch(
      Effect.map(Action.todoInputAction, todoInputEffect),
      Effect.map(Action.footerAction, footerEffect),
      Effect.map(Action.todoListAction, todoListEffect)
    )
  ]
}

const todoInputUpdate = (
  state: State,
  [, action]: readonly ['todo-input-action', TodoInputAction],
  effects: Effects
): Command => {
  if ('loading' in state) {
    return [state, Effect.none()]
  }

  const [todoInput, todoInputEffect] = TodoInputState.update(state.todoInput, action, effects)

  return [{ ...state, todoInput }, Effect.map(Action.todoInputAction, todoInputEffect)]
}

const todoListUpdate = (
  state: State,
  [, action]: readonly ['todo-list-action', TodoListAction],
  effects: Effects
): Command => {
  if ('loading' in state) {
    return [state, Effect.none()]
  }

  const [todoList, todoListEffect] = TodoListState.update(state.todoList, action, effects)

  return [{ ...state, todoList }, Effect.map(Action.todoListAction, todoListEffect)]
}

const footerUpdate = (
  state: State,
  [, action]: readonly ['footer-action', FooterAction],
  effects: Effects
): Command => {
  if ('loading' in state) {
    return [state, Effect.none()]
  }

  const [footer, footerEffect] = FooterState.update(state.footer, action, effects)

  return [{ ...state, footer }, Effect.map(Action.footerAction, footerEffect)]
}

const handleTodoFilterLoadErrorUpdate = (
  state: State,
  [, message]: readonly ['handle-todo-filter-load-error', TodoFilterLoadError],
  { Alert: { showError }, Todos: { updateTodoFilter } }: Effects
): Command => {
  return [
    state,
    Effect.from({
      result: () =>
        AsyncResult.flatMap(
          () => updateTodoFilter('all'),
          showError(`${message}<br/>Switching to default`)
        ),
      success: Action.loadData
    })
  ]
}

// #region update
const update = (state: State, action: Action, effects: Effects): Command => {
  switch (action[0]) {
    case 'load-data':
      return loadDataUpdate(state, action, effects)

    case 'data-loaded':
      return dataLoadedUpdate(state, action)

    case 'handle-todo-filter-load-error':
      return handleTodoFilterLoadErrorUpdate(state, action, effects)

    case 'todo-input-action':
      return todoInputUpdate(state, action, effects)

    case 'footer-action':
      return footerUpdate(state, action, effects)

    case 'todo-list-action':
      return todoListUpdate(state, action, effects)
  }
}
// #endregion

export type MainState = State
export type MainAction = Action

export const MainState = { init, update } as const
export const MainAction = Action
