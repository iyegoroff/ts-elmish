import { createElmishRootComponent } from '@ts-elmish/react'
import { insertDebugger } from '@ts-elmish/debugger'
import { Effects } from './effects'
import { Main, MainState } from './components'

const getActionType = <T>(action: T) => {
  const iter = (act: readonly unknown[], tags: readonly string[] = []): string =>
    typeof act[0] === 'string'
      ? iter(act[0].endsWith('-action') ? act.find(Array.isArray) ?? [] : [], [...tags, act[0]])
      : tags.join('__')

  return {
    type: Array.isArray(action) ? iter(action) : '',
    data: action
  }
}

export const App = createElmishRootComponent({
  transformProgram: insertDebugger({ getActionType }),
  init: MainState.init,
  update: (state, action) => MainState.update(state, action, Effects),
  view: Main
})
