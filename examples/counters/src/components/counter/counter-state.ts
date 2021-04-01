type State = {
  readonly count: number
}

type Action = readonly ['increment'] | readonly ['decrement']

const init = (): State => {
  return { count: 0 }
}

const update = ({ count }: State, action: Action): State => {
  switch (action[0]) {
    case 'increment':
      return { count: count + 1 }

    case 'decrement':
      return { count: count - 1 }
  }
}

export type CounterState = State
export type CounterAction = Action

export const CounterState = { init, update } as const
