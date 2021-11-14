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

type Command = readonly [State, Effect<Action>]

const init = (): Command => {
  return [{ loading: true }, Effect.from({ action: ['load-data'] })]
}

const update = (state: State, action: Action, effects: Effects): Command => {
  switch (action[0]) {
    case 'load-data': {
      const {
        Todos: { loadTodoFilter, loadTodoDict }
      } = effects

      return [
        state,
        Effect.from({
          result: () => AsyncResult.combine(loadTodoDict(), loadTodoFilter()),
          success: Action.dataLoaded,
          failure: Action.handleTodoFilterLoadError
        })
      ]
    }

    case 'data-loaded': {
      if (!('loading' in state)) {
        return [state, Effect.none()]
      }

      const [, [todos, todoFilter]] = action

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

    case 'handle-todo-filter-load-error': {
      const {
        Alert: { showError },
        Todos: { updateTodoFilter }
      } = effects
      const [, message] = action

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

    case 'todo-input-action': {
      if ('loading' in state) {
        return [state, Effect.none()]
      }

      const [todoInput, todoInputEffect] = TodoInputState.update(
        state.todoInput,
        action[1],
        effects
      )

      return [{ ...state, todoInput }, Effect.map(Action.todoInputAction, todoInputEffect)]
    }

    case 'footer-action': {
      if ('loading' in state) {
        return [state, Effect.none()]
      }

      const [footer, footerEffect] = FooterState.update(state.footer, action[1], effects)

      return [{ ...state, footer }, Effect.map(Action.footerAction, footerEffect)]
    }

    case 'todo-list-action': {
      if ('loading' in state) {
        return [state, Effect.none()]
      }

      const [todoList, todoListEffect] = TodoListState.update(state.todoList, action[1], effects)

      return [{ ...state, todoList }, Effect.map(Action.todoListAction, todoListEffect)]
    }
  }
}

export type MainState = State
export type MainAction = Action

export const MainState = { init, update } as const
export const MainAction = Action
