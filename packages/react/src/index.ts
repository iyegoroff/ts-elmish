import React, { useEffect, useRef, useState } from 'react'
import { runProgram } from '@ts-elmish/core'
import { RawProps, KeysIntersect, Dispatch, Effect, RunProgram } from '@ts-elmish/common'

export type { ElmishProps } from '@ts-elmish/common'

/**
 * Creates elmish-driven react component.
 * When component props are updated the elmish runtime is restated
 * unless prop name is present in `skipRestartOnPropChange` array.
 *
 * @param options init, update, view, skipRestartOnPropChange, transformProgram
 *
 * @returns Root elmish react component
 */
export const createElmishRootComponent = <
  State extends Record<string, unknown>,
  Action,
  Props extends Record<string, unknown> = Record<string, never>
>({
  init,
  update,
  view,
  skipRestartOnPropChange = [],
  transformProgram = (run) => run
}: KeysIntersect<State, Props> extends true
  ? never
  : {
      /** Function that takes props and returns initial state & effect */
      readonly init: (props: Props) => readonly [State, Effect<Action>]
      /** Function that takes state & action and returns next state & effect */
      readonly update: (state: State, action: Action) => readonly [State, Effect<Action>]
      /** React component */
      readonly view: React.ComponentType<RawProps<State, Action, Props>>
      /** Array of prop names that prevents elmish runtime from restarting when specified props change */
      readonly skipRestartOnPropChange?: ReadonlyArray<keyof Props>
      /** Function to modify inputs and output of elmish runtime initialization */
      readonly transformProgram?: (run: RunProgram<State, Action>) => RunProgram<State, Action>
    }): React.FunctionComponent<Props> => {
  const runTransformedProgram = transformProgram(runProgram)

  return function ElmishComponent(props) {
    const [state, setState] = useState<State>()
    const dispatchRef = useRef<Dispatch<Action>>()

    useEffect(
      () => {
        const { initialState, dispatch, stop } = runTransformedProgram({
          init: () => init(props),
          update,
          view: setState
        })

        setState(initialState)
        dispatchRef.current = dispatch

        return stop
      },
      Object.keys(props)
        .filter((key) => skipRestartOnPropChange.indexOf(key) < 0)
        .map((key) => props[key])
    )

    return state !== undefined && dispatchRef.current !== undefined
      ? React.createElement(view, {
          ...props,
          ...state,
          dispatch: dispatchRef.current
        })
      : // eslint-disable-next-line no-null/no-null
        null
  }
}
