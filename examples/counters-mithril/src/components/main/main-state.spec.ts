import { MainState } from './main-state'

const { init, update } = MainState

const validState: MainState = {
  nextCounterId: 1,
  counters: { '0': { count: 0 } }
}

describe('components > main', () => {
  test('init', () => {
    expect(init()).toEqual<MainState>({
      nextCounterId: 0,
      counters: {}
    })
  })

  test('add-counter', () => {
    expect(update(validState, ['add-counter'])).toEqual<MainState>({
      nextCounterId: 2,
      counters: { '0': { count: 0 }, '1': { count: 0 } }
    })
  })

  test('remove-counter', () => {
    expect(update(validState, ['remove-counter', '0'])).toEqual<MainState>({
      nextCounterId: 1,
      counters: {}
    })
  })

  test('counters-action - counter exist', () => {
    expect(update(validState, ['counters-action', '0', ['increment']])).toEqual<MainState>({
      nextCounterId: 1,
      counters: { '0': { count: 1 } }
    })
  })

  test(`counters-action - counter doesn't exist`, () => {
    expect(update(validState, ['counters-action', '1', ['increment']])).toEqual<MainState>({
      nextCounterId: 1,
      counters: { '0': { count: 0 } }
    })
  })
})
