export type Dispatch<Action> = (action: Action) => void
export type Effect<Action> = Array<(dispatch: Dispatch<Action>) => void>

export const runProgram = <State, Action>({
  init,
  update,
  view
}: {
  readonly init: () => readonly [State, Effect<Action>]
  readonly update: (state: State, action: Action) => readonly [State, Effect<Action>]
  readonly view: (state: State) => void
}) => {
  let canRender = false
  let [state, effects] = init()

  const run = () => {
    const effect = effects.shift()

    if (effect !== undefined) {
      effect(dispatch)
    }

    if (canRender) {
      view(state)
    } else {
      canRender = true
    }
  }

  const dispatch: Dispatch<Action> = (action) => {
    const [nextState, nextEffect] = update(state, action)
    state = nextState
    effects.push(...nextEffect)

    run()
  }

  run()

  return [state, dispatch] as const
}
