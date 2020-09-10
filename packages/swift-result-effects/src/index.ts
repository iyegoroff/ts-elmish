import { ElmishEffect } from '@ts-elmish/core'
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
  readonly failure: (error: unknown) => Action
  readonly resultFailure?: (error: Failure) => Action
}

type AsyncResultArgs<Action, Success, Failure> = {
  readonly asyncResult: () => AsyncResult<Success, Failure>
  readonly success?: (value: Success) => Action
  readonly failure: (error: unknown) => Action
  readonly resultFailure?: (error: Failure) => Action
}

function from<Action>(args: ActionArgs<Action>): Effect<Action>

function from<Action, Success = unknown>(args: FunctionArgs<Action, Success>): Effect<Action>

function from<Action, Success = unknown>(args: PromiseArgs<Action, Success>): Effect<Action>

function from<Action, Success = unknown, Failure = unknown>(
  args: ResultArgs<Action, Success, Failure>
): Effect<Action>

function from<Action, Success = unknown, Failure = unknown>(
  args: AsyncResultArgs<Action, Success, Failure>
): Effect<Action>

function from<Action, Success = unknown, Failure = unknown>(
  args:
    | ActionArgs<Action>
    | FunctionArgs<Action, Success>
    | PromiseArgs<Action, Success>
    | ResultArgs<Action, Success, Failure>
    | AsyncResultArgs<Action, Success, Failure>
): Effect<Action> {
  if ('action' in args) {
    return BasicEffect.from(args)
  } else if ('promise' in args) {
    return BasicEffect.from(args)
  } else if ('func' in args) {
    return BasicEffect.from(args)
  } else if ('result' in args) {
    const { failure, success, resultFailure = args.failure, result } = args

    return [
      (dispatch) => {
        try {
          const value = result()
          return value.tag === 'failure'
            ? dispatch(resultFailure(value.failure))
            : typeof success === 'function'
            ? dispatch(success(value.success))
            : value.success
        } catch (error) {
          return dispatch(failure(error))
        }
      }
    ]
  } else {
    const { failure, success, resultFailure = args.failure, asyncResult } = args

    return [
      async (dispatch) => {
        try {
          const value = await asyncResult()
          return value.tag === 'failure'
            ? dispatch(resultFailure(value.failure))
            : typeof success === 'function'
            ? dispatch(success(value.success))
            : value.success
        } catch (error) {
          return dispatch(failure(error))
        }
      }
    ]
  }
}

export const Effect = {
  ...BasicEffect,
  from
} as const
