import m, { Component } from 'mithril'
import { useEffect, useRef, useState, withHooks } from 'mithril-hooks'
import { runProgram, Dispatch, ElmishEffect as Effect } from '@ts-elmish/core'

type AssertDispatch<T> = T extends { readonly dispatch: unknown } ? never : Readonly<T>

/** Attrs for elmish-driven mithril component */
export type ElmishAttrs<State, Action> = AssertDispatch<State> & {
  readonly dispatch: Dispatch<Action>
}

/**
 * Creates elmish-driven mithril component.
 * When component attrs are updated the elmish runtime is restated.
 *
 * @param init Function that returns initial state & effect
 * @param update Function that returns next state & effect for each dispatched action
 * @param View Mithril component
 * @returns Root elmish mithril component
 */
export const createElmishComponent = <
  Attrs extends Record<string, unknown>,
  State extends Record<string, unknown>,
  Action
>(
  init: (attrs: Attrs) => readonly [AssertDispatch<State>, Effect<Action>],
  update: (
    state: AssertDispatch<State>,
    action: Action
  ) => readonly [AssertDispatch<State>, Effect<Action>],
  View: Component<ElmishAttrs<State, Action>>
) =>
  withHooks((attrs: Attrs) => {
    const [state, setState] = useState<AssertDispatch<State>>()
    const dispatchRef = useRef<Dispatch<Action>>()

    useEffect(
      () => {
        const { initialState, dispatch, stop } = runProgram({
          init: () => init(attrs),
          update,
          view: setState
        })

        setState(initialState)
        dispatchRef.current = dispatch

        return stop
      },
      Object.keys(attrs ?? {})
        .filter((key) => key !== 'vnode' && key !== 'children')
        .map((key) => attrs[key])
    )

    return state !== undefined && dispatchRef.current !== undefined
      ? m(View, { ...state, dispatch: dispatchRef.current })
      : undefined
  })
