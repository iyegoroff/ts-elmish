import { ElmishEffect } from '@ts-elmish/core'
import { ElmishIdleAction } from '@ts-elmish/idle-action'
import { Effect as BasicEffect, ActionArgs } from '@ts-elmish/basic-effects'
import { Result, SomeResult, SuccessOf, FailureOf } from 'ts-railway'

export type Effect<Action> = ElmishEffect<Action>

type ResultArgs<Action, Success, Failure, ResultLike extends SomeResult<Success, Failure>> = {
  readonly result: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
  readonly failure: FailureOf<ResultLike> extends never
    ? never
    : (error: FailureOf<ResultLike>) => Action
}

type ResultArgsNoFailure<Action, Success, ResultLike extends SomeResult<Success, never>> = {
  readonly result: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
}

/** Create effect from action */
function from<Action>(args: ActionArgs<Action>): Effect<Action>

/** Create effect from a function that returns SomeResult<Success, Failure> */
function from<
  Action,
  Success,
  Failure,
  ResultLike extends SomeResult<Success, Failure> = SomeResult<Success, Failure>
>(args: ResultArgs<Action, Success, Failure, ResultLike>): Effect<Action>

/** Create effect from a function that returns SomeResult<Success, never> */
function from<
  Action,
  Success,
  ResultLike extends SomeResult<Success, never> = SomeResult<Success, never>
>(args: ResultArgsNoFailure<Action, Success, ResultLike>): Effect<Action>

function from<Action, Success, Failure>(
  args:
    | ActionArgs<Action>
    | ResultArgs<Action, Success, Failure, SomeResult<Success, Failure>>
    | ResultArgsNoFailure<Action, Success, SomeResult<Success, never>>
): Effect<Action | ElmishIdleAction> {
  if ('action' in args) {
    return BasicEffect.from(args)
  } else {
    const { success, result } = args
    const failure = 'failure' in args ? args.failure : undefined

    return [
      (dispatch) => {
        const val = result()
        return 'then' in val
          ? val.then((async) => dispatch(effectFromResult(async, success, failure)))
          : dispatch(effectFromResult(val, success, failure))
      }
    ]
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
