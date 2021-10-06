import React, { useEffect, useRef, useState } from 'react'
import { genericProperty } from 'ts-generic-property'
import { runProgram, Dispatch, ElmishEffect as Effect } from '@ts-elmish/core'
import { AssertDispatch, ElmishProps } from '@ts-elmish/common'

export { ElmishProps } from '@ts-elmish/common'

/**
 * Creates elmish-driven react component.
 * When component props are updated the elmish runtime is restated.
 *
 * @param init Function that returns initial state & effect
 * @param update Function that returns next state & effect for each dispatched action
 * @param view React component
 * @param dispatchProp Alternative dispatch prop name
 * @returns Root elmish react component
 */
export const createElmishComponent = <
  Props extends Record<string, unknown>,
  State extends Record<string, unknown>,
  Action,
  D extends string
>(
  {
    init,
    update,
    view
  }: {
    init: (props: Props) => readonly [AssertDispatch<State, D>, Effect<Action>]
    update: (
      state: AssertDispatch<State, D>,
      action: Action
    ) => readonly [AssertDispatch<State, D>, Effect<Action>]
    view: React.ComponentType<ElmishProps<State, Action, D>>
  },
  dispatchProp?: D
): React.FunctionComponent<Props> =>
  function ElmishComponent(props: Props) {
    const [state, setState] = useState<AssertDispatch<State, D>>()
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
      Object.keys(props ?? {}).map((key) => props[key])
    )

    return state !== undefined && dispatchRef.current !== undefined
      ? React.createElement(view, {
          ...state,
          ...genericProperty(dispatchProp ?? 'dispatch', dispatchRef.current)
        })
      : // eslint-disable-next-line no-null/no-null
        null
  }
