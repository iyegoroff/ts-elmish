import 'ts-jest'
import { createTestRun, successResolver } from '../../../util'
import { stubEffects } from '../../effects'
import { TodoInputAction, TodoInputState } from './todo-input-state'

const { init, update } = TodoInputState

const testRun = createTestRun(update)

const validState: TodoInputState = { text: '', allTodosCompleted: false }

describe('components > todo-input', () => {
  test('init - success', async () => {
    const effects = stubEffects({
      Todos: {
        loadTodoDict: successResolver({
          '': {
            text: 'text',
            completed: false
          }
        })
      }
    })

    const command = init(effects)

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
        addTodo: jest.fn((text) => {
          expect(text).toEqual(newText)
          return successResolver({})()
        })
      }
    })

    const command = update({ ...validState, text: newText }, TodoInputAction.addTodo(), effects)

    expect(await testRun(command, effects)).toEqual<TodoInputState>(validState)

    expect(effects.Todos.addTodo).toHaveBeenCalled()
  })

  test('set-all-todos-completed', async () => {
    const effects = stubEffects({
      Todos: {
        loadTodoDict: successResolver({
          x: { text: 'y', completed: false },
          y: { text: 'x', completed: true }
        }),
        updateTodoDict: jest.fn((todos) => {
          expect(todos).toEqual({
            x: { text: 'y', completed: true },
            y: { text: 'x', completed: true }
          })
          return Promise.resolve(todos)
        })
      }
    })

    const command = update(validState, TodoInputAction.setAllTodosCompleted(true), effects)

    expect(await testRun(command, effects)).toEqual<TodoInputState>({
      ...validState,
      allTodosCompleted: true
    })

    expect(effects.Todos.updateTodoDict).toHaveBeenCalled()
  })
})
