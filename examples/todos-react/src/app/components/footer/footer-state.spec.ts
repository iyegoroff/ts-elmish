import { Result } from 'ts-railway'
import { TodoFilter } from '../../../domain/todos/types'
import { createTestRun, stubEffects, successResolver } from '../../../test-util'
import { FooterAction, FooterState } from './footer-state'

const { init, update } = FooterState

const testRun = createTestRun(update)

const validState: FooterState = {
  activeTodosAmount: 0,
  hasCompletedTodos: true,
  todoFilter: 'all'
}

describe('components > footer', () => {
  test('init - success', async () => {
    const effects = stubEffects()

    const command = init(
      {
        x: { text: '', completed: true }
      },
      'all'
    )

    expect(await testRun(command, effects)).toEqual<FooterState>(validState)
  })

  test('todo-dict-changed', async () => {
    const effects = stubEffects()

    const command = update(
      validState,
      FooterAction.todoDictChanged({
        x: { text: '', completed: false }
      }),
      effects
    )

    expect(await testRun(command, effects)).toEqual<FooterState>({
      ...validState,
      activeTodosAmount: 1,
      hasCompletedTodos: false
    })
  })

  test('todo-dict-changed - same state', async () => {
    const effects = stubEffects()

    const command = update(
      validState,
      FooterAction.todoDictChanged({
        x: { text: '', completed: true }
      }),
      effects
    )

    expect(await testRun(command, effects)).toBe<FooterState>(validState)
  })

  test('set-todo-filter - same state', async () => {
    const effects = stubEffects()

    const command = update(validState, FooterAction.setTodoFilter('all'), effects)

    expect(await testRun(command, effects)).toBe<FooterState>(validState)
  })

  test('set-todo-filter', async () => {
    const todoFilter = 'active' as const
    const effects = stubEffects()

    const command = update(validState, FooterAction.setTodoFilter(todoFilter), effects)

    expect(await testRun(command, effects)).toEqual<FooterState>({ ...validState, todoFilter })
  })

  test('handle-todo-filter-alert', async () => {
    const todoFilterLoadError = `Invalid todo filter - what?` as const

    const effects = stubEffects({
      Todos: {
        updateTodoFilter: jest.fn((todoFilter: TodoFilter) => {
          expect(todoFilter).toEqual(validState.todoFilter)
          return Result.success(todoFilter)
        })
      },
      Alert: {
        showError: jest.fn((error: string) => {
          expect(error).toEqual(todoFilterLoadError)

          return successResolver({ isConfirmed: true, isDenied: true, isDismissed: true })()
        })
      }
    })

    const command = update(
      validState,
      FooterAction.handleTodoFilterAlert(todoFilterLoadError),
      effects
    )

    expect(await testRun(command, effects)).toBe<FooterState>(validState)

    expect(effects.Todos.updateTodoFilter).toHaveBeenCalled()
    expect(effects.Alert.showError).toHaveBeenCalled()
  })

  test('clear-completed-todos', async () => {
    const effects = stubEffects({
      Todos: {
        clearCompleted: jest.fn(successResolver(undefined))
      }
    })

    const command = update(validState, FooterAction.clearCompletedTodos(), effects)

    expect(await testRun(command, effects)).toBe<FooterState>(validState)

    expect(effects.Todos.clearCompleted).toHaveBeenCalled()
  })
})
