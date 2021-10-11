import m from 'mithril'
import { createElmishComponent } from '@ts-elmish/mithril'
import { Main, MainState, MainAttrs } from './components/main'

const App = createElmishComponent({
  skipRestartOnAttrChange: ['title'],
  init: (_: MainAttrs) => [MainState.init(), []],
  update: (state, action) => [MainState.update(state, action), []],
  view: Main
})

// eslint-disable-next-line functional/no-expression-statement
m.mount(document.body, {
  view: () => m(App, { title: 'COUNTERS' })
})
