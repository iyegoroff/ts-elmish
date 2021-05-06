import { Boolean, Dictionary, Record, Static, String } from 'runtypes'
import { AsyncResult, Result, UnwrapResult } from 'ts-railway'
import { pipe, pipeWith } from 'pipe-ts'
import { Dict } from 'ts-micro-dict'
import { LocalData } from '../../services/local-data/types'
import { fail } from '../../util'
import { Todo, TodoList } from './types'

const todoListKey = 'todo-list' as const

const defaultTodoList: TodoList = {}

const todoListShape = Dictionary(Record({ text: String, completed: Boolean }).asReadonly(), String)

const assertTodoList = (maybeTodoList: unknown) =>
  todoListShape.guard(maybeTodoList)
    ? Result.success(maybeTodoList)
    : fail('invalid todo list format')

export const loadTodoList = (load: LocalData['load']) => () =>
  load(todoListKey, defaultTodoList).then(assertTodoList)

export const updateTodoList = (update: LocalData['update']) => (
  todoList: Static<typeof todoListShape>
) => update(todoListKey, todoList).then(() => todoList)

const nextTodoKey = (load: LocalData['load']) =>
  pipe(
    loadTodoList(load),
    AsyncResult.map(
      (todoList) => 1 + Object.keys(todoList).reduce((acc, val) => (+val > acc ? +val : acc), 0)
    )
  )

export const removeTodo = (load: LocalData['load'], update: LocalData['update']) => (key: string) =>
  pipe(
    loadTodoList(load),
    AsyncResult.map(Dict.omit(key)),
    AsyncResult.mapAsync(updateTodoList(update))
  )()

export const addTodo = (load: LocalData['load'], update: LocalData['update']) => (text: string) =>
  pipeWith(
    AsyncResult.combine(loadTodoList(load)(), nextTodoKey(load)()),
    AsyncResult.map(([todoList, nextKey]) =>
      Dict.put(`${nextKey}`, { text, completed: false }, todoList)
    ),
    AsyncResult.mapAsync(updateTodoList(update))
  )

export const updateTodo = (load: LocalData['load'], update: LocalData['update']) => (
  key: string,
  todo: Todo
) =>
  pipe(
    loadTodoList(load),
    AsyncResult.map(Dict.put(key, todo)),
    AsyncResult.mapAsync(updateTodoList(update))
  )()

export const listenTodoListChanges = (listen: LocalData['listenChanges']) => <U>(
  onChange: UnwrapResult<ReturnType<typeof assertTodoList>, U>
) => listen(todoListKey, pipe(assertTodoList, Result.unwrap(onChange)))
