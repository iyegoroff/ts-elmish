# ts-elmish

[![npm version](https://badge.fury.io/js/%40ts-elmish%2Fcore.svg?t=1495378566925)](https://badge.fury.io/js/%40ts-elmish%2Fcore)
[![CircleCI](https://circleci.com/gh/iyegoroff/ts-elmish.svg?style=svg)](https://circleci.com/gh/iyegoroff/ts-elmish)
[![codecov](https://codecov.io/gh/iyegoroff/ts-elmish/branch/master/graph/badge.svg?t=1520230083925)](https://codecov.io/gh/iyegoroff/ts-elmish)
[![Type Coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fiyegoroff%2Fts-elmish%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![npm](https://img.shields.io/npm/l/@ts-elmish/core.svg?t=1495378566925)](https://www.npmjs.com/package/@ts-elmish/core)

<!-- [![devDependencies Status](https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?type=dev)](https://david-dm.org/iyegoroff/ts-elmish?type=dev) -->

Elmish architecture in Typescript

---

## Features

- <b>minimalistic</b>, no dedicated ecosystem approach
- <b>unobtrusive</b>, doesn't capture app composition root
- <b>modular</b>, supports different view layers and effect handling strategies
- <b>testable</b>, encourages view/logic/effect separation

## Packages

<table>
   <tbody>
      <tr>
         <td>@ts-elmish/core</td>
         <td>elmish runtime</td>
         <td><img alt="dependencies" src="https://img.shields.io/librariesio/release/npm/@ts-elmish/core"></td>
         <td><a href="https://bundlephobia.com/package/@ts-elmish/core" title="min+gzip"><img src="https://badgen.net/bundlephobia/minzip/@ts-elmish/core?label=min+gzip"/></a></td>
         <!-- <td><a href="https://david-dm.org/iyegoroff/ts-elmish?path=packages/core" title="dependencies status"><img src="https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?path=packages%2Fcore"/></a></td>
         <td><a href="https://david-dm.org/iyegoroff/ts-elmish?path=packages/core&type=dev" title="devDependencies status"><img src="https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?path=packages%2Fcore&type=dev"/></a></td> -->
      </tr>
      <tr>
         <td>@ts-elmish/basic-effects</td>
         <td>effects from functions</td>
         <td><img alt="dependencies" src="https://img.shields.io/librariesio/release/npm/@ts-elmish/basic-effects"></td>
         <td><a href="https://bundlephobia.com/package/@ts-elmish/basic-effects" title="min+gzip"><img src="https://badgen.net/bundlephobia/minzip/@ts-elmish/basic-effects?label=min+gzip"/></a></td>
         <!-- <td><a href="https://david-dm.org/iyegoroff/ts-elmish?path=packages/basic-effects" title="dependencies status"><img src="https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?path=packages%2Fbasic-effects"/></a></td>
         <td><a href="https://david-dm.org/iyegoroff/ts-elmish?path=packages/basic-effects&type=dev" title="devDependencies status"><img src="https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?path=packages%2Fbasic-effects&type=dev"/></a></td> -->
      </tr>
      <tr>
         <td>@ts-elmish/railway-effects</td>
         <td>ROP-powered effects</td>
         <td><img alt="dependencies" src="https://img.shields.io/librariesio/release/npm/@ts-elmish/railway-effects"></td>
         <td><a href="https://bundlephobia.com/package/@ts-elmish/railway-effects" title="min+gzip"><img src="https://badgen.net/bundlephobia/minzip/@ts-elmish/railway-effects?label=min+gzip"/></a></td>
         <!-- <td><a href="https://david-dm.org/iyegoroff/ts-elmish?path=packages/railway-effects" title="dependencies status"><img src="https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?path=packages%2Frailway-effects"/></a></td>
         <td><a href="https://david-dm.org/iyegoroff/ts-elmish?path=packages/railway-effects&type=dev" title="devDependencies status"><img src="https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?path=packages%2Frailway-effects&type=dev"/></a></td> -->
      </tr>
      <tr>
         <td>@ts-elmish/react</td>
         <td>react view layer</td>
         <td><img alt="dependencies" src="https://img.shields.io/librariesio/release/npm/@ts-elmish/react"></td>
         <td><a href="https://bundlephobia.com/package/@ts-elmish/react" title="min+gzip"><img src="https://badgen.net/bundlephobia/minzip/@ts-elmish/react?label=min+gzip"/></a></td>
         <!-- <td><a href="https://david-dm.org/iyegoroff/ts-elmish?path=packages/react" title="dependencies status"><img src="https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?path=packages%2Freact"/></a></td>
         <td><a href="https://david-dm.org/iyegoroff/ts-elmish?path=packages/react&type=dev" title="devDependencies status"><img src="https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?path=packages%2Freact&type=dev"/></a></td> -->
      </tr>
      <tr>
         <td>@ts-elmish/mithril</td>
         <td>mithril view layer</td>
         <td><img alt="dependencies" src="https://img.shields.io/librariesio/release/npm/@ts-elmish/mithril"></td>
         <td><a href="https://bundlephobia.com/package/@ts-elmish/mithril" title="min+gzip"><img src="https://badgen.net/bundlephobia/minzip/@ts-elmish/mithril?label=min+gzip"/></a></td>
         <!-- <td><a href="https://david-dm.org/iyegoroff/ts-elmish?path=packages/mithril" title="dependencies status"><img src="https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?path=packages%2Fmithril"/></a></td>
         <td><a href="https://david-dm.org/iyegoroff/ts-elmish?path=packages/mithril&type=dev" title="devDependencies status"><img src="https://status.david-dm.org/gh/iyegoroff/ts-elmish.svg?path=packages%2Fmithril&type=dev"/></a></td> -->
      </tr>
      <tr>
         <td>@ts-elmish/debugger</td>
         <td>redux-devtools integration</td>
         <td><img alt="dependencies" src="https://img.shields.io/librariesio/release/npm/@ts-elmish/debugger"></td>
         <td><a href="https://bundlephobia.com/package/@ts-elmish/debugger" title="min+gzip"><img src="https://badgen.net/bundlephobia/minzip/@ts-elmish/debugger?label=min+gzip"/></a></td>
      </tr>
   </tbody>
</table>

## Getting started

At first you have to choose an effect handling strategy - currently there are two options:

- [`basic-effects`](/packages/basic-effects) - effects are created from sync or async functions just like in original `Elmish`, all errors have `unknown` type. Success and failure handlers are both optional, if failure handler is provided an error will be caught with `try/catch` statement.
- [`railway-effects`](/packages/railway-effects) - this approach embraces [result type](https://en.wikipedia.org/wiki/Result_type) and [railway oriented programming](https://fsharpforfunandprofit.com/posts/recipe-part2/), effects are created from functions that return values of `Result` or `AsyncResult` types provided by [ts-railway](https://github.com/iyegoroff/ts-railway) package, all errors are properly typed. Success handler is optional, but failure hanlder is either required or prohibited (when result error type is `never`). Despite this approach is quite handy for enforcing domain error handling, it has its [downsides](https://fsharpforfunandprofit.com/posts/against-railway-oriented-programming/) too.

Then just add `ts-elmish` packages to your project:

- `basic-effects` with `react`/`react-native`:

  ```
  npm i @ts-elmish/core @ts-elmish/react @ts-elmish/basic-effects
  ```

- `railway-effects` with `react`/`react-native`:

  ```
  npm i @ts-elmish/core @ts-elmish/react @ts-elmish/railway-effects ts-railway
  ```

- `basic-effects` with `mithril`:

  ```
  npm i @ts-elmish/core @ts-elmish/mithril @ts-elmish/basic-effects
  ```

- `railway-effects` with `mithril`:
  ```
  npm i @ts-elmish/core @ts-elmish/mithril @ts-elmish/railway-effects ts-railway
  ```

Useful generic purpose modules:

- [pipe-ts](https://github.com/unsplash/pipe-ts) - handy for combining multiple result-returning functions into one
- [eslint-plugin-functional](https://github.com/jonaskello/eslint-plugin-functional) - an essential eslint plugin for writing `typescript` in functional and immutable way
- [react-native-promise-rejection-utils](https://github.com/iyegoroff/react-native-promise-rejection-utils/) - global unhandled promise rejection tracker for `react-native`

## Basic example

```typescript
import m, { Component } from 'mithril'
import { ElmishAttrs, createElmishRootComponent } from '@ts-elmish/mithril'
import { Effect } from '@ts-elmish/basic-effects'

type State = {
  readonly count: number
}

type Action = 'increment' | 'decrement'

const init = (): State => {
  return { count: 0 }
}

const update = ({ count }: State, action: Action): State => {
  switch (action) {
    case 'increment':
      return { count: count + 1 }

    case 'decrement':
      return { count: count - 1 }
  }
}

const Counter: Component<ElmishAttrs<State, Action>> = {
  view: ({ attrs: { count, dispatch } }) =>
    m('div', [
      m('div', count),
      m('button', { onclick: () => dispatch('increment') }, '+'),
      m('button', { onclick: () => dispatch('decrement') }, '-')
    ])
}

const App = createElmishRootComponent({
  init: () => [init(), Effect.none<Action>()],
  update: (state, action) => [update(state, action), Effect.none()],
  view: Counter
})

m.mount(document.body, {
  view: () => m(App, {})
})
```

## Learning `ts-elmish`

Due to small size it is worth just to look at the code. Also there is a [basic](examples/counters-mithril) and [advanced](examples/todos-react) examples.

## Links

- [Elmish docs](https://elmish.github.io/elmish/) and [The Elmish Book](https://zaid-ajaj.github.io/the-elmish-book/#/) - useful sources for learning <i>elmish ideology</i>. Almost everything applies to `ts-elmish` too, the main difference is that [subscriptions](https://elmish.github.io/elmish/subscriptions.html) are out of scope for `ts-elmish` - just use view layer capabilities for listening to events (e.g. `useEffect` hook in `react`).
- [Railway oriented programming](https://fsharpforfunandprofit.com/posts/recipe-part2/) - introduction to ROP.
- [Against Railway-Oriented Programming](https://fsharpforfunandprofit.com/posts/against-railway-oriented-programming/) - ROP downsides.
