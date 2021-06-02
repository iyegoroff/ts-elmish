import { FailureOf } from 'ts-railway'
import { loadTodoFilter } from './todo-filter'

export type TodoFilter = 'all' | 'completed' | 'active'

export type Todo = {
  readonly text: string
  readonly completed: boolean
}

export type TodoDict = Readonly<Record<string, Todo>>

export type TodoFilterLoadError = FailureOf<ReturnType<ReturnType<typeof loadTodoFilter>>>
