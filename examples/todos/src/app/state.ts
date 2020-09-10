import { Dict, put, omit } from 'ts-micro-dict'
import { CounterState, CounterAction, initCounter, updateCounter } from '../counter'
import { assertIsDefined } from 'ts-is-defined'
import { Action } from '@ts-elmish/core'
import { Effect } from '@ts-elmish/basic-effects'

type Id = string

type State = {
  readonly nextCounterId: number
  readonly counters: Dict<CounterState>
}

type Action =
  | readonly ['add-counter']
  | readonly ['remove-counter', Id]
  | readonly ['counter-action', Id, CounterAction]

type StateEffect = readonly [State, Effect<Action>]

export const initApp = (): StateEffect => {
  return [{ nextCounterId: 0, counters: {} }, Effect.none()]
}

export const updateApp = (state: State, action: Action): StateEffect => {
  const { counters, nextCounterId } = state

  switch (action[0]) {
    case 'add-counter': {
      return [
        {
          nextCounterId: nextCounterId + 1,
          counters: put(counters, `${nextCounterId}`, initCounter())
        },
        Effect.none()
      ]
    }

    case 'remove-counter': {
      const [, id] = action
      return [{ ...state, counters: omit(counters, id) }, Effect.none()]
    }

    case 'counter-action': {
      const [, id, counterAction] = action
      const counter = counters[id]

      assertIsDefined(counter, `invalid counter id - ${id}`)

      const [nextCounterState, nextCounterEffect] = updateCounter(counter, counterAction)

      return [
        { ...state, counters: put(counters, id, nextCounterState) },
        Effect.map(Action.mapArg('counter-action', id), nextCounterEffect)
      ]
    }
  }
}

export type AppState = State
export type AppAction = Action
export type AppStateEffect = StateEffect
