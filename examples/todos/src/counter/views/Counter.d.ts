import { ElmishProps } from '@ts-elmish/react'
import { CounterState, CounterAction } from '../state'

declare const Counter: React.SFC<ElmishProps<CounterState, CounterAction>>
