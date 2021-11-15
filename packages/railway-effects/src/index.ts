import { IdleAction, Effect as Eff } from '@ts-elmish/common'
import { Effect as BasicEffect, ActionArgs } from '@ts-elmish/basic-effects'
import { Result, SomeResult, SuccessOf, FailureOf } from 'ts-railway'

export type Effect<Action> = Eff<Action>

type ResultArgs<Action, Success, Failure, ResultLike extends SomeResult<Success, Failure>> = {
  readonly result: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
  readonly failure: FailureOf<ResultLike> extends never
    ? never
    : (error: FailureOf<ResultLike>) => Action
}

type ResultArgsAlt<Action, Success, Failure, ResultLike extends SomeResult<Success, Failure>> = {
  readonly result: () => ResultLike
  readonly success?: (value: Success) => Action
  readonly failure: Failure extends never ? never : (error: Failure) => Action
}

type ResultArgsNoFailure<Action, Success, ResultLike extends SomeResult<Success, never>> = {
  readonly result: () => ResultLike
  readonly success?: (value: SuccessOf<ResultLike>) => Action
}

type ResultArgsNoFailureAlt<Action, Success, ResultLike extends SomeResult<Success, never>> = {
  readonly result: () => ResultLike
  readonly success?: (value: Success) => Action
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

/** Create effect from a function that returns SomeResult<Success, Failure> */
function from<
  Action,
  Success,
  Failure,
  ResultLike extends SomeResult<Success, Failure> = SomeResult<Success, Failure>
>(args: ResultArgsAlt<Action, Success, Failure, ResultLike>): Effect<Action>

/** Create effect from a function that returns SomeResult<Success, never> */
function from<
  Action,
  Success,
  ResultLike extends SomeResult<Success, never> = SomeResult<Success, never>
>(args: ResultArgsNoFailure<Action, Success, ResultLike>): Effect<Action>

/** Create effect from a function that returns SomeResult<Success, never> */
function from<
  Action,
  Success,
  ResultLike extends SomeResult<Success, never> = SomeResult<Success, never>
>(args: ResultArgsNoFailureAlt<Action, Success, ResultLike>): Effect<Action>

function from<Action, Success, Failure>(
  args:
    | ActionArgs<Action>
    | ResultArgs<Action, Success, Failure, SomeResult<Success, Failure>>
    | ResultArgsAlt<Action, Success, Failure, SomeResult<Success, Failure>>
    | ResultArgsNoFailure<Action, Success, SomeResult<Success, never>>
    | ResultArgsNoFailureAlt<Action, Success, SomeResult<Success, never>>
): Effect<Action | IdleAction> {
  if ('action' in args) {
    return BasicEffect.from(args)
  } else {
    const { success, result } = args
    const failure = 'failure' in args ? args.failure : undefined
    const matcher = { success, failure, default: IdleAction } as const

    return [
      (dispatch) => {
        const val = result()
        return 'then' in val
          ? val.then((async) => dispatch(Result.match(matcher, async)))
          : dispatch(Result.match(matcher, val))
      }
    ]
  }
}

export const Effect = {
  ...BasicEffect,
  from
} as const
