import { Effect } from '@ts-elmish/railway-effects'
import { Effects } from '../../effects/types'
import { TodoInputAction, TodoInputState } from '../todo-input'
import { FooterAction, FooterState } from '../footer'
import { TodoListAction, TodoListState } from '../todo-list'

type State = {
  readonly todoInput: TodoInputState
  readonly footer: FooterState
  readonly todoList: TodoListState
}

type Action =
  | readonly ['todo-input-action', TodoInputAction]
  | readonly ['footer-action', FooterAction]
  | readonly ['todo-list-action', TodoListAction]

// #region Action
const Action = {
  todoInputAction: (arg0: TodoInputAction): Action => ['todo-input-action', arg0],
  footerAction: (arg0: FooterAction): Action => ['footer-action', arg0],
  todoListAction: (arg0: TodoListAction): Action => ['todo-list-action', arg0]
} as const
// #endregion

type Command = readonly [State, Effect<Action>]

const init = (effects: Effects): Command => {
  const [todoInput, todoInputEffect] = TodoInputState.init(effects)
  const [footer, footerEffect] = FooterState.init(effects)
  const [todoList, todoListEffect] = TodoListState.init(effects)

  return [
    {
      todoInput,
      footer,
      todoList
    },
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
  const [todoInput, todoInputEffect] = TodoInputState.update(state.todoInput, action, effects)

  return [{ ...state, todoInput }, Effect.map(Action.todoInputAction, todoInputEffect)]
}

const todoListUpdate = (
  state: State,
  [, action]: readonly ['todo-list-action', TodoListAction],
  effects: Effects
): Command => {
  const [todoList, todoListEffect] = TodoListState.update(state.todoList, action, effects)

  return [{ ...state, todoList }, Effect.map(Action.todoListAction, todoListEffect)]
}

const footerUpdate = (
  state: State,
  [, action]: readonly ['footer-action', FooterAction]
): Command => {
  const [footer, footerEffect] = FooterState.update(state.footer, action)

  return [{ ...state, footer }, Effect.map(Action.footerAction, footerEffect)]
}

// #region update
const update = (state: State, action: Action, effects: Effects): Command => {
  switch (action[0]) {
    case 'todo-input-action':
      return todoInputUpdate(state, action, effects)

    case 'footer-action':
      return footerUpdate(state, action)

    case 'todo-list-action':
      return todoListUpdate(state, action, effects)
  }
}
// #endregion

export type MainState = State
export type MainAction = Action

export const MainState = { init, update } as const
export const MainAction = Action
