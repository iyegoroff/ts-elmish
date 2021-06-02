import m, { Component } from 'mithril'
import { useEffect, useRef, useState, withHooks } from 'mithril-hooks'
import { runProgram, Dispatch, ElmishEffect as Effect } from '@ts-elmish/core'

type AssertDispatch<T> = T extends { readonly dispatch: unknown }
  ? never
  : T extends undefined
  ? T
  : Readonly<T>

export type ElmishAttrs<State, Action> = AssertDispatch<State> & {
  readonly dispatch: Dispatch<Action>
}

export const createElmishComponent = <
  Attrs extends Record<string, unknown>,
  State extends Record<string, unknown> | undefined,
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
        const [initialState, dispatch, stop] = runProgram({
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
