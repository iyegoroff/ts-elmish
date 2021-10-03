import { Record, String } from 'runtypes'
import { Result } from 'ts-railway'
import { ElmishIdleAction } from '@ts-elmish/idle-action'
import { Effect } from './index'
import { checkAsyncEffect, checkEffect } from '@ts-elmish/basic-effects/src/checks'

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
      result: () => Promise.resolve(foo(1, 2)),
      failure: (error) => error
    })

    const fromAsyncResultNoFailure = Effect.from({
      result: () => Promise.resolve(bar(1, 2)),
      success: (value) => value
    })

    const fromAsyncResult = Effect.from({
      result: () => Promise.resolve(foo(1, 2)),
      success: (value) => value.op,
      failure: (error) => error.nan
    })

    checkEffect(fromResultNoSuccess, ElmishIdleAction)
    checkEffect(fromResultNoFailure, { op: '<' })
    checkEffect(fromResult, '<')

    await checkAsyncEffect(fromAsyncResultNoSuccess, ElmishIdleAction)
    await checkAsyncEffect(fromAsyncResultNoFailure, { op: '<' })
    await checkAsyncEffect(fromAsyncResult, '<')
  })

  test('from', async () => {
    const fromAction = Effect.from({ action: 'action' })

    const fromResultFailure = Effect.from({
      result: () => Result.failure(new Error('message')),
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromResultNoFailure = Effect.from({
      result: () => Result.success(1)
    })

    const fromResultSuccess = Effect.from({
      result: () => Result.success(1),
      success: (value) => `${value}`
    })

    const fromAsyncResultFailure = Effect.from({
      result: () => Promise.resolve(Result.failure(new Error('message'))),
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromAsyncResultFailureNoError = Effect.from({
      result: () => Promise.resolve(Result.failure(new Error('message'))),
      failure: (error) => (ErrorSchema.guard(error) ? error.message : error)
    })

    const fromAsyncResultNoFailure = Effect.from({
      result: () => Promise.resolve(Result.success(1))
    })

    const fromAsyncResultSuccess = Effect.from({
      result: () => Promise.resolve(Result.success(1)),
      success: (value) => `${value}`
    })

    checkEffect(fromAction, 'action')

    checkEffect(fromResultFailure, 'message')
    checkEffect(fromResultNoFailure, ElmishIdleAction)
    checkEffect(fromResultSuccess, '1')

    await checkAsyncEffect(fromAsyncResultFailure, 'message')
    await checkAsyncEffect(fromAsyncResultFailureNoError, 'message')
    await checkAsyncEffect(fromAsyncResultNoFailure, ElmishIdleAction)
    await checkAsyncEffect(fromAsyncResultSuccess, '1')
  })
})
