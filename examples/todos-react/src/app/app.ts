import { createElmishComponent } from '@ts-elmish/react'
import { Effects } from './effects'
import { Main, MainState } from './components'

export const App = createElmishComponent({
  init: MainState.init,
  update: (state, action) => MainState.update(state, action, Effects),
  view: Main
})
