import './spec-setup'
import m, { ClosureComponent, Component } from 'mithril'
import mq from 'mithril-query'
import { ElmishAttrs, createElmishRootComponent } from './index'
import { Effect } from '../../basic-effects/src'

type Attrs = {
  readonly initialCount: number
  readonly title: string
}

type State = {
  readonly count: number
}

type Action = 'increment' | 'decrement' | 'state'

const init = ({ initialCount }: Attrs): State => {
  return { count: initialCount }
}

const update = (state: State, action: Action): State => {
  const { count } = state

  switch (action) {
    case 'increment':
      return { count: count + 1 }

    case 'decrement':
      return { count: count - 1 }

    case 'state':
      return state
  }
}

const Counter: Component<ElmishAttrs<State, Action, Attrs>> = {
  view: ({ attrs: { count, dispatch, title } }) =>
    m('div', [
      m('div#title', title),
      m('div#count', count),
      m('button#increment', { onclick: () => dispatch('increment') }, '+'),
      m('button#decrement', { onclick: () => dispatch('decrement') }, '-'),
      m('button#state', { onclick: () => dispatch('state') }, 's')
    ])
}

const createApp = (counter: ClosureComponent<Attrs>, initial: number) => () => {
  let initialCount = initial
  const doubleInitialCount = () => (initialCount *= 2)

  return {
    view: () =>
      m('div', [
        m(counter, { initialCount, title: 'counter' }),
        m('button#double', { onclick: doubleInitialCount }, 'd')
      ])
  }
}

const config = {
  init: (attrs: Attrs) => [init(attrs), Effect.none<Action>()] as const,
  update: (state: State, action: Action) => [update(state, action), Effect.none<Action>()] as const,
  view: Counter
}

const countSelector = (count: number) => `div > div#count:contains(${count})`
const buttonSelector = (id: string, label: string) => `div > button#${id}:contains(${label})`
const incrementSelector = buttonSelector('increment', '+')
const decrementSelector = buttonSelector('decrement', '-')
const copyStateSelector = buttonSelector('state', 's')
const doubleInitialCountSelector = buttonSelector('double', 'd')

describe('mithril', () => {
  test('init', () => {
    const output = mq(createElmishRootComponent(config), { initialCount: 0 })

    output.should.have([countSelector(0), incrementSelector, decrementSelector, copyStateSelector])
  })

  test('click', () => {
    const output = mq(createElmishRootComponent(config), { initialCount: 0 })
    output.click(incrementSelector)

    output.should.have(countSelector(1))

    output.click(decrementSelector)
    output.click(decrementSelector)

    output.should.have(countSelector(-1))

    output.click(copyStateSelector)

    output.should.have(countSelector(-1))
  })

  test('update attrs - restart', () => {
    const initial = 5
    const counter = createElmishRootComponent({
      ...config,
      skipRestartOnAttrChange: ['title']
    })
    const output = mq(createApp(counter, initial))

    output.should.have(countSelector(initial))

    output.click(doubleInitialCountSelector)

    output.should.have(countSelector(initial * 2))
  })

  test('update attrs - restart (no skipRestartOnAttrChange)', () => {
    const initial = 5
    const counter = createElmishRootComponent(config)
    const output = mq(createApp(counter, initial))

    output.should.have(countSelector(initial))

    output.click(doubleInitialCountSelector)

    output.should.have(countSelector(initial * 2))
  })

  test('update attrs - no restart', () => {
    const initial = 5
    const counter = createElmishRootComponent({
      ...config,
      skipRestartOnAttrChange: ['initialCount']
    })
    const output = mq(createApp(counter, initial))

    output.should.have(countSelector(initial))

    output.click(doubleInitialCountSelector)

    output.should.have(countSelector(initial))
  })
})
