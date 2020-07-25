import React from 'react'
import { ElmishMemo } from '@ts-elmish/react'
import { container } from './styles.css'

export const Counter: typeof import('./Counter.d').Counter = ElmishMemo(({ dispatch, count }) => {
  return (
    <div className={container}>
      <div>{count}</div>
      <button onClick={() => dispatch(['increment'])}>+</button>
      <button onClick={() => dispatch(['decrement'])}>-</button>
    </div>
  )
})
