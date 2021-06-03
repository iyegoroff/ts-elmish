import { ElmishEffect } from '@ts-elmish/core'
import { ElmishIdleAction } from '@ts-elmish/idle-action'

export type Effect<Action> = ElmishEffect<Action>

const empty: Effect<never> = []

/** Empty effect creator */
const none = <Action>(): Effect<Action> => empty

/** Create effect that maps one action to another */
function map<Action0, Action1>(
  func: (a: Action0) => Action1,
  effect: Effect<Action0>
): Effect<Action1>

function map<Action0, Action1>(
  func: (a: Action0) => Action1,
  effect: Effect<Action0 | ElmishIdleAction>
): Effect<Action1 | ElmishIdleAction> {
  return effect.map(
    (g) => (dispatch) => g((a) => dispatch(a === ElmishIdleAction ? ElmishIdleAction : func(a)))
  )
}

/** Create effect that combines multiple effect creators */
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

/** Create effect from action */
function from<Action>(args: ActionArgs<Action>): Effect<Action>

/** Create effect from any function */
function from<Action, Success = unknown>(args: FunctionArgs<Action, Success>): Effect<Action>

/** Create effect from a function that returns a promise */
function from<Action, Success = unknown>(args: PromiseArgs<Action, Success>): Effect<Action>

function from<Action, Success = unknown>(
  args: ActionArgs<Action> | FunctionArgs<Action, Success> | PromiseArgs<Action, Success>
): Effect<Action | ElmishIdleAction> {
  if ('action' in args) {
    return [(dispatch) => dispatch(args.action)]
  } else if ('func' in args) {
    const { func, done, error } = args

    return [
      (dispatch) => {
        if (typeof error === 'function') {
          try {
            const value = func()
            return dispatch(typeof done === 'function' ? done(value) : ElmishIdleAction)
          } catch (err: unknown) {
            return dispatch(error(err))
          }
        } else {
          const value = func()
          return dispatch(typeof done === 'function' ? done(value) : ElmishIdleAction)
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
            return dispatch(typeof then === 'function' ? then(value) : ElmishIdleAction)
          } catch (err: unknown) {
            return dispatch(error(err))
          }
        } else {
          const value = await promise()
          return dispatch(typeof then === 'function' ? then(value) : ElmishIdleAction)
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
