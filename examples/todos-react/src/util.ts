import { runProgram } from '@ts-elmish/core'
import { Effect } from '@ts-elmish/railway-effects'
import { Result } from 'ts-railway'
import { deepStub, DeepPartial } from 'deep-stub-object'
import { useRef } from 'react'
import { Effects } from './app/effects/types'

export const resolver =
  <T>(value: T) =>
  () =>
    Promise.resolve(value)

export const successResolver =
  <T>(value: T) =>
  () =>
    Promise.resolve(Result.success(value))

// export const failureResolver =
//   <T>(value: T) =>
//   () =>
//     Promise.resolve(Result.failure(value))

export const createTestRun =
  <State, Action>(
    update: (state: State, action: Action, effects: Effects) => readonly [State, Effect<Action>]
  ) =>
  (command: readonly [State, Effect<Action>], effects: Effects) =>
    new Promise((resolve) =>
      runProgram<State, Action>({
        init: () => command,
        update: (state, action) => update(state, action, effects),
        view: (state, hasEffects) => !hasEffects && resolve(state)
      })
    )

export const fail = (message: string) => {
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(message)
}

// eslint-disable-next-line no-null/no-null
export const noRender = null

/* istanbul ignore next */
// eslint-disable-next-line no-null/no-null
export const useNullRef = <T>() => useRef<T>(null)

/* istanbul ignore next */
export const stubEffects = (effects?: DeepPartial<Effects>) =>
  deepStub(effects, (path) => `stubEffects: ${path.join('.')} needs to be defined`)
