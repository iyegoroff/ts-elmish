import 'ts-jest'
import { createTestRun, successResolver } from '../../../util'
import { stubEffects } from '../../effects'
import { TodoAction, TodoState } from './todo-state'

const { init, update } = TodoState

const testRun = createTestRun(update)

const validState: TodoState = {
  text: 'text',
  completed: false,
  isEdited: false,
  id: '5'
}

describe('components > todo', () => {
  test('init - success', async () => {
    const effects = stubEffects()
    const command = init('5', { text: 'text', completed: false })

    expect(await testRun(command, effects)).toEqual<TodoState>(validState)
  })

  test('start-edit', async () => {
    const effects = stubEffects()

    const command = update(validState, TodoAction.startEdit(), effects)

    expect(await testRun(command, effects)).toEqual<TodoState>({
      ...validState,
      isEdited: true
    })
  })

  test('confirm-edit', async () => {
    const newText = 'new'

    const effects = stubEffects({
      Todos: {
        updateTodo: jest.fn((id, { text, completed }) => {
          expect(id).toEqual(validState.id)
          expect(text).toEqual(newText)
          expect(completed).toEqual(validState.completed)

          return successResolver({})()
        })
      }
    })

    const command = update(validState, TodoAction.confirmEdit(newText), effects)

    expect(await testRun(command, effects)).toEqual<TodoState>({
      ...validState,
      isEdited: false,
      text: newText
    })

    expect(effects.Todos.updateTodo).toHaveBeenCalled()
  })

  test('cancel-edit', async () => {
    const effects = stubEffects()

    const command = update({ ...validState, isEdited: true }, TodoAction.cancelEdit(), effects)

    expect(await testRun(command, effects)).toEqual<TodoState>(validState)
  })

  test('remove', async () => {
    const effects = stubEffects({
      Todos: {
        removeTodo: jest.fn((id) => {
          expect(id).toEqual(validState.id)

          return successResolver({})()
        })
      }
    })

    const command = update(validState, TodoAction.remove(), effects)

    expect(await testRun(command, effects)).toEqual<TodoState>(validState)

    expect(effects.Todos.removeTodo).toHaveBeenCalled()
  })

  test('toggle-completed', async () => {
    const newCompleted = !validState.completed
    const effects = stubEffects({
      Todos: {
        updateTodo: jest.fn((id, { text, completed }) => {
          expect(id).toEqual(validState.id)
          expect(text).toEqual(validState.text)
          expect(completed).toEqual(newCompleted)

          return successResolver({})()
        })
      }
    })

    const command = update(validState, TodoAction.toggleCompleted(), effects)

    expect(await testRun(command, effects)).toEqual<TodoState>({
      ...validState,
      completed: newCompleted
    })

    expect(effects.Todos.updateTodo).toHaveBeenCalled()
  })
})
