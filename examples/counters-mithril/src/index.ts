import m from 'mithril'
import { createElmishComponent } from '@ts-elmish/mithril'
import { Main, MainState, MainAction } from './components/main'

const App = createElmishComponent(
  ({ title }: { readonly title: string }) => [MainState.init(title), []],
  (state: MainState, action: MainAction) => [MainState.update(state, action), []],
  Main
)

// eslint-disable-next-line functional/no-expression-statement
m.mount(document.body, {
  view: () => m(App, { title: 'COUNTERS' })
})
