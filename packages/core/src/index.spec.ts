import 'ts-jest'
import { Action, Effect, runProgram } from './index'

describe('runProgram', () => {
  test('run', () => {
    const states: number[] = []
    const [initial, dispatch] = runProgram<number, 'inc'>({
      init: () => [1, Effect.from({ action: 'inc' as const })],
      update: (state, action) => {
        switch (action) {
          case 'inc':
            return [state + 1, state < 3 ? Effect.from({ action: 'inc' as const }) : Effect.none()]
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

describe('effects', () => {
  test('none', () => {
    expect(Effect.none()).toEqual([])
  })

  test('from', async () => {
    const fromAction = Effect.from({ action: 'action' })

    const fromFunctionFailure = Effect.from({
      func: () => {
        throw new Error('message')
      },
      failure: (error) => (error as Partial<Error> | undefined)?.message
    })

    const fromFunctionNoFailure = Effect.from({
      func: () => 1,
      failure: (error) => error
    })

    const fromFunctionSuccess = Effect.from({
      func: () => 1,
      success: (value) => String(value),
      failure: (error) => error
    })

    const fromPromiseFailure = Effect.from({
      promise: () => Promise.reject(new Error('message')),
      failure: (error) => (error as Partial<Error> | undefined)?.message
    })

    const fromPromiseNoFailure = Effect.from({
      promise: () => Promise.resolve(1),
      failure: (error) => error
    })

    const fromPromiseSuccess = Effect.from({
      promise: () => Promise.resolve(1),
      success: (value) => String(value),
      failure: (error) => (error as Partial<Error> | undefined)?.message
    })

    expect(fromAction[0]((x) => x)).toEqual('action')
    expect(fromFunctionFailure[0]((x) => x)).toEqual('message')
    expect(fromFunctionNoFailure[0]((x) => x)).toEqual(1)
    expect(fromFunctionSuccess[0]((x) => x)).toEqual('1')
    expect(await fromPromiseFailure[0]((x) => x)).toEqual('message')
    expect(await fromPromiseNoFailure[0]((x) => x)).toEqual(1)
    expect(await fromPromiseSuccess[0]((x) => x)).toEqual('1')
  })

  test('map', () => {
    const mapped = Effect.map((x: number) => ['action', x] as const, [(dispatch) => dispatch(1)])
    expect(mapped[0](([, x]) => ['action', x + 1])).toEqual(['action', 2])
  })

  test('batch', () => {
    const batched = Effect.batch(
      Effect.from({ action: 'action1' }),
      Effect.from({ action: 'action2' })
    )

    expect(batched[0]((x) => x)).toEqual('action1')
    expect(batched[1]((x) => x)).toEqual('action2')
  })
})
