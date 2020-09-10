import 'ts-jest'
import { Effect } from './index'
import { Record, String } from 'runtypes'

const ErrorSchema = Record({ message: String })

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
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromFunctionNoFailure = Effect.from({
      func: () => 1,
      failure: (error) => error
    })

    const fromFunctionSuccess = Effect.from({
      func: () => 1,
      success: (value: number) => `${value}`,
      failure: (error) => error
    })

    const fromPromiseFailure = Effect.from({
      promise: () => Promise.reject(new Error('message')),
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromPromiseNoFailure = Effect.from({
      promise: () => Promise.resolve(1),
      failure: (error) => error
    })

    const fromPromiseSuccess = Effect.from({
      promise: () => Promise.resolve(1),
      success: (value: number) => `${value}`,
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    expect(fromAction[0]((x) => x)).toEqual('action')
    expect(fromFunctionFailure[0]((x) => x)).toEqual('message')
    expect(fromFunctionNoFailure[0]((x) => x)).toEqual(1)
    expect(fromFunctionSuccess[0]((x) => x)).toEqual('1')
    await expect(fromPromiseFailure[0]((x) => x)).resolves.toEqual('message')
    await expect(fromPromiseNoFailure[0]((x) => x)).resolves.toEqual(1)
    await expect(fromPromiseSuccess[0]((x) => x)).resolves.toEqual('1')
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
