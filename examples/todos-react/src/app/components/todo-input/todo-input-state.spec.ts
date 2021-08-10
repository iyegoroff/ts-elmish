import { TodoDict } from '../../../domain/todos/types'
import { createTestRun, successResolver, stubEffects } from '../../../test-util'
import { TodoInputAction, TodoInputState } from './todo-input-state'

const { init, update } = TodoInputState

const testRun = createTestRun(update)

const validState: TodoInputState = { text: '', allTodosCompleted: false }

describe('components > todo-input', () => {
  test('init - success', async () => {
    const effects = stubEffects()

    const command = init({
      '': {
        text: 'text',
        completed: false
      }
    })

    expect(await testRun(command, effects)).toEqual<TodoInputState>(validState)
  })

  test('set-text', async () => {
    const effects = stubEffects()

    const command = update(validState, TodoInputAction.setText('123'), effects)

    expect(await testRun(command, effects)).toEqual<TodoInputState>({
      ...validState,
      text: '123'
    })
  })

  test('add-todo', async () => {
    const newText = '123'
    const effects = stubEffects({
      Todos: {
        addTodo: jest.fn((text: string) => {
          expect(text).toEqual(newText)
          return successResolver(undefined)()
        })
      }
    })

    const command = update({ ...validState, text: newText }, TodoInputAction.addTodo(), effects)

    expect(await testRun(command, effects)).toEqual<TodoInputState>(validState)

    expect(effects.Todos.addTodo).toHaveBeenCalled()
  })

  test('add-todo - empty', async () => {
    const newText = ''
    const effects = stubEffects({
      Todos: {
        addTodo: jest.fn()
      }
    })

    const command = update({ ...validState, text: newText }, TodoInputAction.addTodo(), effects)

    expect(await testRun(command, effects)).toEqual<TodoInputState>(validState)

    expect(effects.Todos.addTodo).not.toHaveBeenCalled()
  })

  test('set-all-todos-completed', async () => {
    const effects = stubEffects({
      Todos: {
        loadTodoDict: successResolver({
          x: { text: 'y', completed: false },
          y: { text: 'x', completed: true }
        }),
        updateTodoDict: jest.fn((todos: TodoDict) => {
          expect(todos).toEqual({
            x: { text: 'y', completed: true },
            y: { text: 'x', completed: true }
          })
          return successResolver(undefined)()
        })
      }
    })

    const command = update(validState, TodoInputAction.toggleAllTodosCompleted(), effects)

    expect(await testRun(command, effects)).toEqual<TodoInputState>({
      ...validState,
      allTodosCompleted: true
    })

    expect(effects.Todos.updateTodoDict).toHaveBeenCalled()
  })

  test('todo-dict-changed - same state', async () => {
    const effects = stubEffects()

    const command = update(
      validState,
      TodoInputAction.todoDictChanged({ x: { text: '', completed: false } }),
      effects
    )

    expect(await testRun(command, effects)).toBe<TodoInputState>(validState)
  })

  test('todo-dict-changed', async () => {
    const effects = stubEffects()

    const command = update(
      validState,
      TodoInputAction.todoDictChanged({ x: { text: '', completed: true } }),
      effects
    )

    expect(await testRun(command, effects)).toEqual<TodoInputState>({
      ...validState,
      allTodosCompleted: true
    })
  })
})
