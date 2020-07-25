import React from 'react'
import { runProgram, Dispatch, Effect } from '@ts-elmish/core'
import shallowEqual from './shallowEqual'

type AssertDispatch<T> = T extends { readonly dispatch: unknown } ? never : T
export type ElmishProps<State, Action> = Readonly<AssertDispatch<State>> & {
  readonly dispatch: Dispatch<Action>
}

export const ElmishMemo = <P>(component: React.SFC<P>) => React.memo(component, shallowEqual)

export const createElmishComponent = <State, Action>(
  init: () => readonly [AssertDispatch<State>, Effect<Action>],
  update: (
    state: AssertDispatch<State>,
    action: Action
  ) => readonly [AssertDispatch<State>, Effect<Action>],
  View: React.ComponentType<ElmishProps<State, Action>>
) =>
  class ElmishComponent extends React.Component<Record<string, unknown>, AssertDispatch<State>> {
    readonly dispatch: Dispatch<Action>

    constructor(props: never) {
      super(props)

      const [initialState, dispatch] = runProgram({
        init,
        update,
        view: (state) => {
          this.setState(state)
        }
      })

      this.state = initialState
      this.dispatch = dispatch
    }

    render() {
      return React.createElement(View, { ...this.state, dispatch: this.dispatch })
    }
  }
