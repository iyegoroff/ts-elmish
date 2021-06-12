/* eslint-disable prefer-const */
import m, { Component, ClosureComponent } from 'mithril'
import shallowequal from 'shallowequal'
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
): ClosureComponent<Attrs> =>
  function ElmishComponent(vnode) {
    let prevAttrs = vnode.attrs
    let state: AssertDispatch<State> | undefined

    const run = (attrs: Attrs) =>
      runProgram({
        init: () => init(attrs),
        update,
        view: (nextState) => {
          state = nextState
          m.redraw()
        }
      })

    let program = run(prevAttrs)
    state = program.initialState

    return {
      view: ({ attrs }) => {
        if (!shallowequal(prevAttrs, attrs)) {
          program.stop()

          program = run(attrs)
          state = program.initialState
          prevAttrs = attrs
        }

        return state !== undefined ? m(View, { ...state, dispatch: program.dispatch }) : undefined
      }
    }
  }
