import m, { Component } from 'mithril'
import { ElmishAttrs } from '@ts-elmish/mithril'
import { CounterState, CounterAction } from '../counter-state'

export const Counter: Component<ElmishAttrs<CounterState, CounterAction>> = {
  view: ({ attrs: { count, dispatch } }) =>
    m('div', [
      m('div', count),
      m('button', { onclick: () => dispatch(['increment']) }, '+'),
      m('button', { onclick: () => dispatch(['decrement']) }, '-')
    ])
}
