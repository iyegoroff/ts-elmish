import m, { Component } from 'mithril'
import { Dict } from 'ts-micro-dict'
import { ElmishAttrs } from '@ts-elmish/mithril'
import { MainState, MainAction } from '../main-state'
import { Counter } from '../../counter'

export const Main: Component<ElmishAttrs<MainState, MainAction>> = {
  view: ({ attrs: { dispatch, counters, title } }) =>
    m('div', { style: 'display: inline-flex;flex-direction: column;' }, [
      m('header', { style: 'margin-bottom: 1em;' }, title),
      Dict.toArray(counters).map(([id, counter]) =>
        m.fragment({ key: id }, [
          m(Counter, {
            ...counter,
            dispatch: (action) => dispatch(['counters-action', id, action])
          }),
          m(
            'button',
            { style: 'margin-bottom: 1em;', onclick: () => dispatch(['remove-counter', id]) },
            'remove'
          )
        ])
      ),
      m('button', { onclick: () => dispatch(['add-counter']) }, 'add')
    ])
}
