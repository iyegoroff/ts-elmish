import { CounterState } from './counter-state'

const { init, update } = CounterState

const validState: CounterState = { count: 0 }

describe('components > counter', () => {
  test('init', () => {
    expect(init()).toEqual<CounterState>({ count: 0 })
  })

  test('increment', () => {
    expect(update(validState, ['increment'])).toEqual<CounterState>({ count: 1 })
  })

  test('decrement', () => {
    expect(update(validState, ['decrement'])).toEqual<CounterState>({ count: -1 })
  })
})
