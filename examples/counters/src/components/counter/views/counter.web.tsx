import React from 'react'
import { ElmishMemo } from '@ts-elmish/react'
import { container } from './styles.css'

export const Counter: import('./counter').Counter = ElmishMemo(function Counter() {
  return (
    <div className={container}>
    </div>
  )
})
