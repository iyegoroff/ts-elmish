/* eslint-disable prefer-const */
import m, { Component, ClosureComponent } from 'mithril'
import shallowequal from 'shallowequal'
import { runProgram, ElmishEffect as Effect } from '@ts-elmish/core'
import { RawProps, KeysIntersect } from '@ts-elmish/common'

export type { ElmishProps as ElmishAttrs } from '@ts-elmish/common'

/**
 * Creates elmish-driven mithril component.
 * When component attrs are updated the elmish runtime is restated.
 *
 * @param init Function that takes attrs and returns initial state & effect
 * @param update Function that takes state & action and returns next state & effect
 * @param view Mithril component
 * @returns Root elmish mithril component
 */
export const createElmishComponent = <
  State extends Record<string, unknown>,
  Action,
  Attrs extends Record<string, unknown> = Record<string, never>
>({
  init,
  update,
  view
}: KeysIntersect<State, Attrs> extends true
  ? never
  : {
      init: (attrs: Attrs) => readonly [State, Effect<Action>]
      update: (state: State, action: Action) => readonly [State, Effect<Action>]
      view: Component<RawProps<State, Action, Attrs>>
    }): ClosureComponent<Attrs> =>
  function ElmishComponent(vnode) {
    let prevAttrs = vnode.attrs
    let state: State | undefined

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
          ? m(view, {
              ...attrs,
              ...state,
              dispatch: program.dispatch
            })
          : undefined
      }
    }
  }
