import { Dispatch } from '@ts-elmish/core'

type KeysOfUnion<T> = T extends T ? keyof T : never
type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never

type Unknown = Record<string, unknown>
type Never = Record<string, never>

export type KeysIntersect<X, Y> = Unknown extends X
  ? Unknown extends Y
    ? true
    : Never extends Y
    ? false
    : true
  : Never extends X
  ? false
  : Unknown extends Y
  ? true
  : Never extends Y
  ? false
  : KeysOfUnion<X> & KeysOfUnion<Y> extends never
  ? false
  : true

export type ElmishProps<State extends Unknown, Action, Props extends Unknown = Never> = {
  readonly dispatch: Dispatch<Action>
} & DistributiveOmit<
  Never extends Props ? State : State & DistributiveOmit<Props, KeysOfUnion<State>>,
  'dispatch'
>

export type RawProps<State, Action, Props> = {
  readonly dispatch: Dispatch<Action>
} & (Never extends Props ? State : State & Props)
