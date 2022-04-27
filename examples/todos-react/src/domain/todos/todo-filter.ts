import { pipe, pipeWith } from 'pipe-ts'
import { Result, Matcher } from 'ts-railway'
import { literal, union } from 'spectypes'
import { HashLocation } from '../../services/hash-location/types'
import { TodoFilter } from './types'

const todoFilterShape = union(literal(''), literal('all'), literal('active'), literal('completed'))

const todoFilterToDomain = (maybeTodoFilter: unknown) =>
  pipeWith(
    todoFilterShape(maybeTodoFilter),
    Result.map((filter) => (filter === '' ? 'all' : filter)),
    Result.mapError(() => `Invalid todo filter` as const)
  )

export const loadTodoFilter = (current: HashLocation['current']) => () =>
  todoFilterToDomain(current())

export const updateTodoFilter = (change: HashLocation['change']) => (todoFilter: TodoFilter) =>
  Result.success(change(todoFilter))

export const listenTodoFilterChanges =
  (listen: HashLocation['listenChanges']) =>
  (onChange: Matcher<ReturnType<typeof todoFilterToDomain>, undefined>) =>
    listen(pipe(todoFilterToDomain, Result.match(onChange)))
