import { Dict, put, omit } from 'ts-micro-dict'
import { CounterState, CounterAction, initCounter, updateCounter } from '../counter'
import { assertIsDefined } from 'ts-is-defined'
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

export const counterAction = (id: Id) => (action: CounterAction): Action => [
  'counter-action',
  id,
  action
]

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
      const [, id, counterAct] = action
      const counter = counters[id]

      if (counter === undefined) {
        return [state, Effect.none()]
      }

      const [nextCounterState, nextCounterEffect] = updateCounter(counter, counterAct)

      return [
        { ...state, counters: put(counters, id, nextCounterState) },
        Effect.map(counterAction(id), nextCounterEffect)
      ]
    }
  }
}

export type AppState = State
export type AppAction = Action
export type AppStateEffect = StateEffect
