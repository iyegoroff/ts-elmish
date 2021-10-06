import m from 'mithril'
import { createElmishComponent } from '@ts-elmish/mithril'
import { Main, MainState } from './components/main'

const App = createElmishComponent({
  init: ({ title }: { readonly title: string }) => [MainState.init(title), []],
  update: (state, action) => [MainState.update(state, action), []],
  view: Main
})

// eslint-disable-next-line functional/no-expression-statement
m.mount(document.body, {
  view: () => m(App, { title: 'COUNTERS' })
})
