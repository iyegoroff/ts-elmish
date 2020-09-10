import { ElmishEffect } from '@ts-elmish/core'

export type Effect<Action> = ElmishEffect<Action>

const empty: Effect<never> = []

const none = <Action>(): Effect<Action> => empty

const map = <Action0, Action1>(
  func: (a: Action0) => Action1,
  effect: Effect<Action0>
): Effect<Action1> => effect.map((g) => (dispatch) => g((a) => dispatch(func(a))))

const batch = <Action>(...actions: ReadonlyArray<Effect<Action>>): Effect<Action> =>
  ([] as Effect<Action>).concat(...actions)

type ActionArgs<Action> = { readonly action: Action }

type FunctionArgs<Action, Success> = {
  readonly func: () => Success
  readonly success?: (value: Success) => Action
  readonly failure: (error: unknown) => Action
}

type PromiseArgs<Action, Success> = {
  readonly promise: () => Promise<Success>
  readonly success?: (value: Success) => Action
  readonly failure: (error: unknown) => Action
}

function from<Action>(args: ActionArgs<Action>): Effect<Action>

function from<Action, Success = unknown>(args: FunctionArgs<Action, Success>): Effect<Action>

function from<Action, Success = unknown>(args: PromiseArgs<Action, Success>): Effect<Action>

function from<Action, Success = unknown>(
  args: ActionArgs<Action> | FunctionArgs<Action, Success> | PromiseArgs<Action, Success>
): Effect<Action> {
  if ('action' in args) {
    return [(dispatch) => dispatch(args.action)]
  } else if ('func' in args) {
    const { func, success, failure } = args

    return [
      (dispatch) => {
        try {
          const value = func()
          return typeof success === 'function' ? dispatch(success(value)) : value
        } catch (error) {
          return dispatch(failure(error))
        }
      }
    ]
  } else {
    const { promise, success, failure } = args

    return [
      async (dispatch) => {
        try {
          const value = await promise()
          return typeof success === 'function' ? dispatch(success(value)) : value
        } catch (error) {
          return dispatch(failure(error))
        }
      }
    ]
  }
}

export const Effect = {
  none,
  from,
  map,
  batch
} as const
