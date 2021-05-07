export type TodoFilter = 'all' | 'completed' | 'active'

export type Todo = {
  readonly text: string
  readonly completed: boolean
}

export type TodoDict = Readonly<Record<string, Todo>>
