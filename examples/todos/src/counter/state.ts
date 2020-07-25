import { Effect, Effects } from '@ts-elmish/core'

type State = {
  readonly count: number
}

type Action = readonly ['increment'] | readonly ['decrement']

type StateEffect = readonly [State, Effect<Action>]

export const initCounter = (): State => {
  return { count: 0 }
}

export const updateCounter = (state: State, action: Action): StateEffect => {
  const { count } = state

  switch (action[0]) {
    case 'increment':
      return [{ count: count + 1 }, Effects.none()]

    case 'decrement':
      return [{ count: count - 1 }, Effects.none()]
  }
}

export type CounterState = State
export type CounterAction = Action
export type CounterStateEffect = StateEffect
