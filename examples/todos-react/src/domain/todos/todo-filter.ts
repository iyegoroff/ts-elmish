import { Literal, Union } from 'runtypes'
import { pipe } from 'pipe-ts'
import { Result, UnwrapResult } from 'ts-railway'
import { HashLocation } from '../../services/hash-location/types'
import { TodoFilter } from './types'

const todoFilterShape = Union(Literal(''), Literal('all'), Literal('active'), Literal('completed'))

const todoFilterToDomain = (maybeTodoFilter: unknown) =>
  todoFilterShape.guard(maybeTodoFilter)
    ? Result.success(maybeTodoFilter === '' ? 'all' : maybeTodoFilter)
    : Result.failure(`Invalid todo filter - ${String(maybeTodoFilter)}` as const)

export const loadTodoFilter = (current: HashLocation['current']) => () =>
  todoFilterToDomain(current())

export const updateTodoFilter = (change: HashLocation['change']) => (todoFilter: TodoFilter) =>
  Result.success(change(todoFilter))

export const listenTodoFilterChanges =
  (listen: HashLocation['listenChanges']) =>
  <U>(onChange: UnwrapResult<ReturnType<typeof todoFilterToDomain>, U>) =>
    listen(pipe(todoFilterToDomain, Result.unwrap(onChange)))
