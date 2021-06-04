import { ElmishIdleAction } from '@ts-elmish/idle-action'

export type Dispatch<Action> = (action: Action) => undefined
export type ElmishEffect<Action> = Array<(dispatch: Dispatch<Action>) => void>

export const runProgram = <State, Action>({
  init,
  update,
  view
}: {
  readonly init: () => readonly [State, ElmishEffect<Action>]
  readonly update: (state: State, action: Action) => readonly [State, ElmishEffect<Action>]
  readonly view: (state: State, hasEffects: boolean) => void
}) => {
  let [state, effects] = init()
  let isRunning = true

  const stop = () => {
    isRunning = false
    effects = []
  }

  const run = () => {
    const effect = effects.shift()

    if (effect !== undefined) {
      effect(dispatch)
    }

    view(state, effect !== undefined)
  }

  const dispatch: Dispatch<Action | ElmishIdleAction> = (action) => {
    if (action !== ElmishIdleAction && isRunning) {
      const [nextState, nextEffect] = update(state, action)
      state = nextState
      effects.push(...nextEffect)
    }

    run()

    return undefined
  }

  run()

  return { initialState: state, dispatch, stop } as const
}
