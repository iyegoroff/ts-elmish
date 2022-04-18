import { AsyncResult, Result, Matcher } from 'ts-railway'
import { pipe, pipeWith } from 'pipe-ts'
import { Dict } from 'ts-micro-dict'
import { LocalData } from '../../services/local-data/types'
import { Todo, TodoDict, TodoFilter } from './types'
import { boolean, object, record, string } from 'spectypes'

const todoDictKey = 'todo-list' as const

const defaultTodoDict: TodoDict = {}

const todoDictShape = record(object({ text: string, completed: boolean }))

const assertTodoDict = (maybeTodoDict: unknown) =>
  Result.match(
    {
      success: (x) => Result.success(x),
      failure: () => {
        // eslint-disable-next-line functional/no-throw-statement
        throw new Error('invalid todo dict format')
      }
    },
    todoDictShape(maybeTodoDict)
  )

export const loadTodoDict = (load: LocalData['load']) => () =>
  load(todoDictKey, defaultTodoDict).then(assertTodoDict)

export const updateTodoDict = (update: LocalData['update']) => (todoDict: TodoDict) =>
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
  (onChange: Matcher<ReturnType<typeof assertTodoDict>, undefined>) =>
    listen(todoDictKey, pipe(assertTodoDict, Result.match(onChange)))

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
