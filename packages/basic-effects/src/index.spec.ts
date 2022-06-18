import { IdleAction } from '@ts-elmish/common'
import { object, string } from 'spectypes'
import { pipe } from 'pipe-ts'
import { Result } from 'ts-railway'
import { Effect } from './index'
import { checkAsyncEffect, checkAsyncEffectReject, checkEffect, checkEffectReject } from './checks'

const errorSchema = object({ message: string })

const errorHandler = pipe(
  errorSchema,
  Result.match({
    success: ({ message }) => message,
    failure: ({ value }) => value
  })
)

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
      error: errorHandler
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

    const fromFunctionSuccessNoError = Effect.from({
      func: () => 1,
      done: (value: number) => `${value}`
    })

    const fromFunctionSuccessNoDone = Effect.from({
      func: () => 1
    })

    const fromFunctionThrow = Effect.from({
      func: () => {
        throw new Error('message')
      }
    })

    const fromPromiseFailure = Effect.from({
      promise: () => Promise.reject(new Error('message')),
      error: errorHandler
    })

    const fromPromiseNoFailure = Effect.from({
      promise: () => Promise.resolve(1),
      error: (error) => error
    })

    const fromPromiseSuccess = Effect.from({
      promise: () => Promise.resolve(1),
      then: (value: number) => `${value}`,
      error: errorHandler
    })

    const fromPromiseSuccessNoError = Effect.from({
      promise: () => Promise.resolve(1),
      then: (value: number) => `${value}`
    })

    const fromPromiseSuccessNoThen = Effect.from({
      promise: () => Promise.resolve(1)
    })

    const fromPromiseThrow = Effect.from({
      promise: () => Promise.reject(new Error('message'))
    })

    checkEffect(fromAction, 'action')
    checkEffect(fromFunctionFailure, 'message')
    checkEffect(fromFunctionNoFailure, IdleAction)
    checkEffect(fromFunctionSuccess, '1')
    checkEffect(fromFunctionSuccessNoError, '1')
    checkEffect(fromFunctionSuccessNoDone, IdleAction)
    checkEffectReject(fromFunctionThrow, new Error('message'))
    await checkAsyncEffect(fromPromiseFailure, 'message')
    await checkAsyncEffect(fromPromiseNoFailure, IdleAction)
    await checkAsyncEffect(fromPromiseSuccess, '1')
    await checkAsyncEffect(fromPromiseSuccessNoThen, IdleAction)
    await checkAsyncEffect(fromPromiseSuccessNoError, '1')
    await checkAsyncEffectReject(fromPromiseThrow, new Error('message'))
  })

  test('map', () => {
    const mapped = Effect.map((x: number) => ['action', x] as const, [(dispatch) => dispatch(1)])
    checkEffect(mapped, ['action', 1])

    const mappedIdle = Effect.map(
      (x) => ['action', x] as const,
      [(dispatch) => dispatch(IdleAction)]
    )
    checkEffect(mappedIdle, IdleAction)
  })

  test('batch', () => {
    const batched = Effect.batch(
      Effect.from({ action: 'action1' }),
      Effect.from({ action: 'action2' })
    )

    checkEffect(batched, 'action1')
    checkEffect(batched, 'action2', 1)
  })
})
