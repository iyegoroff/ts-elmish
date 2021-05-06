export type TodoFilter = 'all' | 'completed' | 'active'

export type Todo = {
  readonly text: string
  readonly completed: boolean
}

export type TodoList = Readonly<Record<string, Todo>>
