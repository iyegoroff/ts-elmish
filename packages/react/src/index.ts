import React, { useEffect, useRef, useState } from 'react'
import { runProgram, Dispatch, ElmishEffect as Effect } from '@ts-elmish/core'
import { RawProps, KeysIntersect } from '@ts-elmish/common'

export type { ElmishProps } from '@ts-elmish/common'

/**
 * Creates elmish-driven react component.
 * When component props are updated the elmish runtime is restated.
 *
 * @param init Function that takes props and returns initial state & effect
 * @param update Function that takes state & action and returns next state & effect
 * @param view React component
 * @returns Root elmish react component
 */
export const createElmishComponent = <
  State extends Record<string, unknown>,
  Action,
  Props extends Record<string, unknown> = Record<string, never>
>({
  init,
  update,
  view
}: KeysIntersect<State, Props> extends true
  ? never
  : {
      readonly init: (props: Props) => readonly [State, Effect<Action>]
      readonly update: (state: State, action: Action) => readonly [State, Effect<Action>]
      readonly view: React.ComponentType<RawProps<State, Action, Props>>
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
      Object.keys(props).map((key) => props[key])
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
