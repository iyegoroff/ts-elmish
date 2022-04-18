/* eslint-disable import/no-internal-modules, functional/no-expression-statement, functional/immutable-data, functional/no-conditional-statement */
import './wdir'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { isDefined } from 'ts-is-defined'
import { App } from './app'

const errorHandler: OnErrorEventHandlerNonNull = (event) => {
  console.log(event)
}

window.onerror = errorHandler

window.onunhandledrejection = errorHandler

const container = document.getElementById('app')

if (isDefined(container)) {
  createRoot(container).render(<App />)
} else {
  console.log("can't find DOM element with 'app' id")
}
