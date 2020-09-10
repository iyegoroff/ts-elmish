import 'ts-jest'
import { Effect } from './index'
import { Record, String } from 'runtypes'
import { Result } from 'ts-swift-result'

const ErrorSchema = Record({ message: String })

describe('effects', () => {
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

    const fromResultFailure = Effect.from({
      result: () => Result.failure(new Error('message')),
      failure: (error) => error,
      resultFailure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromResultBasicFailure = Effect.from({
      result: () => {
        throw new Error('message')
      },
      failure: (error) => error
    })

    const fromResultNoFailure = Effect.from({
      result: () => Result.success(1),
      failure: (error) => error
    })

    const fromResultSuccess = Effect.from({
      result: () => Result.success(1),
      success: (value: number) => `${value}`,
      failure: (error) => error
    })

    const fromAsyncResultFailure = Effect.from({
      asyncResult: () => Promise.resolve(Result.failure(new Error('message'))),
      failure: (error) => error,
      resultFailure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromAsyncResultBasicFailure = Effect.from({
      asyncResult: () => Promise.reject(new Error('message')),
      failure: (error) => error
    })

    const fromAsyncResultNoFailure = Effect.from({
      asyncResult: () => Promise.resolve(Result.success(1)),
      failure: (error) => error
    })

    const fromAsyncResultSuccess = Effect.from({
      asyncResult: () => Promise.resolve(Result.success(1)),
      success: (value: number) => `${value}`,
      failure: (error) => error
    })

    expect(fromAction[0]((x) => x)).toEqual('action')

    expect(fromFunctionFailure[0]((x) => x)).toEqual('message')
    expect(fromFunctionNoFailure[0]((x) => x)).toEqual(1)
    expect(fromFunctionSuccess[0]((x) => x)).toEqual('1')

    await expect(fromPromiseFailure[0]((x) => x)).resolves.toEqual('message')
    await expect(fromPromiseNoFailure[0]((x) => x)).resolves.toEqual(1)
    await expect(fromPromiseSuccess[0]((x) => x)).resolves.toEqual('1')

    expect(fromResultFailure[0]((x) => x)).toEqual('message')
    expect(fromResultNoFailure[0]((x) => x)).toEqual(1)
    expect(fromResultBasicFailure[0]((x) => x)).toEqual(new Error('message'))
    expect(fromResultSuccess[0]((x) => x)).toEqual('1')

    await expect(fromAsyncResultFailure[0]((x) => x)).resolves.toEqual('message')
    await expect(fromAsyncResultNoFailure[0]((x) => x)).resolves.toEqual(1)
    await expect(fromAsyncResultBasicFailure[0]((x) => x)).resolves.toEqual(new Error('message'))
    await expect(fromAsyncResultSuccess[0]((x) => x)).resolves.toEqual('1')
  })
})
