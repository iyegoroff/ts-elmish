import { Effects } from '@ts-elmish/core'
import { initCounter, updateCounter, CounterStateEffect } from './state'

describe('Counter state', () => {
  test('increment', () => {
    const initial = initCounter()

    const expected: CounterStateEffect = [{ ...initial, count: initial.count + 1 }, Effects.none()]

    expect(updateCounter(initial, ['increment'])).toEqual(expected)
  })

  test('decrement', () => {
    const initial = initCounter()

    const expected: CounterStateEffect = [{ count: initial.count - 1 }, Effects.none()]

    expect(updateCounter(initial, ['decrement'])).toEqual(expected)
  })
})
