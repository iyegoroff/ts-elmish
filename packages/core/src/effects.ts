import { Effect } from './program'

const empty: Effect<never> = []

const none = <Action>(): Effect<Action> => empty

const map = <Action0, Action1>(
  func: (a: Action0) => Action1,
  effect: Effect<Action0>
): Effect<Action1> => effect.map((g) => (dispatch) => g((a) => dispatch(func(a))))

const batch = <Action>(...actions: ReadonlyArray<Effect<Action>>): Effect<Action> =>
  ([] as Effect<Action>).concat(...actions)

type ActionArgs<Action> = { readonly action: Action }
type FunctionArgs<Action, Success, Failure> = {
  readonly func: () => Success
  readonly success?: (value: Success) => Action
  readonly failure: (error: Failure) => Action
}
type PromiseArgs<Action, Success, Failure> = {
  readonly promise: () => Promise<Success>
  readonly success?: (value: Success) => Action
  readonly failure: (error: Failure) => Action
}

function from<Action>(args: ActionArgs<Action>): Effect<Action>

function from<Action, Success = unknown, Failure = Partial<Error>>(
  args: FunctionArgs<Action, Success, Failure>
): Effect<Action>

function from<Action, Success = unknown, Failure = Partial<Error>>(
  args: PromiseArgs<Action, Success, Failure>
): Effect<Action>

function from<Action, Success = unknown, Failure = Partial<Error>>(
  args:
    | ActionArgs<Action>
    | FunctionArgs<Action, Success, Failure>
    | PromiseArgs<Action, Success, Failure>
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

export const Effects = {
  none,
  from,
  map,
  batch
}
