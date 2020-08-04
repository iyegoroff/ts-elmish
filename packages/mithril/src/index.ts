import m, { Component, Vnode } from 'mithril'
import { runProgram, Dispatch, Effect } from '@ts-elmish/core'

type AssertDispatch<T> = T extends { readonly dispatch: unknown } ? never : T
export type ElmishAttrs<State, Action> = Readonly<AssertDispatch<State>> & {
  readonly dispatch: Dispatch<Action>
}

export const createElmishComponent = <Attrs, State, Action>(
  init: (attrs: Attrs) => readonly [AssertDispatch<State>, Effect<Action>],
  update: (
    state: AssertDispatch<State>,
    action: Action
  ) => readonly [AssertDispatch<State>, Effect<Action>],
  View: Component<ElmishAttrs<State, Action>>
) =>
  function ElmishComponent(vnode: Vnode<Attrs>) {
    let [state, dispatch] = runProgram({
      init: () => init(vnode.attrs),
      update,
      view: (nextState) => {
        state = nextState
        m.redraw()
      }
    })

    return {
      view: () => m(View, { ...state, dispatch })
    }
  }
