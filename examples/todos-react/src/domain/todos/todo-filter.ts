import { Literal, Union } from 'runtypes'
import { pipe } from 'pipe-ts'
import { Result, UnwrapResult } from 'ts-railway'
import { HashLocation } from '../../services/hash-location/types'
import { TodoFilter } from './types'

const defaultTodoFilter: TodoFilter = 'all'

const todoFilterShape = Union(Literal('all'), Literal('active'), Literal('completed'))

const todoFilterToDomain = (maybeTodoFilter: unknown) =>
  Result.success(todoFilterShape.guard(maybeTodoFilter) ? maybeTodoFilter : defaultTodoFilter)

export const loadTodoFilter = (current: HashLocation['current']) => () =>
  todoFilterToDomain(current())

export const updateTodoFilter = (change: HashLocation['change']) => (todoFilter: TodoFilter) =>
  Result.success(change(todoFilter))

export const listenTodoFilterChanges = (listen: HashLocation['listenChanges']) => <U>(
  onChange: UnwrapResult<ReturnType<typeof todoFilterToDomain>, U>
) => listen(pipe(todoFilterToDomain, Result.unwrap(onChange)))
