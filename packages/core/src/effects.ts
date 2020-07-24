/* eslint-disable functional/no-try-statement */
/* eslint-disable @typescript-eslint/promise-function-async */
import { Effect } from './program'

const empty: Effect<never> = []

const none = <Action>(): Effect<Action> => empty

const fromAction = <Action>(action: Action): Effect<Action> => [(dispatch) => dispatch(action)]

const map = <Action0, Action1>(
  func: (a: Action0) => Action1,
  effect: Effect<Action0>
): Effect<Action1> => effect.map((g) => (dispatch) => g((a) => dispatch(func(a))))

const batch = <Action>(...actions: ReadonlyArray<Effect<Action>>): Effect<Action> =>
  ([] as Effect<Action>).concat(...actions)

const fromPromise = <Action, Value = unknown, Err = Error>(
  promise: () => Promise<Value>,
  ofSuccess: (value: Value) => Action,
  ofError: (error: Err) => Action
): Effect<Action> => [
  (dispatch) =>
    promise()
      .then((value) => dispatch(ofSuccess(value)))
      .catch((error) => dispatch(ofError(error)))
]

const attemptPromise = <Action, Value = unknown, Err = Error>(
  promise: () => Promise<Value>,
  ofError: (error: Err) => Action
): Effect<Action> => [(dispatch) => promise().catch((error) => dispatch(ofError(error)))]

const fromFunction = <Action, Value = unknown, Err = Error>(
  func: () => Value,
  ofSuccess: (value: Value) => Action,
  ofError: (error: Err) => Action
): Effect<Action> => [
  (dispatch) => {
    try {
      const value = func()

      return dispatch(ofSuccess(value))
    } catch (error) {
      return dispatch(ofError(error))
    }
  }
]

const attemptFunction = <Action, Value = unknown, Err = Error>(
  func: () => Value,
  ofError: (error: Err) => Action
): Effect<Action> => [
  (dispatch) => {
    try {
      return func()
    } catch (error) {
      return dispatch(ofError(error))
    }
  }
]

export const Effects = {
  none,
  fromAction,
  map,
  batch,
  fromPromise,
  attemptPromise,
  fromFunction,
  attemptFunction
}
