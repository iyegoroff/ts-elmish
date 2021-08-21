import { createElmishComponent } from '@ts-elmish/react'
import { Effects } from './effects'
import { Main, MainState } from './components'

export const App = createElmishComponent(
  MainState.init,
  (state, action) => MainState.update(state, action, Effects),
  Main
)
