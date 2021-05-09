import updatesFromActions from './rules/updates-from-actions'
import reactExhaustiveDeps from './rules/react-exhaustive-deps'

export = {
  rules: {
    [updatesFromActions.name]: updatesFromActions.rule,
    [reactExhaustiveDeps.name]: reactExhaustiveDeps.rule
  }
}
