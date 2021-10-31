import { Program, ProgramConfig, RunProgram } from '@ts-elmish/common'
import { extractState, connectViaExtension, DebuggerAction, ConnectionOptions } from 'remotedev'

const getActionType = <Action>(action: Action): DebuggerAction => ({
  type: JSON.stringify(action),
  data: action
})

export type TransformAction<Action> = (action: Action) => DebuggerAction

export const insertDebugger =
  <State, Action>(options: ConnectionOptions<Action> = {}) =>
  (runProgram: RunProgram<State, Action>) =>
  ({ update, init, ...config }: ProgramConfig<State, Action>): Program<State, Action> => {
    const connection = connectViaExtension<State, Action>({
      getActionType,
      ...options
    })

    const { stop, setState, ...program } = runProgram({
      ...config,
      init: () => {
        const [state, action] = init()
        connection.init(state)
        return [state, action]
      },
      update: (state, action) => {
        const [nextState, nextEffect] = update(state, action)
        connection.send(action, nextState)
        return [nextState, nextEffect]
      }
    })

    const unsubscribe = connection.subscribe((message) => {
      const { type, payload } = message
      if (type === 'DISPATCH') {
        switch (payload.type) {
          case 'JUMP_TO_ACTION':
          case 'JUMP_TO_STATE':
            return setState(extractState(message))
          case 'IMPORT_STATE': {
            const { computedStates } = payload.nextLiftedState
            const { state } = computedStates[computedStates.length - 1] ?? {}
            return state !== undefined && setState(state)
          }
        }
      }
    })

    return {
      ...program,
      setState,
      stop: () => {
        unsubscribe()
        stop()
      }
    }
  }
