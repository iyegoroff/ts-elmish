/* eslint-disable prefer-const */
import m, { Component, ClosureComponent } from 'mithril'
import shallowequal from 'shallowequal'
import { runProgram } from '@ts-elmish/core'
import { RawProps, KeysIntersect, Effect, RunProgram } from '@ts-elmish/common'

export type { ElmishProps as ElmishAttrs } from '@ts-elmish/common'

/**
 * Creates elmish-driven mithril component.
 * When component attrs are updated the elmish runtime is restated.
 *
 * @param options init, update, view, skipRestartOnAttrChange, transformProgram
 *
 * @returns Root elmish mithril component
 */
export const createElmishRootComponent = <
  State extends Record<string, unknown>,
  Action,
  Attrs extends Record<string, unknown> = Record<string, never>
>({
  init,
  update,
  view,
  skipRestartOnAttrChange,
  transformProgram = (run) => run
}: KeysIntersect<State, Attrs> extends true
  ? never
  : {
      /** Function that takes attrs and returns initial state & effect */
      readonly init: (attrs: Attrs) => readonly [State, Effect<Action>]
      /** Function that takes state & action and returns next state & effect */
      readonly update: (state: State, action: Action) => readonly [State, Effect<Action>]
      /** Mithril component */
      readonly view: Component<RawProps<State, Action, Attrs>>
      /** Array of attr names that prevents elmish runtime from restarting when specified attrs change */
      readonly skipRestartOnAttrChange?: ReadonlyArray<keyof Attrs & string>
      /** Function to modify inputs and output of elmish runtime initialization */
      readonly transformProgram?: (run: RunProgram<State, Action>) => RunProgram<State, Action>
    }): ClosureComponent<Attrs> => {
  const runTransformedProgram = transformProgram(runProgram)
  const compare: shallowequal.Customizer<unknown> | undefined =
    skipRestartOnAttrChange === undefined
      ? undefined
      : (_: unknown, __: unknown, key) =>
          key === undefined || skipRestartOnAttrChange.indexOf(`${key}`) < 0 ? undefined : true

  return function ElmishComponent(vnode) {
    let prevAttrs = vnode.attrs
    let state: State

    const run = (attrs: Attrs) =>
      runTransformedProgram({
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
        if (!shallowequal(prevAttrs, attrs, compare)) {
          program.stop()

          program = run(attrs)
          state = program.initialState
          prevAttrs = attrs
        }

        return m(view, {
          ...attrs,
          ...state,
          dispatch: program.dispatch
        })
      }
    }
  }
}

/**
 * A helper to disable autoredraw system inside DOM event handlers.
 *
 * @param handler Event handler function
 * @returns Patched event handler
 */
export const skipRedraw =
  <Event extends { redraw: boolean }>(handler: (event: Event) => undefined) =>
  (event: Event) => {
    event.redraw = false
    return handler(event)
  }
