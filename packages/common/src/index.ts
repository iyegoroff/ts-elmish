type KeysOfUnion<T> = T extends T ? keyof T : never
type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never

type Unknown = Record<string, unknown>
type Never = Record<string, never>

export const IdleAction = Symbol('elmish-idle-action')
export type IdleAction = typeof IdleAction

export type Dispatch<Action> = (action: Action) => undefined

export type Effect<Action> = Array<(dispatch: Dispatch<Action>) => void>

export type ProgramConfig<State, Action> = {
  readonly init: () => readonly [State, Effect<Action>]
  readonly update: (state: State, action: Action) => readonly [State, Effect<Action>]
  readonly view: (state: State, hasEffects: boolean) => void
}

export type Program<State, Action> = {
  readonly initialState: State
  readonly dispatch: Dispatch<Action>
  readonly stop: () => void
  readonly setState: (state: State) => void
}

export type RunProgram<State, Action> = (
  config: ProgramConfig<State, Action>
) => Program<State, Action>

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
  Never extends Required<Props> ? State : State & DistributiveOmit<Props, KeysOfUnion<State>>,
  'dispatch'
>

export type RawProps<State, Action, Props> = {
  readonly dispatch: Dispatch<Action>
} & (Never extends Required<Props> ? State : State & Props)
