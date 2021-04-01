import { ElmishProps } from '@ts-elmish/react'
import { CounterState, CounterAction } from '../counter-state'

export const Counter: React.FunctionComponent<ElmishProps<CounterState, CounterAction>>

export type Counter = typeof Counter
