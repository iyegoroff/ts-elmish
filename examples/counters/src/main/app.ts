import { createElmishComponent } from '@ts-elmish/react'
import { Main, MainState } from '../components/main'

export const App = createElmishComponent(
  () => [MainState.init(), []],
  (state, action) => [MainState.update(state, action), []],
  Main
)
