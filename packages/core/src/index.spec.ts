import 'ts-jest'
import { Action, runProgram } from './index'

describe('runProgram', () => {
  test('run', () => {
    const states: number[] = []
    const [initial, dispatch] = runProgram<number, 'inc'>({
      init: () => [1, [(d) => d('inc')]],
      update: (state, action) => {
        switch (action) {
          case 'inc':
            return [state + 1, state < 3 ? [(d) => d('inc')] : []]
        }
      },
      view: (state) => {
        states.push(state)
      }
    })

    dispatch('inc')

    expect(initial).toEqual(4)
    expect(states).toEqual([4, 4, 4, 5])
  })
})

describe('actions', () => {
  test('map', () => {
    expect(Action.map('name')('action')).toEqual(['name', 'action'])
  })

  test('mapArg', () => {
    expect(Action.mapArg('name', 'arg')('action')).toEqual(['name', 'arg', 'action'])
  })
})
