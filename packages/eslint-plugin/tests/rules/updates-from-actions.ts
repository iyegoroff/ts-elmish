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

        type State = {
          readonly x: number
          readonly y: number
        }

        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]
          | readonly ['can-navigate']

        const Action = {
          setX: (val: number): Action => ['set-x', val],
          setY: (val: number): Action => ['set-y', val],
          setError: (val: string): Action => ['set-error', val],
          canNavigate: (): Action => ['can-navigate']
        }

        type StateEffect = readonly [State, Effect<Action>]

        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }

        export const update = (state: State, action: Action): StateEffect => {
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

        const setErrorUpdate = (state: State, [, error]: readonly ['set-error', string]): StateEffect => {
          return [{ ...state, error }, Effect.none()]
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
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly [tag: 'set-x', number]
          | readonly [tag: 'set-y', number]
          | readonly [tag: 'set-error', string]
        type StateEffect = readonly [State, Effect<Action>]
        const Action = { setY: (val: number): Action => ['set-y', val], setError: (val: string): Action => ['set-error', val] }
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noAction]
        const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        const update = (state: State, action: Action): StateEffect => {
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
        const setErrorUpdate = (state: State, [, error]: readonly ['set-error', string]): StateEffect => {
          return [{ ...state, error }, Effect.none()]
        }
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noAction
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly [tag: 'set-x', number]
            | readonly [tag: 'set-y', number]
            | readonly [tag: 'set-error', string]
          type StateEffect = readonly [State, Effect<Action>]
          const Action = {
            setX: (val: number): Action => ['set-x', val],
            setY: (val: number): Action => ['set-y', val],
            setError: (val: string): Action => ['set-error', val]
          }
          const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          const update = (state: State, action: Action): StateEffect => {
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
          const setErrorUpdate = (state: State, [, error]: readonly ['set-error', string]): StateEffect => {
            return [{ ...state, error }, Effect.none()]
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
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly ['set-x', number]
          | readonly [tag: 'set-y', y: number]
          | readonly ['sets-error', string]
        type StateEffect = readonly [State, Effect<Action>]
        const Action = {setX: (val: number): Action => ['set-x', val], setsError: (val: string): Action => ['set-error', val]}
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noAction]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action): StateEffect => {
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
        const setsErrorUpdate = (state: State, [, error]: readonly ['set-error', string]): StateEffect => {
          return [{ ...state, error }, Effect.none()]
        }
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noAction
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly ['set-x', number]
            | readonly [tag: 'set-y', y: number]
            | readonly ['sets-error', string]
          type StateEffect = readonly [State, Effect<Action>]
          const Action = {
            setX: (val: number): Action => ['set-x', val],
            setY: (val: number): Action => ['set-y', val],
            setsError: (val: string): Action => ['sets-error', val]
          }
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          export const update = (state: State, action: Action): StateEffect => {
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
          const setsErrorUpdate = (state: State, [, error]: readonly ['set-error', string]): StateEffect => {
            return [{ ...state, error }, Effect.none()]
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
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]
        type StateEffect = readonly [State, Effect<Action>]
        const Action = { setX: (val: number): Action => ['set-x', val], setY: (val: number): Action => ['set-y', val] }
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noAction]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action): StateEffect => {
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
        const setErrorUpdate = (state: State, [, error]: readonly ['set-error', string]): StateEffect => {
          return [{ ...state, error }, Effect.none()]
        }
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noAction
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]
          type StateEffect = readonly [State, Effect<Action>]
          const Action = {
            setX: (val: number): Action => ['set-x', val],
            setY: (val: number): Action => ['set-y', val],
            setError: (val: string): Action => ['set-error', val]
          }
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          export const update = (state: State, action: Action): StateEffect => {
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
          const setErrorUpdate = (state: State, [, error]: readonly ['set-error', string]): StateEffect => {
            return [{ ...state, error }, Effect.none()]
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
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly ['set-todo-filter', number]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]
          | readonly ['set-y', number]
          | readonly ['set-error', string]
        const Action = {
          setError: (val: string): Action => ['set-error', val],
          setTodoFilter: (val: number): Action => ['set-todo-filter', val],
          setY: (val: number): Action => ['set-y', val]
        }
        type StateEffect = readonly [State, Effect<Action>]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action): StateEffect => {
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
        const setErrorUpdate = (state: State, [, error]: readonly ['set-error', string]): StateEffect => {
          return [{ ...state, error }, Effect.none()]
        }
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noUpdate
          import { Effect, Action } from '@ts-elmish/core'
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly ['set-todo-filter', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]
          const Action = {
            setError: (val: string): Action => ['set-error', val],
            setTodoFilter: (val: number): Action => ['set-todo-filter', val],
            setY: (val: number): Action => ['set-y', val]
          }
          type StateEffect = readonly [State, Effect<Action>]
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          const setTodoFilterUpdate = (
            state: State,
            [, todoFilter]: readonly ['set-todo-filter', number]
          ): StateEffect => {
            return [{ ...state, todoFilter }, Effect.none()]
          }

          export const update = (state: State, action: Action): StateEffect => {
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
          const setErrorUpdate = (state: State, [, error]: readonly ['set-error', string]): StateEffect => {
            return [{ ...state, error }, Effect.none()]
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
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['sets-error', string]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]
        const Action = {
          setY: (val: number): Action => ['set-y', val],
          setX: (val: number): Action => ['set-x', val],
          setsError: (val: string): Action => ['set-error', val]
        }
        type StateEffect = readonly [State, Effect<Action>]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action): StateEffect => {
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
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['sets-error', string]
          const Action = {
            setY: (val: number): Action => ['set-y', val],
            setX: (val: number): Action => ['set-x', val],
            setsError: (val: string): Action => ['set-error', val]
          }
          type StateEffect = readonly [State, Effect<Action>]
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          const setsErrorUpdate = (
            state: State,
            action: readonly ['sets-error', string]
          ): StateEffect => {
            return [state, Effect.none()]
          }

          export const update = (state: State, action: Action): StateEffect => {
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
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]
        type StateEffect = readonly [State, Effect<Action>]
        const Action = { setY: (val: number): Action => ['set-y', val],setX: (val: number): Action => ['set-x', val]}
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noAction]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action): StateEffect => {
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
          const Action = {
            setX: (val: number): Action => ['set-x', val],
            setY: (val: number): Action => ['set-y', val],
            setError: (val: string): Action => ['set-error', val]
          }
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          const setErrorUpdate = (
            state: State,
            [, error]: readonly ['set-error', string]
          ): StateEffect => {
            return [{ ...state, error }, Effect.none()]
          }

          export const update = (state: State, action: Action): StateEffect => {
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
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]
        const Action = {
          setError: (val: string): Action => ['set-error', val],
          setY: (val: number): Action => ['set-y', val],
          setX: (val: number): Action => ['set-x', val]
        }
        type StateEffect = readonly [State, Effect<Action>]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action): StateEffect => [state, Effect.none()]
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]
        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }
        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }
        const setErrorUpdate = (
          state: State,
          [, error]: readonly ['set-error', string]
        ): StateEffect => {
          return [{ ...state, error }, Effect.none()]
        }
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]
          const Action = {
            setError: (val: string): Action => ['set-error', val],
            setY: (val: number): Action => ['set-y', val],
            setX: (val: number): Action => ['set-x', val]
          }
          type StateEffect = readonly [State, Effect<Action>]
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          export const update = (state: State, action: Action): StateEffect => {
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
          const setErrorUpdate = (
            state: State,
            [, error]: readonly ['set-error', string]
          ): StateEffect => {
            return [{ ...state, error }, Effect.none()]
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
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]
        const Action = {
          setError: (val: string): Action => ['set-error', val],
          setY: (val: number): Action => ['set-y', val],
          setX: (val: number): Action => ['set-x', val]
        }
        type StateEffect = readonly [State, Effect<Action>]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action): StateEffect => { switch (action[0]) { case 'set-x': { return setXUpdate(state, action) } case 'set-y': { return setYUpdate(state, action) } } }
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]
        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }
        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }
        const setErrorUpdate = (
          state: State,
          [, error]: readonly ['set-error', string]
        ): StateEffect => {
          return [{ ...state, error }, Effect.none()]
        }
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]
          const Action = {
            setError: (val: string): Action => ['set-error', val],
            setY: (val: number): Action => ['set-y', val],
            setX: (val: number): Action => ['set-x', val]
          }
          type StateEffect = readonly [State, Effect<Action>]
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          export const update = (state: State, action: Action): StateEffect => {
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
          const setErrorUpdate = (
            state: State,
            [, error]: readonly ['set-error', string]
          ): StateEffect => {
            return [{ ...state, error }, Effect.none()]
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
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly ['set-x', number]
          | readonly ['set-y', number]
          | readonly ['set-error', string]
        const Action = {
          setError: (val: string): Action => ['set-error', val],
          setY: (val: number): Action => ['set-y', val],
          setX: (val: number): Action => ['set-x', val]
        }
        type StateEffect = readonly [State, Effect<Action>]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action): StateEffect => { switch (action[0]) { case 'set-x': { return setXUpdate(state, action) } case 'set-y': { return setYUpdate(state, action) } case 'set-error': { return setYUpdate(state, action) } } }
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]
        const setXUpdate = (state: State, [, x]: readonly ['set-x', number]): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }
        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }
        const setErrorUpdate = (
          state: State,
          [, error]: readonly ['set-error', string]
        ): StateEffect => {
          return [{ ...state, error }, Effect.none()]
        }
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly ['set-x', number]
            | readonly ['set-y', number]
            | readonly ['set-error', string]
          const Action = {
            setError: (val: string): Action => ['set-error', val],
            setY: (val: number): Action => ['set-y', val],
            setX: (val: number): Action => ['set-x', val]
          }
          type StateEffect = readonly [State, Effect<Action>]
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          export const update = (state: State, action: Action): StateEffect => {
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
          const setErrorUpdate = (
            state: State,
            [, error]: readonly ['set-error', string]
          ): StateEffect => {
            return [{ ...state, error }, Effect.none()]
          }
          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - noAction, noUpdate, invalidUpdate
        import { Effect, Action } from '@ts-elmish/core'
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly ['x-action', number]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]
        const Action = {}
                       ~~ [noAction]
        type StateEffect = readonly [State, Effect<Action>]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action): StateEffect => {}
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noAction, noUpdate, invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly ['x-action', number]
          const Action = {
            xAction: (val: number): Action => ['x-action', val]
          }
          type StateEffect = readonly [State, Effect<Action>]
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          const xUpdate = (
            state: State,
            [, action]: readonly ['x-action', number]
          ): StateEffect => {
            const [x, xEffect] = XState.update(state.x, action)

            return [{ ...state, x }, Effect.map(Action.xAction, xEffect)]
          }

          export const update = (state: State, action: Action): StateEffect => {
            switch (action[0]) {
              case 'x-action':
                return xUpdate(state, action)
            }
          }
          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - noAction, noUpdate, invalidUpdate
        import { Effect, Action } from '@ts-elmish/core'
        import { Effects } from '../effects'
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly ['x-action', number]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]
        const Action = {}
                       ~~ [noAction]
        type StateEffect = readonly [State, Effect<Action>]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action, effects: Effects): StateEffect => {}
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - noAction, noUpdate, invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          import { Effects } from '../effects'
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly ['x-action', number]
          const Action = {
            xAction: (val: number): Action => ['x-action', val]
          }
          type StateEffect = readonly [State, Effect<Action>]
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          const xUpdate = (
            state: State,
            [, action]: readonly ['x-action', number],
            effects: Effects
          ): StateEffect => {
            const [x, xEffect] = XState.update(state.x, action, effects)

            return [{ ...state, x }, Effect.map(Action.xAction, xEffect)]
          }

          export const update = (state: State, action: Action, effects: Effects): StateEffect => {
            switch (action[0]) {
              case 'x-action':
                return xUpdate(state, action, effects)
            }
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
        import { Effects } from '../effects'
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly ['x-action', number]
        const Action = {
          xAction: (val: number): Action => ['x-action', val]
        }
        type StateEffect = readonly [State, Effect<Action>]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        const xUpdate = (
          state: State,
          [, action]: readonly ['x-action', number],
          eff: Effects
        ): StateEffect => {
          const [x, xEffect] = updateX(state.x, action, eff)
          return [{ ...state, x }, Effect.map(Action.xAction, xEffect)]
        }
        export const update = (state: State, action: Action, effects: Effects): StateEffect => {}
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          import { Effects } from '../effects'
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly ['x-action', number]
          const Action = {
            xAction: (val: number): Action => ['x-action', val]
          }
          type StateEffect = readonly [State, Effect<Action>]
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          const xUpdate = (
            state: State,
            [, action]: readonly ['x-action', number],
            eff: Effects
          ): StateEffect => {
            const [x, xEffect] = updateX(state.x, action, eff)
            return [{ ...state, x }, Effect.map(Action.xAction, xEffect)]
          }
          export const update = (state: State, action: Action, effects: Effects): StateEffect => {
            switch (action[0]) {
              case 'x-action':
                return xUpdate(state, action, effects)
            }
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
        type State = {
          readonly x: number
          readonly y: number
        }
        type Action =
          | readonly [tag: 'set-x', x: number]
          | readonly [tag: 'set-y', y: number]
          | readonly [tag: 'set-error', error: string]
        const Action = {
          setError: (val: string): Action => ['set-error', val],
          setY: (val: number): Action => ['set-y', val],
          setX: (val: number): Action => ['set-x', val]
        }
        type StateEffect = readonly [State, Effect<Action>]
        export const init = (state: State): StateEffect => {
          return [state, Effect.none()]
        }
        export const update = (state: State, action: Action, effects: Effects): StateEffect => { switch (action[0]) { case 'set-x': { return setXUpdate(state, action) } case 'set-y': { return setYUpdate(state, action) } case 'set-x': { return setErrorUpdate(state, action) } } }
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]
        const setXUpdate = (state: State, [, x]: readonly ['set-x', number], effects: Effects): StateEffect => {
          return [{ ...state, x }, Effect.none()]
        }
        const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
          return [{ ...state, y }, Effect.none()]
        }
        const setErrorUpdate = (
          state: State,
          [, error]: readonly ['set-error', string]
        ): StateEffect => {
          return [{ ...state, error }, Effect.none()]
        }
        export type XState = State
        export type XAction = Action
        export type XStateEffect = StateEffect
      `,
      {
        output: stripIndent`
          // INVALID - invalidUpdate
          import { Effect, Action } from '@ts-elmish/core'
          type State = {
            readonly x: number
            readonly y: number
          }
          type Action =
            | readonly [tag: 'set-x', x: number]
            | readonly [tag: 'set-y', y: number]
            | readonly [tag: 'set-error', error: string]
          const Action = {
            setError: (val: string): Action => ['set-error', val],
            setY: (val: number): Action => ['set-y', val],
            setX: (val: number): Action => ['set-x', val]
          }
          type StateEffect = readonly [State, Effect<Action>]
          export const init = (state: State): StateEffect => {
            return [state, Effect.none()]
          }
          export const update = (state: State, action: Action, effects: Effects): StateEffect => {
            switch (action[0]) {
              case 'set-x':
                return setXUpdate(state, action, effects)

              case 'set-y':
                return setYUpdate(state, action)

              case 'set-error':
                return setErrorUpdate(state, action)
            }
          }
          const setXUpdate = (state: State, [, x]: readonly ['set-x', number], effects: Effects): StateEffect => {
            return [{ ...state, x }, Effect.none()]
          }
          const setYUpdate = (state: State, [, y]: readonly ['set-y', number]): StateEffect => {
            return [{ ...state, y }, Effect.none()]
          }
          const setErrorUpdate = (
            state: State,
            [, error]: readonly ['set-error', string]
          ): StateEffect => {
            return [{ ...state, error }, Effect.none()]
          }
          export type XState = State
          export type XAction = Action
          export type XStateEffect = StateEffect
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - noAction, noUpdate, invalidUpdate
        import { Effect } from '@ts-elmish/swift-result-effects'
        import { DomainError } from '../../../domain/types'
        import { ServicesError } from '../../../services/types'
        import { Effects } from '../../effects/types'
        type Action =
          | readonly ['log-error', DomainError | ServicesError]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]
        const Action = {}
                       ~~ [noAction]
        const update = (action: Action, effects: Effects): Effect<Action> => {}
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]
      `,
      {
        output: stripIndent`
          // INVALID - noAction, noUpdate, invalidUpdate
          import { Effect } from '@ts-elmish/swift-result-effects'
          import { DomainError } from '../../../domain/types'
          import { ServicesError } from '../../../services/types'
          import { Effects } from '../../effects/types'
          type Action =
            | readonly ['log-error', DomainError | ServicesError]
          const Action = {
            logError: (val: DomainError | ServicesError): Action => ['log-error', val]
          }
          const logErrorUpdate = (
            action: readonly ['log-error', DomainError | ServicesError],
            effects: Effects
          ): Effect<Action> => {
            return Effect.none()
          }

          const update = (action: Action, effects: Effects): Effect<Action> => {
            switch (action[0]) {
              case 'log-error':
                return logErrorUpdate(action, effects)
            }
          }
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - noAction, noUpdate, invalidUpdate
        import { Effect } from '@ts-elmish/swift-result-effects'
        import { DomainError } from '../../../domain/types'
        import { Effects } from '../../effects/types'
        import { ErrorHandlerAction, ErrorHandlerState } from '../error-handler'
        type State = {
          readonly backendAddressStatus: 'valid' | 'invalid'
        }
        type Action =
          | readonly ['error-handler-action', ErrorHandlerAction]
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]
        const Action = {}
                       ~~ [noAction]
        type StateEffect = readonly [State, Effect<Action>]
        const init = (effects: Effects): StateEffect => {
          return [{ backendAddressStatus: 'valid' }, Effect.none()]
        }
        const update = (state: State, action: Action, effects: Effects): StateEffect => {}
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]
      `,
      {
        output: stripIndent`
          // INVALID - noAction, noUpdate, invalidUpdate
          import { Effect } from '@ts-elmish/swift-result-effects'
          import { DomainError } from '../../../domain/types'
          import { Effects } from '../../effects/types'
          import { ErrorHandlerAction, ErrorHandlerState } from '../error-handler'
          type State = {
            readonly backendAddressStatus: 'valid' | 'invalid'
          }
          type Action =
            | readonly ['error-handler-action', ErrorHandlerAction]
          const Action = {
            errorHandlerAction: (val: ErrorHandlerAction): Action => ['error-handler-action', val]
          }
          type StateEffect = readonly [State, Effect<Action>]
          const init = (effects: Effects): StateEffect => {
            return [{ backendAddressStatus: 'valid' }, Effect.none()]
          }
          const errorHandlerUpdate = (
            state: State,
            [, action]: readonly ['error-handler-action', ErrorHandlerAction],
            effects: Effects
          ): StateEffect => {
            const errorHandlerEffect = ErrorHandlerState.update(action, effects)

            return [state, Effect.map(Action.errorHandlerAction, errorHandlerEffect)]
          }

          const update = (state: State, action: Action, effects: Effects): StateEffect => {
            switch (action[0]) {
              case 'error-handler-action':
                return errorHandlerUpdate(state, action, effects)
            }
          }
        `
      }
    ),
    fromFixture(
      stripIndent`
        // INVALID - noAction, noUpdate, invalidUpdate
        import { Effect } from '@ts-elmish/swift-result-effects'
        import { DomainError } from '../../../domain/types'
        import { Effects } from '../../effects/types'
        import { ErrorHandlerAction, ErrorHandlerState } from '../error-handler'
        type State = {
          readonly backendAddressStatus: 'valid' | 'invalid'
        }
        type Action = readonly ['error-handler-action', ErrorHandlerAction]
                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [noUpdate]
        const Action = {} as const
                       ~~ [noAction]
        type StateEffect = readonly [State, Effect<Action>]
        const init = (effects: Effects): StateEffect => {
          return [{ backendAddressStatus: 'valid' }, Effect.none()]
        }
        // #region update
        const update = (state: State, action: Action, effects: Effects): StateEffect => {}
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [invalidUpdate]
        // #endregion
      `,
      {
        output: stripIndent`
          // INVALID - noAction, noUpdate, invalidUpdate
          import { Effect } from '@ts-elmish/swift-result-effects'
          import { DomainError } from '../../../domain/types'
          import { Effects } from '../../effects/types'
          import { ErrorHandlerAction, ErrorHandlerState } from '../error-handler'
          type State = {
            readonly backendAddressStatus: 'valid' | 'invalid'
          }
          type Action = readonly ['error-handler-action', ErrorHandlerAction]
          const Action = {
            errorHandlerAction: (val: ErrorHandlerAction): Action => ['error-handler-action', val]
          } as const
          type StateEffect = readonly [State, Effect<Action>]
          const init = (effects: Effects): StateEffect => {
            return [{ backendAddressStatus: 'valid' }, Effect.none()]
          }
          const errorHandlerUpdate = (
            state: State,
            [, action]: readonly ['error-handler-action', ErrorHandlerAction],
            effects: Effects
          ): StateEffect => {
            const errorHandlerEffect = ErrorHandlerState.update(action, effects)

            return [state, Effect.map(Action.errorHandlerAction, errorHandlerEffect)]
          }

          // #region update
          const update = (state: State, action: Action, effects: Effects): StateEffect => {
            switch (action[0]) {
              case 'error-handler-action':
                return errorHandlerUpdate(state, action, effects)
            }
          }
          // #endregion
        `
      }
    )
  ]
})
