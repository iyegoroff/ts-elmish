/* eslint-disable prefer-const */
import m, { Component, ClosureComponent } from 'mithril'
import shallowequal from 'shallowequal'
import { genericProperty } from 'ts-generic-property'
import { runProgram, ElmishEffect as Effect } from '@ts-elmish/core'
import { AssertDispatch, ElmishProps as ElmishAttrs } from '@ts-elmish/common'

export { ElmishProps as ElmishAttrs } from '@ts-elmish/common'

/**
 * Creates elmish-driven mithril component.
 * When component attrs are updated the elmish runtime is restated.
 *
 * @param init Function that returns initial state & effect
 * @param update Function that returns next state & effect for each dispatched action
 * @param view Mithril component
 * @param dispatchProp Alternative dispatch prop name
 * @returns Root elmish mithril component
 */
export const createElmishComponent = <
  Attrs extends Record<string, unknown>,
  State extends Record<string, unknown>,
  Action,
  D extends string
>(
  {
    init,
    update,
    view
  }: {
    init: (attrs: Attrs) => readonly [AssertDispatch<State, D>, Effect<Action>]
    update: (
      state: AssertDispatch<State, D>,
      action: Action
    ) => readonly [AssertDispatch<State, D>, Effect<Action>]
    view: Component<ElmishAttrs<State, Action, D>>
  },
  dispatchProp?: D
): ClosureComponent<Attrs> =>
  function ElmishComponent(vnode) {
    let prevAttrs = vnode.attrs
    let state: AssertDispatch<State, D> | undefined

    const run = (attrs: Attrs) =>
      runProgram({
        init: () => init(attrs),
        update,
        view: (nextState) => {
          if (state !== nextState) {
            state = nextState
            m.redraw()
          }
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

        return state !== undefined
          ? m(view, { ...state, ...genericProperty(dispatchProp ?? 'dispatch', program.dispatch) })
          : undefined
      }
    }
  }
