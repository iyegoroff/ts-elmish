import { merge } from 'merge-anything'
import { Object } from 'ts-toolbelt'
import { Effects } from './types'

type Path<T extends Record<string, unknown>, Root extends string = ''> = Object.UnionOf<
  {
    readonly [K in keyof T]: T[K] extends Record<string, unknown>
      ? Path<T[K], K extends string ? `${Root}${K}.` : ''>
      : K extends string
      ? `${Root}${K}`
      : ''
  }
>

/* istanbul ignore next */
const stub = (name: Path<Effects>) => () => {
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(`${name} STUB!`)
}

const StubEffects: Effects = {
  Todos: {
    addTodo: stub('Todos.addTodo'),
    listenTodoFilterChanges: stub('Todos.listenTodoFilterChanges'),
    listenTodoListChanges: stub('Todos.listenTodoListChanges'),
    loadTodoFilter: stub('Todos.loadTodoFilter'),
    loadTodoList: stub('Todos.loadTodoList'),
    removeTodo: stub('Todos.removeTodo'),
    updateTodo: stub('Todos.updateTodo'),
    updateTodoFilter: stub('Todos.updateTodoFilter'),
    updateTodoList: stub('Todos.updateTodoList')
  }
}

export const stubEffects = (effects: Object.Partial<Effects, 'deep'> = {}) =>
  // eslint-disable-next-line functional/prefer-readonly-type
  merge<Effects, Array<typeof effects>>(StubEffects, effects)
