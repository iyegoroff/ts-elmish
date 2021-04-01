import React from 'react'
import { ElmishMemo } from '@ts-elmish/react'
import { container } from './styles.css'

export const Main: import('./main').Main = ElmishMemo(function Main() {
  return (
    <div className={container}>
    </div>
  )
})
