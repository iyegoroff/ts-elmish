import { Effect } from '@ts-elmish/railway-effects'
import { Todo, TodoDict } from '../../../domain/todos/types'
import { Effects } from '../../effects/types'

type State = {
  readonly text: string
  readonly completed: boolean
  readonly isEdited: boolean
}

type ExtendedState = readonly [keyof TodoDict, State]

type Action =
  | readonly ['start-edit']
  | readonly ['confirm-edit', string]
  | readonly ['cancel-edit']
  | readonly ['remove']
  | readonly ['toggle-completed']

// #region Action
const Action = {
  startEdit: (): Action => ['start-edit'],
  confirmEdit: (arg0: string): Action => ['confirm-edit', arg0],
  cancelEdit: (): Action => ['cancel-edit'],
  remove: (): Action => ['remove'],
  toggleCompleted: (): Action => ['toggle-completed']
} as const
// #endregion

type Command = readonly [State, Effect<Action>]

const init = (todo: Todo): State => {
  return { ...todo, isEdited: false }
}

const startEditUpdate = ([, state]: ExtendedState, _action: readonly ['start-edit']): Command => {
  return [{ ...state, isEdited: true }, Effect.none()]
}

const confirmEditUpdate = (
  [id, state]: ExtendedState,
  [, text]: readonly ['confirm-edit', string],
  { Todos: { updateTodo } }: Effects
): Command => {
  const { completed } = state

  return [
    { ...state, text, isEdited: false },
    Effect.from({
      asyncResult: () => updateTodo(id, { text, completed })
    })
  ]
}

const cancelEditUpdate = ([, state]: ExtendedState, _action: readonly ['cancel-edit']): Command => {
  return [{ ...state, isEdited: false }, Effect.none()]
}

const removeUpdate = (
  [id, state]: ExtendedState,
  _action: readonly ['remove'],
  { Todos: { removeTodo } }: Effects
): Command => {
  return [
    state,
    Effect.from({
      asyncResult: () => removeTodo(id)
    })
  ]
}

const toggleCompletedUpdate = (
  [id, state]: ExtendedState,
  _action: readonly ['toggle-completed'],
  { Todos: { updateTodo } }: Effects
): Command => {
  const completed = !state.completed
  const { text } = state

  return [
    { ...state, completed },
    Effect.from({
      asyncResult: () => updateTodo(id, { text, completed })
    })
  ]
}

// #region update
const update = (state: ExtendedState, action: Action, effects: Effects): Command => {
  switch (action[0]) {
    case 'start-edit':
      return startEditUpdate(state, action)

    case 'confirm-edit':
      return confirmEditUpdate(state, action, effects)

    case 'cancel-edit':
      return cancelEditUpdate(state, action)

    case 'remove':
      return removeUpdate(state, action, effects)

    case 'toggle-completed':
      return toggleCompletedUpdate(state, action, effects)
  }
}
// #endregion

export type TodoState = State
export type TodoAction = Action

export const TodoState = { init, update } as const
export const TodoAction = Action
