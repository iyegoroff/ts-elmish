import React from 'react'
import { runProgram, Dispatch, Effect } from '@ts-elmish/core'
import shallowEqual from './shallowEqual'

type AssertDispatch<T> = T extends { readonly dispatch: unknown } ? never : T
export type ElmishProps<State, Action> = Readonly<AssertDispatch<State>> & {
  readonly dispatch: Dispatch<Action>
}

export const ElmishMemo = <P>(component: React.SFC<P>) => React.memo(component, shallowEqual)

export const createElmishComponent = <Props extends Record<string, unknown>, State, Action>(
  init: (props: Props) => readonly [AssertDispatch<State>, Effect<Action>],
  update: (
    state: AssertDispatch<State>,
    action: Action
  ) => readonly [AssertDispatch<State>, Effect<Action>],
  View: React.ComponentType<ElmishProps<State, Action>>
) =>
  class ElmishComponent extends React.Component<Props, AssertDispatch<State>> {
    readonly dispatch: Dispatch<Action>

    constructor(props: Props) {
      super(props)

      const [initialState, dispatch] = runProgram({
        init: () => init(props),
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
