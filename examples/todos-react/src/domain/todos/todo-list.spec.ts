import 'ts-jest'
import { Result } from 'ts-railway'
import { Any } from 'ts-toolbelt'
import { resolver } from '../../util'
import { loadTodoList, addTodo, updateTodo, removeTodo, listenTodoListChanges } from './todo-list'

type LoadTodoList = Any.PromiseType<ReturnType<ReturnType<typeof loadTodoList>>>
type AddTodo = Any.PromiseType<ReturnType<ReturnType<typeof addTodo>>>
type UpdateTodo = Any.PromiseType<ReturnType<ReturnType<typeof updateTodo>>>
type RemoveTodo = Any.PromiseType<ReturnType<ReturnType<typeof removeTodo>>>

const validTodoList: LoadTodoList['success'] = {
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
  test('loadTodoList - success', async () => {
    expect(await loadTodoList(resolver(validTodoList))()).toEqual<LoadTodoList>(
      Result.success(validTodoList)
    )
  })

  test('loadTodoList - failure', async () => {
    return await expect(loadTodoList(resolver('???'))()).rejects.toEqual(
      new Error('invalid todo list format')
    )
  })

  test('removeTodo', async () => {
    const key = '5'
    const { [key]: _, ...expected } = validTodoList

    expect(await removeTodo(resolver(validTodoList), resolver(undefined))(key)).toEqual<RemoveTodo>(
      Result.success(expected)
    )
  })

  test('updateTodo', async () => {
    const key = '5'
    const todo = {
      text: 'new',
      completed: true
    }
    const expected = {
      ...validTodoList,
      [key]: todo
    }

    expect(
      await updateTodo(resolver(validTodoList), resolver(undefined))(key, todo)
    ).toEqual<UpdateTodo>(Result.success(expected))
  })

  test('addTodo', async () => {
    const text = 'new'
    const expected = {
      ...validTodoList,
      '11': {
        text,
        completed: false
      }
    }

    expect(await addTodo(resolver(validTodoList), resolver(undefined))(text)).toEqual<AddTodo>(
      Result.success(expected)
    )
  })

  test('listenTodoListChanges', () => {
    expect(listenTodoListChanges(() => () => 1)({ success: () => 1 })).toBeDefined()
  })
})
