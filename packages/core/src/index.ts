import { Effects } from './effects'
import { Effect as Eff } from './program'
export { Actions as Action } from './actions'
export { Dispatch, runProgram } from './program'

export const Effect = Effects
export type Effect<Action> = Eff<Action>
