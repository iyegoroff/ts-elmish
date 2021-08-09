import { Domain } from '../../domain'
import { Services } from '../../services'

const {
  LocalData,
  HashLocation,
  Alert: { showError }
} = Services

const { Todos } = Domain

export const Effects = {
  Todos: Todos.create(LocalData, HashLocation),
  Alert: {
    showError
  }
} as const
