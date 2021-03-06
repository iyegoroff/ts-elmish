import { ElmishEffect } from '@ts-elmish/core'
import { ElmishIdleAction } from '@ts-elmish/idle-action'
import { Effect as BasicEffect, ActionArgs } from '@ts-elmish/basic-effects'
import { Result, AsyncResult, SuccessOf, FailureOf } from 'ts-railway'

export type Effect<Action> = ElmishEffect<Action>

type ResultArgs<Action, Success, Failure, ResultLike extends Result<Success, Failure>> = {
  readonly result: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
  readonly failure: FailureOf<ResultLike> extends never
    ? never
    : (error: FailureOf<ResultLike>) => Action
}

type ResultArgsNoFailure<Action, Success, ResultLike extends Result<Success, never>> = {
  readonly result: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
}

type AsyncResultArgs<Action, Success, Failure, ResultLike extends AsyncResult<Success, Failure>> = {
  readonly asyncResult: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
  readonly failure: FailureOf<ResultLike> extends never
    ? never
    : (error: FailureOf<ResultLike>) => Action
}

type AsyncResultArgsNoFailure<Action, Success, ResultLike extends AsyncResult<Success, never>> = {
  readonly asyncResult: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
}

/** Create effect from action */
function from<Action>(args: ActionArgs<Action>): Effect<Action>

/** Create effect from a function that returns Result<Success, Failure> */
function from<
  Action,
  Success,
  Failure,
  ResultLike extends Result<Success, Failure> = Result<Success, Failure>
>(args: ResultArgs<Action, Success, Failure, ResultLike>): Effect<Action>

/** Create effect from a function that returns Result<Success, never> */
function from<Action, Success, ResultLike extends Result<Success, never> = Result<Success, never>>(
  args: ResultArgsNoFailure<Action, Success, ResultLike>
): Effect<Action>

/** Create effect from a function that returns AsyncResult<Success, Failure> */
function from<
  Action,
  Success,
  Failure,
  ResultLike extends AsyncResult<Success, Failure> = AsyncResult<Success, Failure>
>(args: AsyncResultArgs<Action, Success, Failure, ResultLike>): Effect<Action>

/** Create effect from a function that returns AsyncResult<Success, never> */
function from<
  Action,
  Success,
  ResultLike extends AsyncResult<Success, never> = AsyncResult<Success, never>
>(args: AsyncResultArgsNoFailure<Action, Success, ResultLike>): Effect<Action>

function from<Action, Success, Failure>(
  args:
    | ActionArgs<Action>
    | ResultArgs<Action, Success, Failure, Result<Success, Failure>>
    | ResultArgsNoFailure<Action, Success, Result<Success, never>>
    | AsyncResultArgs<Action, Success, Failure, AsyncResult<Success, Failure>>
    | AsyncResultArgsNoFailure<Action, Success, AsyncResult<Success, never>>
): Effect<Action | ElmishIdleAction> {
  if ('action' in args) {
    return BasicEffect.from(args)
  } else if ('result' in args) {
    const { success, result } = args
    const failure = 'failure' in args ? args.failure : undefined

    return [(dispatch) => dispatch(effectFromResult(result(), success, failure))]
  } else {
    const { success, asyncResult } = args
    const failure = 'failure' in args ? args.failure : undefined

    return [async (dispatch) => dispatch(effectFromResult(await asyncResult(), success, failure))]
  }
}

const effectFromResult = <Action, Success, Failure>(
  result: Result<Success, Failure>,
  success: ((value: Success) => Action) | undefined,
  failure: ((error: Failure) => Action) | undefined
) =>
  result.tag === 'success' && success !== undefined
    ? success(result.success)
    : result.tag === 'failure' && failure !== undefined
    ? failure(result.failure)
    : ElmishIdleAction

export const Effect = {
  ...BasicEffect,
  from
} as const
