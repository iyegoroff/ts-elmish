import React from 'react'
import { toArray } from 'ts-micro-dict'
import { ElmishMemo } from '@ts-elmish/react'
import { Counter } from '../../counter/views'
import { container, add } from './styles.css'

export const App: typeof import('./App.d').App = ElmishMemo(({ dispatch, counters }) => {
  return (
    <div className={container}>
      {toArray(counters).map(([id, counter]) => (
        <React.Fragment key={id}>
          <Counter {...counter} dispatch={(action) => dispatch(['counter-action', id, action])} />
          <button onClick={() => dispatch(['remove-counter', id])}>remove</button>
        </React.Fragment>
      ))}
      <button className={add} onClick={() => dispatch(['add-counter'])}>
        add
      </button>
    </div>
  )
})
