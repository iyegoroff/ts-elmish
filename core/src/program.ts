/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-return-void */
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
    } else if (canRender) {
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
