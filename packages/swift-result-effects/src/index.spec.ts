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
      error: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromFunctionNoFailure = Effect.from({
      func: () => 1,
      error: (error) => error
    })

    const fromFunctionSuccess = Effect.from({
      func: () => 1,
      done: (value: number) => `${value}`,
      error: (error) => error
    })

    const fromPromiseFailure = Effect.from({
      promise: () => Promise.reject(new Error('message')),
      error: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromPromiseNoFailure = Effect.from({
      promise: () => Promise.resolve(1),
      error: (error) => error
    })

    const fromPromiseSuccess = Effect.from({
      promise: () => Promise.resolve(1),
      then: (value: number) => `${value}`,
      error: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromResultFailure = Effect.from({
      result: () => Result.failure(new Error('message')),
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromResultFailureAndError = Effect.from({
      result: () => Result.failure(new Error('message')),
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error),
      error: (error) => error
    })

    const fromResultBasicFailure = Effect.from({
      result: () => {
        throw new Error('message')
      },
      failure: (error) => error,
      error: (error) => error
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

    const fromResultSuccessAndError = Effect.from({
      result: () => Result.success(1),
      success: (value: number) => `${value}`,
      failure: (error) => error,
      error: (error) => error
    })

    const fromResultNoSuccessAndError = Effect.from({
      result: () => Result.success(1),
      error: (error) => error
    })

    const fromAsyncResultFailure = Effect.from({
      asyncResult: () => Promise.resolve(Result.failure(new Error('message'))),
      error: (error) => error,
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromAsyncResultFailureNoError = Effect.from({
      asyncResult: () => Promise.resolve(Result.failure(new Error('message'))),
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromAsyncResultBasicFailure = Effect.from({
      asyncResult: () => Promise.reject(new Error('message')),
      failure: (error) => error,
      error: (error) => error
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

    const fromAsyncResultSuccessAndError = Effect.from({
      asyncResult: () => Promise.resolve(Result.success(1)),
      success: (value: number) => `${value}`,
      failure: (error) => error,
      error: (error) => error
    })

    const fromAsyncResultNoSuccessAndError = Effect.from({
      asyncResult: () => Promise.resolve(Result.success(1)),
      error: (error) => error
    })

    expect(fromAction[0]((x) => x)).toEqual('action')

    expect(fromFunctionFailure[0]((x) => x)).toEqual('message')
    expect(fromFunctionNoFailure[0]((x) => x)).toEqual(1)
    expect(fromFunctionSuccess[0]((x) => x)).toEqual('1')

    await expect(fromPromiseFailure[0]((x) => x)).resolves.toEqual('message')
    await expect(fromPromiseNoFailure[0]((x) => x)).resolves.toEqual(1)
    await expect(fromPromiseSuccess[0]((x) => x)).resolves.toEqual('1')

    expect(fromResultFailure[0]((x) => x)).toEqual('message')
    expect(fromResultFailureAndError[0]((x) => x)).toEqual('message')
    expect(fromResultNoFailure[0]((x) => x)).toEqual({ success: 1, tag: 'success' })
    expect(fromResultBasicFailure[0]((x) => x)).toEqual(new Error('message'))
    expect(fromResultSuccess[0]((x) => x)).toEqual('1')
    expect(fromResultSuccessAndError[0]((x) => x)).toEqual('1')
    expect(fromResultNoSuccessAndError[0]((x) => x)).toEqual({ success: 1, tag: 'success' })

    await expect(fromAsyncResultFailure[0]((x) => x)).resolves.toEqual('message')
    await expect(fromAsyncResultFailureNoError[0]((x) => x)).resolves.toEqual('message')
    await expect(fromAsyncResultNoFailure[0]((x) => x)).resolves.toEqual({
      success: 1,
      tag: 'success'
    })
    await expect(fromAsyncResultBasicFailure[0]((x) => x)).resolves.toEqual(new Error('message'))
    await expect(fromAsyncResultSuccess[0]((x) => x)).resolves.toEqual('1')
    await expect(fromAsyncResultSuccessAndError[0]((x) => x)).resolves.toEqual('1')
    await expect(fromAsyncResultNoSuccessAndError[0]((x) => x)).resolves.toEqual({
      success: 1,
      tag: 'success'
    })
  })
})
