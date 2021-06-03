import React, { useEffect, useRef, useState } from 'react'
import { runProgram, Dispatch, ElmishEffect as Effect } from '@ts-elmish/core'

type AssertDispatch<T> = T extends { readonly dispatch: unknown } ? never : Readonly<T>

/** Props for elmish-driven react component */
export type ElmishProps<State, Action> = AssertDispatch<State> & {
  readonly dispatch: Dispatch<Action>
}

/**
 * Creates elmish-driven react component.
 * When component props are updated the elmish runtime is restated.
 *
 * @param init Function that returns initial state & effect
 * @param update Function that returns next state & effect for each dispatched action
 * @param View React component
 * @returns Root elmish react component
 */
export const createElmishComponent = <
  Props extends Record<string, unknown>,
  State extends Record<string, unknown>,
  Action
>(
  init: (props: Props) => readonly [AssertDispatch<State>, Effect<Action>],
  update: (
    state: AssertDispatch<State>,
    action: Action
  ) => readonly [AssertDispatch<State>, Effect<Action>],
  View: React.ComponentType<ElmishProps<State, Action>>
): React.FunctionComponent<Props> =>
  function ElmishComponent(props: Props) {
    const [state, setState] = useState<AssertDispatch<State>>()
    const dispatchRef = useRef<Dispatch<Action>>()

    useEffect(
      () => {
        const [initialState, dispatch, stop] = runProgram({
          init: () => init(props),
          update,
          view: setState
        })

        setState(initialState)
        dispatchRef.current = dispatch

        return stop
      },
      Object.keys(props ?? {}).map((key) => props[key])
    )

    return state !== undefined && dispatchRef.current !== undefined
      ? React.createElement(View, { ...state, dispatch: dispatchRef.current })
      : // eslint-disable-next-line no-null/no-null
        null
  }
