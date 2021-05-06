import { createElmishComponent } from '@ts-elmish/react'
import { Effects } from './effects'
import { Main, MainState } from './components'

const { init, update } = MainState

export const App = createElmishComponent(
  () => init(Effects),
  (state, action) => update(state, action, Effects),
  Main
)
