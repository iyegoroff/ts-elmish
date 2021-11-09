import './spec-setup'
import m, { ClosureComponent, Component } from 'mithril'
import mq from 'mithril-query'
import { ElmishAttrs, createElmishRootComponent, skipRedraw } from './index'
import { Effect } from '../../basic-effects/src'

type Attrs = {
  readonly initialCount: number
  readonly title: string
  readonly onRender: () => void
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
  view: ({ attrs: { count, dispatch, title, onRender } }) => {
    onRender()

    return m('div', [
      m('div#title', title),
      m('div#count', count),
      m('button#increment', { onclick: skipRedraw(() => dispatch('increment')) }, '+'),
      m('button#decrement', { onclick: skipRedraw(() => dispatch('decrement')) }, '-'),
      m('button#state', { onclick: skipRedraw(() => dispatch('state')) }, 's')
    ])
  }
}

const nop = () => {
  /**/
}

const mult = 2

const createApp =
  (counter: ClosureComponent<Attrs>, initial: number, onRender = nop) =>
  () => {
    let initialCount = initial
    const doubleInitialCount = () => {
      return (initialCount *= mult)
    }

    return {
      view: () =>
        m('div', [
          m(counter, { initialCount, title: 'counter', onRender }),
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
    const output = mq(createElmishRootComponent(config), { initialCount: 0, onRender: nop })

    output.should.have([countSelector(0), incrementSelector, decrementSelector, copyStateSelector])
  })

  test('click', () => {
    let renders = 0
    const output = mq(createElmishRootComponent(config), {
      initialCount: 0,
      onRender: () => renders++
    })

    expect(renders).toEqual(1)

    output.click(incrementSelector)

    expect(renders).toEqual(1)
    output.should.have(countSelector(0))

    output.redraw()

    output.should.have(countSelector(1))

    output.click(decrementSelector)
    output.click(decrementSelector)

    output.redraw()

    output.should.have(countSelector(-1))

    output.click(copyStateSelector)

    output.redraw()

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

    output.should.have(countSelector(initial * mult))
  })

  test('update attrs - restart (no skipRestartOnAttrChange)', () => {
    const initial = 5
    const counter = createElmishRootComponent(config)
    const output = mq(createApp(counter, initial))

    output.should.have(countSelector(initial))

    output.click(doubleInitialCountSelector)

    output.should.have(countSelector(initial * mult))
  })

  test('update attrs - no restart', () => {
    const initial = 5
    const counter = createElmishRootComponent({
      ...config,
      skipRestartOnAttrChange: ['initialCount']
    })
    let renders = 0
    const output = mq(createApp(counter, initial, () => renders++))
    expect(renders).toEqual(1)

    output.should.have(countSelector(initial))

    output.click(doubleInitialCountSelector)
    expect(renders).toEqual(2)

    output.should.have(countSelector(initial))
  })
})
