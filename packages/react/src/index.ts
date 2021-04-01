import React, { useEffect, useRef, useState } from 'react'
import { runProgram, Dispatch, ElmishEffect as Effect } from '@ts-elmish/core'
import shallowEqual from './shallowEqual'

type AssertDispatch<T> = T extends { readonly dispatch: unknown } ? never : T
export type ElmishProps<State, Action> = Readonly<AssertDispatch<State>> & {
  readonly dispatch: Dispatch<Action>
}

export const ElmishMemo = <P>(component: React.FunctionComponent<P>) =>
  React.memo(component, shallowEqual)

export const createElmishComponent = <Props extends Record<string, unknown>, State, Action>(
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
      Object.keys(props).map((key) => props[key])
    )

    return state !== undefined && dispatchRef.current !== undefined
      ? React.createElement(View, { ...state, dispatch: dispatchRef.current })
      : React.createElement(React.Fragment)
  }
