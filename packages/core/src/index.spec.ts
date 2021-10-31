import { Effect, IdleAction, Dispatch } from '@ts-elmish/common'
import { runProgram } from './index'

describe('runProgram', () => {
  const states: number[] = []
  const effects: boolean[] = []

  const config = {
    init: (): [number, Effect<'inc'>] => [1, [(d: Dispatch<'inc'>) => d('inc')]],
    update: (state: number, action: 'inc') => {
      switch (action) {
        case 'inc':
          return [state + 1, state < 3 ? [(d: Dispatch<'inc'>) => d('inc')] : []] as const
      }
    },
    view: (state: number, hasEffects: boolean) => {
      states.push(state)
      effects.push(hasEffects)
    }
  }

  test('run', () => {
    const { initialState, dispatch, stop, setState } = runProgram<number, 'inc'>(config)

    dispatch('inc')

    expect(initialState).toEqual(4)
    expect(states).toEqual([4, 4, 4, 4, 5])
    expect(effects).toEqual([false, true, true, true, false])

    dispatch(IdleAction)

    expect(states).toEqual([4, 4, 4, 4, 5, 5])
    expect(effects).toEqual([false, true, true, true, false, false])

    stop()

    dispatch('inc')

    expect(states).toEqual([4, 4, 4, 4, 5, 5, 5])
    expect(effects).toEqual([false, true, true, true, false, false, false])

    setState(10)

    expect(states).toEqual([4, 4, 4, 4, 5, 5, 5, 10])
    expect(effects).toEqual([false, true, true, true, false, false, false, false])
  })
})
