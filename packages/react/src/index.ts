import React, { useEffect, useRef, useState } from 'react'
import { runProgram, Dispatch, ElmishEffect as Effect } from '@ts-elmish/core'
import { RawProps, KeysIntersect } from '@ts-elmish/common'

export type { ElmishProps } from '@ts-elmish/common'

/**
 * Creates elmish-driven react component.
 * When component props are updated the elmish runtime is restated
 * unless prop name is present in `skipRestartOnPropChange` array.
 *
 * @param init Function that takes props and returns initial state & effect
 * @param update Function that takes state & action and returns next state & effect
 * @param view React component
 * @param skipRestartOnPropChange Array of prop names that prevents Elmish runtime from restarting
 *                                when specified props change
 * @returns Root elmish react component
 */
export const createElmishComponent = <
  State extends Record<string, unknown>,
  Action,
  Props extends Record<string, unknown> = Record<string, never>
>({
  init,
  update,
  view,
  skipRestartOnPropChange = []
}: KeysIntersect<State, Props> extends true
  ? never
  : {
      readonly init: (props: Props) => readonly [State, Effect<Action>]
      readonly update: (state: State, action: Action) => readonly [State, Effect<Action>]
      readonly view: React.ComponentType<RawProps<State, Action, Props>>
      readonly skipRestartOnPropChange?: ReadonlyArray<keyof Props>
    }): React.FunctionComponent<Props> =>
  function ElmishComponent(props) {
    const [state, setState] = useState<State>()
    const dispatchRef = useRef<Dispatch<Action>>()

    useEffect(
      () => {
        const { initialState, dispatch, stop } = runProgram({
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
