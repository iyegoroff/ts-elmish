import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import { ruleTester } from '../utils'
import rule from '../../source/rules/updates-from-actions'

ruleTester({ types: true }).run('updates-from-actions', rule, {
  valid: [
    fromFixture(
      stripIndent`
        // VALID
        import { Effect, Action } from '@ts-elmish/core'
        import { setErrorAction, setErrorUpdate } from './set-error'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]
          | readonly ['can-navigate']

        export const setXAction = (val: number): Action => ['set-x', val]
        // const setYAction = (val: number): Action => ['set-y', val]
        // const canNavigateAction = (): Action => ['can-navigate']

        type StateEffect = readonly [State, Effect<Action>]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action): StateEffect => {
          switch (action[0]) {
            case 'set-x':
              return setXUpdate(state, action)

            case 'set-y':
              return setYUpdate(state, action)

            case 'set-error':
              return setErrorUpdate(state, action)

            case 'can-navigate':
              return canNavigateUpdate(state, action)
          }
        }

        const canNavigateUpdate = (state: State, action: readonly ['can-navigate']): StateEffect => {
          return [state, Effect.none()]
        }

        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `
    )
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // INVALID - noAction
        import { setErrorAction, setErrorUpdate } from './set-error'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly [tag: 'set-x', number]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noAction]
          | readonly [tag: 'set-y', number]
          | readonly [tag: 'set-error', string]

        type StateEffect = readonly [State, Effect<Action>]

        // const setYAction = (val: number): Action => ['set-y', val]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action): StateEffect => {
          switch (action[0]) {
            case 'set-x':
              return setXUpdate(state, action)

            case 'set-y':
              return setYUpdate(state, action)

            case 'set-error':
              return setErrorUpdate(state, action)
          }
        }

        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noAction
          import { setErrorAction, setErrorUpdate } from './set-error'

          type State = {
            readonly x: number
            readonly y: number
          }

          type Action =
            | readonly [tag: 'set-x', number]
            | readonly [tag: 'set-y', number]
            | readonly [tag: 'set-error', string]

          type StateEffect = readonly [State, Effect<Action>]

          // const setYAction = (val: number): Action => ['set-y', val]

          // const setXAction = (val: number): Action => ['set-x', val]

          export const initX = (state: State): StateEffect => {
            return [state, Effect.none()]
          }

          export const updateX = (state: State, action: Action): StateEffect => {
            switch (action[0]) {
              case 'set-x':
                return setXUpdate(state, action)

              case 'set-y':
                return setYUpdate(state, action)

              case 'set-error':
                return setErrorUpdate(state, action)
            }
          }

          const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
            return [{ ...state, x }, Effect.none()]
          }

          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }

          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - noAction
        import { setsErrorAction, setsErrorUpdate } from './set-error'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly ['set-x', number]
          | readonly [tag: 'set-y', y: number]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noAction]
          | readonly ['sets-error', string]

        type StateEffect = readonly [State, Effect<Action>]

        const setXAction = (val: number): Action => ['set-x', val]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action): StateEffect => {
          switch (action[0]) {
            case 'set-x':
              return setXUpdate(state, action)

            case 'set-y':
              return setYUpdate(state, action)

            case 'sets-error':
              return setsErrorUpdate(state, action)
          }
        }

        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noAction
          import { setsErrorAction, setsErrorUpdate } from './set-error'

          type State = {
            readonly x: number
            readonly y: number
          }

          type Action =
            | readonly ['set-x', number]
            | readonly [tag: 'set-y', y: number]
            | readonly ['sets-error', string]

          type StateEffect = readonly [State, Effect<Action>]

          const setXAction = (val: number): Action => ['set-x', val]

          // const setYAction = (val: number): Action => ['set-y', val]

          export const initX = (state: State): StateEffect => {
            return [state, Effect.none()]
          }

          export const updateX = (state: State, action: Action): StateEffect => {
            switch (action[0]) {
              case 'set-x':
                return setXUpdate(state, action)

              case 'set-y':
                return setYUpdate(state, action)

              case 'sets-error':
                return setsErrorUpdate(state, action)
            }
          }

          const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
            return [{ ...state, x }, Effect.none()]
          }

          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }

          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - noAction
        import { setErrorUpdate } from './set-error'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noAction]

        type StateEffect = readonly [State, Effect<Action>]

        const setXAction = (val: number): Action => ['set-x', val]
        // const setYAction = (val: number): Action => ['set-y', val]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action): StateEffect => {
          switch (action[0]) {
            case 'set-x':
              return setXUpdate(state, action)

            case 'set-y':
              return setYUpdate(state, action)

            case 'set-error':
              return setErrorUpdate(state, action)
          }
        }

        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noAction
          import { setErrorUpdate } from './set-error'

          type State = {
            readonly x: number
            readonly y: number
          }

          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]

          type StateEffect = readonly [State, Effect<Action>]

          const setXAction = (val: number): Action => ['set-x', val]
          // const setYAction = (val: number): Action => ['set-y', val]

          // const setErrorAction = (val: string): Action => ['set-error', val]

          export const initX = (state: State): StateEffect => {
            return [state, Effect.none()]
          }

          export const updateX = (state: State, action: Action): StateEffect => {
            switch (action[0]) {
              case 'set-x':
                return setXUpdate(state, action)

              case 'set-y':
                return setYUpdate(state, action)

              case 'set-error':
                return setErrorUpdate(state, action)
            }
          }

          const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
            return [{ ...state, x }, Effect.none()]
          }

          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }

          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - noUpdate
        import { Effect, Action } from '@ts-elmish/core'
        import { setErrorAction, setErrorUpdate } from './set-error'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly ['set-todo-filter', number]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]
          | readonly ['set-y', number]
          | readonly ['set-error', string]

        const setTodoFilterAction = (val: number): Action => ['set-todo-filter', val]
        // const setYAction = (val: number): Action => ['set-y', val]

        type StateEffect = readonly [State, Effect<Action>]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action): StateEffect => {
          switch (action[0]) {
            case 'set-todo-filter':
              return setTodoFilterUpdate(state, action)

            case 'set-y':
              return setYUpdate(state, action)

            case 'set-error':
              return setErrorUpdate(state, action)
          }
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noUpdate
          import { Effect, Action } from '@ts-elmish/core'
          import { setErrorAction, setErrorUpdate } from './set-error'

          type State = {
            readonly x: number
            readonly y: number
          }

          type Action =
            | readonly ['set-todo-filter', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]

          const setTodoFilterAction = (val: number): Action => ['set-todo-filter', val]
          // const setYAction = (val: number): Action => ['set-y', val]

          type StateEffect = readonly [State, Effect<Action>]

          export const initX = (state: State): StateEffect => {
            return [state, Effect.none()]
          }

          const setTodoFilterUpdate = (
            state: State,
            [, todoFilter]: readonly ['set-todo-filter', number]
          ): StateEffect => {
            return [{ ...state, todoFilter }, Effect.none()]
          }

          export const updateX = (state: State, action: Action): StateEffect => {
            switch (action[0]) {
              case 'set-todo-filter':
                return setTodoFilterUpdate(state, action)

              case 'set-y':
                return setYUpdate(state, action)

              case 'set-error':
                return setErrorUpdate(state, action)
            }
          }

          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }

          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - noUpdate
        import { Effect, Action } from '@ts-elmish/core'
        import { setsErrorAction } from './set-error'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['sets-error', string]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]

        const setXAction = (val: number): Action => ['set-x', val]
        // const setYAction = (val: number): Action => ['set-y', val]

        type StateEffect = readonly [State, Effect<Action>]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action): StateEffect => {
          switch (action[0]) {
            case 'set-x':
              return setXUpdate(state, action)

            case 'set-y':
              return setYUpdate(state, action)

            case 'sets-error':
              return setsErrorUpdate(state, action)
          }
        }

        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noUpdate
          import { Effect, Action } from '@ts-elmish/core'
          import { setsErrorAction } from './set-error'

          type State = {
            readonly x: number
            readonly y: number
          }

          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['sets-error', string]

          const setXAction = (val: number): Action => ['set-x', val]
          // const setYAction = (val: number): Action => ['set-y', val]

          type StateEffect = readonly [State, Effect<Action>]

          export const initX = (state: State): StateEffect => {
            return [state, Effect.none()]
          }

          const setsErrorUpdate = (
            state: State,
            action: readonly ['sets-error', string]
          ): StateEffect => {
            return [state, Effect.none()]
          }

          export const updateX = (state: State, action: Action): StateEffect => {
            switch (action[0]) {
              case 'set-x':
                return setXUpdate(state, action)

              case 'set-y':
                return setYUpdate(state, action)

              case 'sets-error':
                return setsErrorUpdate(state, action)
            }
          }

          const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
            return [{ ...state, x }, Effect.none()]
          }

          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }

          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - noAction, noUpdate
        import { Effect, Action } from '@ts-elmish/core'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noAction]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]

        type StateEffect = readonly [State, Effect<Action>]

        const setXAction = (val: number): Action => ['set-x', val]
        // const setYAction = (val: number): Action => ['set-y', val]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action): StateEffect => {
          switch (action[0]) {
            case 'set-x':
              return setXUpdate(state, action)

            case 'set-y':
              return setYUpdate(state, action)

            case 'set-error':
              return setErrorUpdate(state, action)
          }
        }

        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noAction, noUpdate
          import { Effect, Action } from '@ts-elmish/core'

          type State = {
            readonly x: number
            readonly y: number
          }

          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]

          type StateEffect = readonly [State, Effect<Action>]

          const setXAction = (val: number): Action => ['set-x', val]
          // const setYAction = (val: number): Action => ['set-y', val]

          // const setErrorAction = (val: string): Action => ['set-error', val]

          export const initX = (state: State): StateEffect => {
            return [state, Effect.none()]
          }

          const setErrorUpdate = (
            state: State,
            [, error]: readonly ['set-error', string]
          ): StateEffect => {
            return [{ ...state, error }, Effect.none()]
          }

          export const updateX = (state: State, action: Action): StateEffect => {
            switch (action[0]) {
              case 'set-x':
                return setXUpdate(state, action)

              case 'set-y':
                return setYUpdate(state, action)

              case 'set-error':
                return setErrorUpdate(state, action)
            }
          }

          const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
            return [{ ...state, x }, Effect.none()]
          }

          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }

          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - invalidUpdate
        import { Effect, Action } from '@ts-elmish/core'
        import { setErrorAction, setErrorUpdate } from './set-error'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]

        const setXAction = (val: number): Action => ['set-x', val]
        // const setYAction = (val: number): Action => ['set-y', val]

        type StateEffect = readonly [State, Effect<Action>]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action): StateEffect => [state, Effect.none()]
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]

        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          import { setErrorAction, setErrorUpdate } from './set-error'

          type State = {
            readonly x: number
            readonly y: number
          }

          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]

          const setXAction = (val: number): Action => ['set-x', val]
          // const setYAction = (val: number): Action => ['set-y', val]

          type StateEffect = readonly [State, Effect<Action>]

          export const initX = (state: State): StateEffect => {
            return [state, Effect.none()]
          }

          export const updateX = (state: State, action: Action): StateEffect => {
            switch (action[0]) {
              case 'set-x':
                return setXUpdate(state, action)

              case 'set-y':
                return setYUpdate(state, action)

              case 'set-error':
                return setErrorUpdate(state, action)
            }
          }

          const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
            return [{ ...state, x }, Effect.none()]
          }

          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }

          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - invalidUpdate
        import { Effect, Action } from '@ts-elmish/core'
        import { setErrorAction, setErrorUpdate } from './set-error'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]

        const setXAction = (val: number): Action => ['set-x', val]
        // const setYAction = (val: number): Action => ['set-y', val]

        type StateEffect = readonly [State, Effect<Action>]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action): StateEffect => { switch (action[0]) { case 'set-x': { return setXUpdate(state, action) } case 'set-y': { return setYUpdate(state, action) } } }
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]

        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          import { setErrorAction, setErrorUpdate } from './set-error'

          type State = {
            readonly x: number
            readonly y: number
          }

          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]

          const setXAction = (val: number): Action => ['set-x', val]
          // const setYAction = (val: number): Action => ['set-y', val]

          type StateEffect = readonly [State, Effect<Action>]

          export const initX = (state: State): StateEffect => {
            return [state, Effect.none()]
          }

          export const updateX = (state: State, action: Action): StateEffect => {
            switch (action[0]) {
              case 'set-x':
                return setXUpdate(state, action)

              case 'set-y':
                return setYUpdate(state, action)

              case 'set-error':
                return setErrorUpdate(state, action)
            }
          }

          const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
            return [{ ...state, x }, Effect.none()]
          }

          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }

          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - invalidUpdate
        import { Effect, Action } from '@ts-elmish/core'
        import { setErrorAction, setErrorUpdate } from './set-error'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]

        const setXAction = (val: number): Action => ['set-x', val]
        // const setYAction = (val: number): Action => ['set-y', val]

        type StateEffect = readonly [State, Effect<Action>]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action): StateEffect => { switch (action[0]) { case 'set-x': { return setXUpdate(state, action) } case 'set-y': { return setYUpdate(state, action) } case 'set-error': { return setYUpdate(state, action) } } }
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]

        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          import { setErrorAction, setErrorUpdate } from './set-error'

          type State = {
            readonly x: number
            readonly y: number
          }

          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]

          const setXAction = (val: number): Action => ['set-x', val]
          // const setYAction = (val: number): Action => ['set-y', val]

          type StateEffect = readonly [State, Effect<Action>]

          export const initX = (state: State): StateEffect => {
            return [state, Effect.none()]
          }

          export const updateX = (state: State, action: Action): StateEffect => {
            switch (action[0]) {
              case 'set-x':
                return setXUpdate(state, action)

              case 'set-y':
                return setYUpdate(state, action)

              case 'set-error':
                return setErrorUpdate(state, action)
            }
          }

          const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
            return [{ ...state, x }, Effect.none()]
          }

          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }

          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - invalidUpdate
        import { Effect, Action } from '@ts-elmish/core'
        import { setErrorAction, setErrorUpdate } from './set-error'

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly [tag: 'set-x', x: number]
          | readonly [tag: 'set-y', y: number]
          | readonly [tag: 'set-error', error: string]

        const setXAction = (val: number): Action => ['set-x', val]
        // const setYAction = (val: number): Action => ['set-y', val]

        type StateEffect = readonly [State, Effect<Action>]

        export const initX = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const updateX = (state: State, action: Action, effects: Effects): StateEffect => { switch (action[0]) { case 'set-x': { return setXUpdate(state, action) } case 'set-y': { return setYUpdate(state, action) } case 'set-x': { return setErrorUpdate(state, action) } } }
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]

        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }

        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }

        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          import { setErrorAction, setErrorUpdate } from './set-error'

          type State = {
            readonly x: number
            readonly y: number
          }

          type Action =
            | readonly [tag: 'set-x', x: number]
            | readonly [tag: 'set-y', y: number]
            | readonly [tag: 'set-error', error: string]

          const setXAction = (val: number): Action => ['set-x', val]
          // const setYAction = (val: number): Action => ['set-y', val]

          type StateEffect = readonly [State, Effect<Action>]

          export const initX = (state: State): StateEffect => {
            return [state, Effect.none()]
          }

          export const updateX = (state: State, action: Action, effects: Effects): StateEffect => {
            switch (action[0]) {
              case 'set-x':
                return setXUpdate(state, action, effects)

              case 'set-y':
                return setYUpdate(state, action, effects)

              case 'set-error':
                return setErrorUpdate(state, action, effects)
            }
          }

          const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
            return [{ ...state, x }, Effect.none()]
          }

          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }

          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    )
  ]
})
