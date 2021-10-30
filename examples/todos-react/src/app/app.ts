import { createElmishRootComponent } from '@ts-elmish/react'
import { Effects } from './effects'
import { Main, MainState } from './components'

export const App = createElmishRootComponent({
  init: () => MainState.init(),
  update: (state, action) => MainState.update(state, action, Effects),
  view: Main
})
