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

export type ActionArgs<Action> = { readonly action: Action }

export type FunctionArgs<Action, Success> = {
  readonly func: () => Success
  readonly done?: (value: Success) => Action
  readonly error?: (error: unknown) => Action
}

export type PromiseArgs<Action, Success> = {
  readonly promise: () => Promise<Success>
  readonly then?: (value: Success) => Action
  readonly error?: (error: unknown) => Action
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
    const { func, done, error } = args

    return [
      (dispatch) => {
        if (typeof error === 'function') {
          try {
            const value = func()
            return typeof done === 'function' ? dispatch(done(value)) : value
          } catch (err) {
            return dispatch(error(err))
          }
        } else {
          const value = func()
          return typeof done === 'function' ? dispatch(done(value)) : value
        }
      }
    ]
  } else {
    const { promise, then, error } = args

    return [
      async (dispatch) => {
        if (typeof error === 'function') {
          try {
            const value = await promise()
            return typeof then === 'function' ? dispatch(then(value)) : value
          } catch (err) {
            return dispatch(error(err))
          }
        } else {
          const value = await promise()
          return typeof then === 'function' ? dispatch(then(value)) : value
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