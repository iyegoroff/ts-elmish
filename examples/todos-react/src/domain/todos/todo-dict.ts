import { Boolean, Dictionary, Record, Static, String } from 'runtypes'
import { AsyncResult, Result, UnwrapResult } from 'ts-railway'
import { pipe, pipeWith } from 'pipe-ts'
import { Dict } from 'ts-micro-dict'
import { LocalData } from '../../services/local-data/types'
import { Todo, TodoDict, TodoFilter } from './types'

const todoDictKey = 'todo-list' as const

const defaultTodoDict: TodoDict = {}

const todoDictShape = Dictionary(Record({ text: String, completed: Boolean }).asReadonly(), String)

const assertTodoDict = (maybeTodoDict: unknown) =>
  todoDictShape.guard(maybeTodoDict)
    ? Result.success(maybeTodoDict)
    : (() => {
        // eslint-disable-next-line functional/no-throw-statement
        throw new Error('invalid todo dict format')
      })()

export const loadTodoDict = (load: LocalData['load']) => () =>
  load(todoDictKey, defaultTodoDict).then(assertTodoDict)

export const updateTodoDict =
  (update: LocalData['update']) => (todoDict: Static<typeof todoDictShape>) =>
    update(todoDictKey, todoDict).then(Result.success)

const nextTodoKey = (load: LocalData['load']) =>
  pipe(
    loadTodoDict(load),
    AsyncResult.map(
      (todoDict) => 1 + Object.keys(todoDict).reduce((acc, val) => (+val > acc ? +val : acc), 0)
    )
  )

export const removeTodo = (load: LocalData['load'], update: LocalData['update']) => (key: string) =>
  pipe(
    loadTodoDict(load),
    AsyncResult.map(Dict.omit(key)),
    AsyncResult.flatMap(updateTodoDict(update))
  )()

export const addTodo = (load: LocalData['load'], update: LocalData['update']) => (text: string) =>
  pipeWith(
    AsyncResult.combine(loadTodoDict(load)(), nextTodoKey(load)()),
    AsyncResult.map(([todoDict, nextKey]) =>
      Dict.put(`${nextKey}`, { text, completed: false }, todoDict)
    ),
    AsyncResult.flatMap(updateTodoDict(update))
  )

export const updateTodo =
  (load: LocalData['load'], update: LocalData['update']) => (key: string, todo: Todo) =>
    pipe(
      loadTodoDict(load),
      AsyncResult.map(Dict.put(key, todo)),
      AsyncResult.flatMap(updateTodoDict(update))
    )()

export const listenTodoDictChanges =
  (listen: LocalData['listenChanges']) =>
  <U>(onChange: UnwrapResult<ReturnType<typeof assertTodoDict>, U>) =>
    listen(todoDictKey, pipe(assertTodoDict, Result.unwrap(onChange)))

export const filteredTodos = (todos: TodoDict, todoFilter: TodoFilter) =>
  Dict.filter((todo) => todoFilter === 'all' || (todoFilter === 'active') !== todo.completed, todos)

export const clearCompleted = (load: LocalData['load'], update: LocalData['update']) =>
  pipe(
    loadTodoDict(load),
    AsyncResult.map(Dict.filter(({ completed }: Todo) => !completed)),
    AsyncResult.flatMap(updateTodoDict(update))
  )

export const compareTodos = (first: Todo, second: Todo) =>
  first === second || (first.text === second.text && first.completed === second.completed)
