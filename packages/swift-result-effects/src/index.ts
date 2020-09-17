import { Dispatch, ElmishEffect } from '@ts-elmish/core'
import {
  Effect as BasicEffect,
  ActionArgs,
  FunctionArgs,
  PromiseArgs
} from '@ts-elmish/basic-effects'
import { Result, AsyncResult, SuccessCase, FailureCase } from 'ts-swift-result'

export type Effect<Action> = ElmishEffect<Action>

type ResultArgs<Action, Success, Failure, ResultLike extends Result<Success, Failure>> = {
  readonly result: () => ResultLike
  readonly success?: (value: SuccessCase<ResultLike>) => Action
  readonly failure: (error: FailureCase<ResultLike>) => Action
  readonly error?: (error: unknown) => Action
}

type ResultArgsNoFailure<Action, Success, ResultLike extends Result<Success, never>> = {
  readonly result: () => ResultLike
  readonly success?: (value: SuccessCase<ResultLike>) => Action
  readonly error?: (error: unknown) => Action
}

type AsyncResultArgs<Action, Success, Failure, ResultLike extends AsyncResult<Success, Failure>> = {
  readonly asyncResult: () => ResultLike
  readonly success?: (value: SuccessCase<ResultLike>) => Action
  readonly failure: (error: FailureCase<ResultLike>) => Action
  readonly error?: (error: unknown) => Action
}

type AsyncResultArgsNoFailure<Action, Success, ResultLike extends AsyncResult<Success, never>> = {
  readonly asyncResult: () => ResultLike
  readonly success?: (value: SuccessCase<ResultLike>) => Action
  readonly error?: (error: unknown) => Action
}

function from<Action>(args: ActionArgs<Action>): Effect<Action>

function from<Action, Success = unknown>(args: FunctionArgs<Action, Success>): Effect<Action>

function from<Action, Success = unknown>(args: PromiseArgs<Action, Success>): Effect<Action>

function from<
  Action,
  Success,
  Failure,
  ResultLike extends Result<Success, Failure> = Result<Success, Failure>
>(args: ResultArgs<Action, Success, Failure, ResultLike>): Effect<Action>

function from<Action, Success, ResultLike extends Result<Success, never> = Result<Success, never>>(
  args: ResultArgsNoFailure<Action, Success, ResultLike>
): Effect<Action>

function from<
  Action,
  Success,
  Failure,
  ResultLike extends AsyncResult<Success, Failure> = AsyncResult<Success, Failure>
>(args: AsyncResultArgs<Action, Success, Failure, ResultLike>): Effect<Action>

function from<
  Action,
  Success,
  ResultLike extends AsyncResult<Success, never> = AsyncResult<Success, never>
>(args: AsyncResultArgsNoFailure<Action, Success, ResultLike>): Effect<Action>

function from<Action, Success, Failure>(
  args:
    | ActionArgs<Action>
    | FunctionArgs<Action, Success>
    | PromiseArgs<Action, Success>
    | ResultArgs<Action, Success, Failure, Result<Success, Failure>>
    | ResultArgsNoFailure<Action, Success, Result<Success, never>>
    | AsyncResultArgs<Action, Success, Failure, AsyncResult<Success, Failure>>
    | AsyncResultArgsNoFailure<Action, Success, AsyncResult<Success, never>>
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
