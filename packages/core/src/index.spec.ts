import { ElmishIdleAction } from '@ts-elmish/idle-action'
import { runProgram } from './index'

describe('runProgram', () => {
  test('run', () => {
    const states: number[] = []
    const effects: boolean[] = []
    const { initialState, dispatch, stop } = runProgram<number, 'inc'>({
      init: () => [1, [(d) => d('inc')]],
      update: (state, action) => {
        switch (action) {
          case 'inc':
            return [state + 1, state < 3 ? [(d) => d('inc')] : []]
        }
      },
      view: (state, hasEffects) => {
        states.push(state)
        effects.push(hasEffects)
      }
    })

    dispatch('inc')

    expect(initialState).toEqual(4)
    expect(states).toEqual([4, 4, 4, 4, 5])
    expect(effects).toEqual([false, true, true, true, false])

    dispatch(ElmishIdleAction)

    expect(states).toEqual([4, 4, 4, 4, 5, 5])
    expect(effects).toEqual([false, true, true, true, false, false])

    stop()

    dispatch('inc')

    expect(states).toEqual([4, 4, 4, 4, 5, 5, 5])
    expect(effects).toEqual([false, true, true, true, false, false, false])
  })
})
