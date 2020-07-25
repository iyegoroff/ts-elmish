import { createElmishComponent } from '@ts-elmish/react'
import { App } from './app/views'
import { initApp, updateApp } from './app/state'

export const Main = createElmishComponent(initApp, updateApp, App)
