import { Dispatch, ElmishEffect } from '@ts-elmish/core'
import {
  Effect as BasicEffect,
  ActionArgs,
  FunctionArgs,
  PromiseArgs
} from '@ts-elmish/basic-effects'
import { Result, AsyncResult } from 'ts-swift-result'

export type Effect<Action> = ElmishEffect<Action>

type ResultArgs<Action, Success, Failure> = {
  readonly result: () => Result<Success, Failure>
  readonly success?: (value: Success) => Action
  readonly failure: (error: Failure) => Action
  readonly error?: (error: unknown) => Action
}

type ResultArgsNoFailure<Action, Success> = {
  readonly result: () => Result<Success, never>
  readonly success?: (value: Success) => Action
  readonly error?: (error: unknown) => Action
}

type AsyncResultArgs<Action, Success, Failure> = {
  readonly asyncResult: () => AsyncResult<Success, Failure>
  readonly success?: (value: Success) => Action
  readonly failure: (error: Failure) => Action
  readonly error?: (error: unknown) => Action
}

type AsyncResultArgsNoFailure<Action, Success> = {
  readonly asyncResult: () => AsyncResult<Success, never>
  readonly success?: (value: Success) => Action
  readonly error?: (error: unknown) => Action
}

function from<Action>(args: ActionArgs<Action>): Effect<Action>

function from<Action, Success = unknown>(args: FunctionArgs<Action, Success>): Effect<Action>

function from<Action, Success = unknown>(args: PromiseArgs<Action, Success>): Effect<Action>

function from<Action, Success = unknown, Failure = unknown>(
  args: ResultArgs<Action, Success, Failure>
): Effect<Action>

function from<Action, Success = unknown>(args: ResultArgsNoFailure<Action, Success>): Effect<Action>

function from<Action, Success = unknown, Failure = unknown>(
  args: AsyncResultArgs<Action, Success, Failure>
): Effect<Action>

function from<Action, Success = unknown>(
  args: AsyncResultArgsNoFailure<Action, Success>
): Effect<Action>

function from<Action, Success = unknown, Failure = unknown>(
  args:
    | ActionArgs<Action>
    | FunctionArgs<Action, Success>
    | PromiseArgs<Action, Success>
    | ResultArgs<Action, Success, Failure>
    | ResultArgsNoFailure<Action, Success>
    | AsyncResultArgs<Action, Success, Failure>
    | AsyncResultArgsNoFailure<Action, Success>
): Effect<Action> {
  if ('action' in args) {
    return BasicEffect.from(args)
  } else if ('promise' in args) {
    return BasicEffect.from(args)
  } else if ('func' in args) {
    return BasicEffect.from(args)
  } else if ('result' in args) {
    const { success, error, result } = args
    const failure = 'failure' in args ? args.failure : undefined

    return [
      (dispatch) => {
        if (error === undefined) {
          return effectFromResult(result(), dispatch, success, failure)
        } else {
          try {
            return effectFromResult(result(), dispatch, success, failure)
          } catch (err) {
            return dispatch(error(err))
          }
        }
      }
    ]
  } else {
    const { success, error, asyncResult } = args
    const failure = 'failure' in args ? args.failure : undefined

    return [
      async (dispatch) => {
        if (error === undefined) {
          return effectFromResult(await asyncResult(), dispatch, success, failure)
        } else {
          try {
            return effectFromResult(await asyncResult(), dispatch, success, failure)
          } catch (err) {
            return dispatch(error(err))
          }
        }
      }
    ]
  }
}

const effectFromResult = <Action, Success, Failure>(
  result: Result<Success, Failure>,
  dispatch: Dispatch<Action>,
  success: ((value: Success) => Action) | undefined,
  failure: ((error: Failure) => Action) | undefined
) =>
  result.tag === 'success' && success !== undefined
    ? dispatch(success(result.success))
    : result.tag === 'failure' && failure !== undefined
    ? dispatch(failure(result.failure))
    : result

export const Effect = {
  ...BasicEffect,
  from
} as const
