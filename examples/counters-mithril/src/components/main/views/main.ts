import m, { Component } from 'mithril'
import { Dict } from 'ts-micro-dict'
import { ElmishAttrs } from '@ts-elmish/mithril'
import { MainState, MainAction } from '../main-state'
import { Counter } from '../../counter'

export type MainAttrs = {
  readonly title: string
}

export const Main: Component<ElmishAttrs<MainState, MainAction, MainAttrs>> = {
  view: ({ attrs: { dispatch, counters, title } }) =>
    m('div', { style: 'display: inline-flex;flex-direction: column;' }, [
      m('header', { key: 'title', style: 'margin-bottom: 1em;' }, title),
      ...Dict.toArray(
        (counter, id) =>
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
          ]),
        counters
      ),
      m('button', { key: 'add', onclick: () => dispatch(['add-counter']) }, 'add')
    ])
}
