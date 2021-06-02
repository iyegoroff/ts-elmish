import './wdir'
import * as React from 'react'
import { render } from 'react-dom'
import { App } from './app'

const errorHandler: OnErrorEventHandlerNonNull = (event) => {
  console.log(event)
}

// eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
window.onerror = errorHandler

// eslint-disable-next-line functional/no-expression-statement, functional/immutable-data
window.onunhandledrejection = errorHandler

// eslint-disable-next-line functional/no-expression-statement
render(<App />, document.getElementById('app'))
