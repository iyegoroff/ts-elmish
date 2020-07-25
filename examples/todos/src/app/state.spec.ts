import 'ts-jest'
import { Effects } from '@ts-elmish/core'
import { initApp, updateApp, AppStateEffect, AppState } from './state'
import { initCounter } from '../counter/state'

describe('Counter state', () => {
  test('add-counter', () => {
    const [initial] = initApp()

    const expected: AppStateEffect = [
      { ...initial, nextCounterId: 1, counters: { '0': initCounter() } },
      Effects.none()
    ]

    expect(updateApp(initial, ['add-counter'])).toEqual(expected)
  })

  test('remove-counter', () => {
    const initial: AppState = { nextCounterId: 1, counters: { '0': initCounter() } }

    const expected: AppStateEffect = [
      { ...initial, nextCounterId: 1, counters: {} },
      Effects.none()
    ]

    expect(updateApp(initial, ['remove-counter', '0'])).toEqual(expected)
  })

  test('counter-action', () => {
    const initial: AppState = { nextCounterId: 1, counters: { '0': initCounter() } }

    const expected: AppStateEffect = [
      { ...initial, nextCounterId: 1, counters: { '0': { count: 1 } } },
      Effects.none()
    ]

    expect(updateApp(initial, ['counter-action', '0', ['increment']])).toEqual(expected)
  })
})
