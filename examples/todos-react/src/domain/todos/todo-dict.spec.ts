import 'ts-jest'
import { Result } from 'ts-railway'
import { Any } from 'ts-toolbelt'
import { resolver } from '../../util'
import {
  loadTodoDict,
  addTodo,
  updateTodo,
  removeTodo,
  listenTodoDictChanges,
  filteredTodos
} from './todo-dict'
import { TodoDict } from './types'

type LoadTodoDict = Any.PromiseType<ReturnType<ReturnType<typeof loadTodoDict>>>
type AddTodo = Any.PromiseType<ReturnType<ReturnType<typeof addTodo>>>
type UpdateTodo = Any.PromiseType<ReturnType<ReturnType<typeof updateTodo>>>
type RemoveTodo = Any.PromiseType<ReturnType<ReturnType<typeof removeTodo>>>

const validTodoDict: LoadTodoDict['success'] = {
  '5': {
    text: 'text',
    completed: false
  },
  '10': {
    text: 'test',
    completed: true
  },
  x: {
    text: '1',
    completed: true
  }
}

describe('domain > todos > todo-list', () => {
  test('loadTodoDict - success', async () => {
    expect(await loadTodoDict(resolver(validTodoDict))()).toEqual<LoadTodoDict>(
      Result.success(validTodoDict)
    )
  })

  test('loadTodoDict - failure', async () => {
    return await expect(loadTodoDict(resolver('???'))()).rejects.toEqual(
      new Error('invalid todo dict format')
    )
  })

  test('removeTodo', async () => {
    const key = '5'
    const { [key]: _, ...expected } = validTodoDict
    const update = jest.fn((_k: string, data: unknown) => {
      expect(data).toEqual(expected)

      return Promise.resolve(undefined)
    })

    expect(await removeTodo(resolver(validTodoDict), update)(key)).toEqual<RemoveTodo>(
      Result.success(undefined)
    )

    expect(update).toHaveBeenCalled()
  })

  test('updateTodo', async () => {
    const key = '5'
    const todo = {
      text: 'new',
      completed: true
    }
    const expected = { ...validTodoDict, [key]: todo }
    const update = jest.fn((_k: string, data: unknown) => {
      expect(data).toEqual(expected)

      return Promise.resolve(undefined)
    })

    expect(await updateTodo(resolver(validTodoDict), update)(key, todo)).toEqual<UpdateTodo>(
      Result.success(undefined)
    )

    expect(update).toHaveBeenCalled()
  })

  test('addTodo', async () => {
    const text = 'new'
    const expected = {
      ...validTodoDict,
      '11': {
        text,
        completed: false
      }
    }

    const update = jest.fn((_k: string, data: unknown) => {
      expect(data).toEqual(expected)

      return Promise.resolve(undefined)
    })

    expect(await addTodo(resolver(validTodoDict), update)(text)).toEqual<AddTodo>(
      Result.success(undefined)
    )
  })

  test('listenTodoDictChanges', () => {
    expect(listenTodoDictChanges(() => () => 1)({ success: () => 1 })).toBeDefined()
  })

  test('filteredTodos', () => {
    const x = { text: 'x', completed: true }
    const y = { text: 'y', completed: false }
    const todos: TodoDict = { x, y }

    expect(filteredTodos(todos, 'all')).toEqual(todos)
    expect(filteredTodos(todos, 'active')).toEqual({ y })
    expect(filteredTodos(todos, 'completed')).toEqual({ x })
  })
})
