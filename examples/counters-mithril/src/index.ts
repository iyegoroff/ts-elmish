import m from 'mithril'
import { createElmishRootComponent } from '@ts-elmish/mithril'
import { Main, MainState, MainAttrs } from './components/main'
import { insertDebugger } from '@ts-elmish/debugger'

const App = createElmishRootComponent({
  transformProgram: insertDebugger(),
  skipRestartOnAttrChange: ['title'],
  init: (_: MainAttrs) => [MainState.init(), []],
  update: (state, action) => [MainState.update(state, action), []],
  view: Main
})

// eslint-disable-next-line functional/no-expression-statement
m.mount(document.body, {
  view: () => m(App, { title: 'COUNTERS' })
})
