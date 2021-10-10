import { Dict } from 'ts-micro-dict'
import { CounterAction, CounterState } from '../counter'

type Id = string

type State = {
  readonly nextCounterId: number
  readonly counters: Dict<CounterState>
}

type Action =
  | readonly ['add-counter']
  | readonly ['remove-counter', Id]
  | readonly ['counters-action', Id, CounterAction]

const init = (): State => {
  return {
    nextCounterId: 0,
    counters: {}
  }
}

const update = ({ counters, nextCounterId }: State, action: Action): State => {
  switch (action[0]) {
    case 'add-counter':
      return {
        counters: Dict.put(`${nextCounterId}`, CounterState.init(), counters),
        nextCounterId: nextCounterId + 1
      }

    case 'remove-counter': {
      const [, id] = action
      return { nextCounterId, counters: Dict.omit(id, counters) }
    }

    case 'counters-action': {
      const [, id, counterAction] = action
      const prevState = counters[id]

      return prevState === undefined
        ? { nextCounterId, counters }
        : {
            nextCounterId,
            counters: Dict.put(id, CounterState.update(prevState, counterAction), counters)
          }
    }
  }
}

export type MainState = State
export type MainAction = Action

export const MainState = { init, update } as const
