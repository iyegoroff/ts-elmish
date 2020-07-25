import { ElmishProps } from '@ts-elmish/react'
import { AppState, AppAction } from '../state'

declare const App: React.SFC<ElmishProps<AppState, AppAction>>
