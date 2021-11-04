import { ProgramConfig, Dispatch, IdleAction, Program } from '@ts-elmish/common'

export const runProgram = <State, Action>({
  init,
  update,
  view
}: ProgramConfig<State, Action>): Program<State, Action | IdleAction> => {
  let [state, [...effects]] = init()
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

  const setState = (nextState: State) => {
    state = nextState

    run()
  }

  const dispatch: Dispatch<Action | IdleAction> = (action) => {
    if (action !== IdleAction && isRunning) {
      const [nextState, nextEffect] = update(state, action)
      state = nextState
      effects.push(...nextEffect)
    }

    run()

    return undefined
  }

  run()

  return { initialState: state, dispatch, stop, setState }
}
