import updatesFromActions from './rules/updates-from-actions'

export = {
  rules: {
    [updatesFromActions.name]: updatesFromActions.rule
  }
}
