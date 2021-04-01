import { ElmishProps } from '@ts-elmish/react'
import { MainState, MainAction } from '../main-state'

export const Main: React.FunctionComponent<ElmishProps<MainState, MainAction>>

export type Main = typeof Main
