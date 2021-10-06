import { Dispatch } from '@ts-elmish/core'

export type AssertDispatch<State, D extends string> = State extends {
  readonly [dispatch in D]: unknown
}
  ? never
  : Readonly<State>

/** Props for elmish-driven component */
export type ElmishProps<
  State extends Record<string, unknown>,
  Action,
  D extends string = 'dispatch'
> = AssertDispatch<State, D> & {
  readonly [dispatch in D]: Dispatch<Action>
}
