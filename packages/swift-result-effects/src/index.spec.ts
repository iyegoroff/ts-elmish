import 'ts-jest'
import { Effect } from './index'
import { Record, String } from 'runtypes'
import { Result } from 'ts-swift-result'

const ErrorSchema = Record({ message: String })

describe('effects', () => {
  test('types', async () => {
    const foo = (x: number, y: number) => {
      if (Number.isNaN(x)) {
        return Result.failure({ nan: 'x' } as const)
      }

      if (Number.isNaN(y)) {
        return Result.failure({ nan: 'y' } as const)
      }

      if (x > y) {
        return Result.success({ op: '>' } as const)
      }

      if (x < y) {
        return Result.success({ op: '<' } as const)
      }

      if (x === y) {
        return Result.success({ op: '===' } as const)
      }

      return Result.failure({ nan: 'fail' } as const)
    }

    const bar = (x: number, y: number) => {
      if (Number.isNaN(x)) {
        return Result.success({ nan: 'x' } as const)
      }

      if (Number.isNaN(y)) {
        return Result.success({ nan: 'y' } as const)
      }

      if (x > y) {
        return Result.success({ op: '>' } as const)
      }

      if (x < y) {
        return Result.success({ op: '<' } as const)
      }

      if (x === y) {
        return Result.success({ op: '===' } as const)
      }

      return Result.success({ nan: 'fail' } as const)
    }

    const fromResultNoSuccess = Effect.from({
      result: () => foo(1, 2),
      failure: (error) => error
    })
    const fromResultNoFailure = Effect.from({
      result: () => bar(1, 2),
      success: (value) => value
    })

    const fromResult = Effect.from({
      result: () => foo(1, 2),
      success: (value) => value.op,
      failure: (error) => error.nan
    })

    const fromAsyncResultNoSuccess = Effect.from({
      asyncResult: () => Promise.resolve(foo(1, 2)),
      failure: (error) => error
    })

    const fromAsyncResultNoFailure = Effect.from({
      asyncResult: () => Promise.resolve(bar(1, 2)),
      success: (value) => value
    })

    const fromAsyncResult = Effect.from({
      asyncResult: () => Promise.resolve(foo(1, 2)),
      success: (value) => value.op,
      failure: (error) => error.nan
    })

    expect(fromResultNoSuccess[0]((x) => x)).toEqual({ success: { op: '<' }, tag: 'success' })
    expect(fromResultNoFailure[0]((x) => x)).toEqual({ op: '<' })
    expect(fromResult[0]((x) => x)).toEqual('<')

    await expect(fromAsyncResultNoSuccess[0]((x) => x)).resolves.toEqual({
      success: { op: '<' },
      tag: 'success'
    })
    await expect(fromAsyncResultNoFailure[0]((x) => x)).resolves.toEqual({ op: '<' })
    await expect(fromAsyncResult[0]((x) => x)).resolves.toEqual('<')
  })

  test('from', async () => {
    const fromAction = Effect.from({ action: 'action' })

    const fromResultFailure = Effect.from({
      result: () => Result.failure(new Error('message')),
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromResultNoFailure = Effect.from({
      result: () => Result.success(1),
      failure: (error) => error
    })

    const fromResultSuccess = Effect.from({
      result: () => Result.success(1),
      success: (value) => `${value}`,
      failure: (error) => error
    })

    const fromAsyncResultFailure = Effect.from({
      asyncResult: () => Promise.resolve(Result.failure(new Error('message'))),
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromAsyncResultFailureNoError = Effect.from({
      asyncResult: () => Promise.resolve(Result.failure(new Error('message'))),
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromAsyncResultNoFailure = Effect.from({
      asyncResult: () => Promise.resolve(Result.success(1)),
      failure: (error) => error
    })

    const fromAsyncResultSuccess = Effect.from({
      asyncResult: () => Promise.resolve(Result.success(1)),
      success: (value) => `${value}`,
      failure: (error) => error
    })

    expect(fromAction[0]((x) => x)).toEqual('action')

    expect(fromResultFailure[0]((x) => x)).toEqual('message')
    expect(fromResultNoFailure[0]((x) => x)).toEqual({ success: 1, tag: 'success' })
    expect(fromResultSuccess[0]((x) => x)).toEqual('1')

    await expect(fromAsyncResultFailure[0]((x) => x)).resolves.toEqual('message')
    await expect(fromAsyncResultFailureNoError[0]((x) => x)).resolves.toEqual('message')
    await expect(fromAsyncResultNoFailure[0]((x) => x)).resolves.toEqual({
      success: 1,
      tag: 'success'
    })
    await expect(fromAsyncResultSuccess[0]((x) => x)).resolves.toEqual('1')
  })
})
