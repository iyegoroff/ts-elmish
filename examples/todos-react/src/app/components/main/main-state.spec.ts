import { merge } from 'merge-anything'
import { Result } from 'ts-railway'
import { TodoFilter } from '../../../domain/todos/types'
import { createTestRun, stubEffects, successResolver } from '../../../test-util'
import { FooterAction } from '../footer'
import { TodoInputAction } from '../todo-input'
import { TodoListAction } from '../todo-list'
import { MainAction, MainState } from './main-state'

const { init, update } = MainState

const testRun = createTestRun(update)

const todoFilter = 'all' as const
const todos = {
  x: { text: 'test', completed: true }
} as const

const validState: MainState = {
  todoInput: {
    text: '',
    allTodosCompleted: true
  },
  footer: {
    activeTodosAmount: 0,
    hasCompletedTodos: true,
    todoFilter
  },
  todoList: {
    todoFilter,
    todos
  }
}

const loadingState: MainState = { loading: true }

describe('components > main', () => {
  test('init - success', async () => {
    const effects = stubEffects({
      Todos: {
        loadTodoDict: successResolver(todos),
        loadTodoFilter: () => Result.success(todoFilter)
      }
    })

    const command = init()

    expect(await testRun(command, effects)).toEqual<MainState>(validState)
  })

  test('todo-input-action', async () => {
    const text = '???'
    const effects = stubEffects()

    const command = update(
      validState,
      MainAction.todoInputAction(TodoInputAction.setText(text)),
      effects
    )

    expect(await testRun(command, effects)).toEqual<MainState>(
      merge(validState, { todoInput: { text } })
    )
  })

  test('todo-input-action - loading', async () => {
    const text = '???'
    const effects = stubEffects()

    const command = update(
      loadingState,
      MainAction.todoInputAction(TodoInputAction.setText(text)),
      effects
    )

    expect(await testRun(command, effects)).toBe<MainState>(loadingState)
  })

  test('todo-list-action', async () => {
    const editedTodoKey = 'x'
    const effects = stubEffects()

    const command = update(
      validState,
      MainAction.todoListAction(TodoListAction.startTodoEdit(editedTodoKey)),
      effects
    )

    expect(await testRun(command, effects)).toEqual<MainState>(
      merge(validState, { todoList: { editedTodoKey } })
    )
  })

  test('todo-list-action - loading', async () => {
    const editedTodoKey = 'x'
    const effects = stubEffects()

    const command = update(
      loadingState,
      MainAction.todoListAction(TodoListAction.startTodoEdit(editedTodoKey)),
      effects
    )

    expect(await testRun(command, effects)).toBe<MainState>(loadingState)
  })

  test('footer-action', async () => {
    const nextTodoFilter = 'active' as const
    const effects = stubEffects()

    const command = update(
      validState,
      MainAction.footerAction(FooterAction.setTodoFilter(nextTodoFilter)),
      effects
    )

    expect(await testRun(command, effects)).toEqual<MainState>(
      merge(validState, { footer: { todoFilter: nextTodoFilter } })
    )
  })

  test('footer-action - loading', async () => {
    const nextTodoFilter = 'active' as const
    const effects = stubEffects()

    const command = update(
      loadingState,
      MainAction.footerAction(FooterAction.setTodoFilter(nextTodoFilter)),
      effects
    )

    expect(await testRun(command, effects)).toBe<MainState>(loadingState)
  })

  test('handle-todo-filter-load-error - failure', async () => {
    const todoFilterLoadError = 'Invalid todo filter - fail' as const

    const effects = stubEffects({
      Todos: {
        loadTodoFilter: () => Result.success('all'),
        loadTodoDict: successResolver(todos),
        updateTodoFilter: jest.fn((filter: TodoFilter) => {
          expect(filter).toEqual('all')
          return Result.success(filter)
        })
      },
      Alert: {
        showError: jest.fn((error: string) => {
          expect(error).toEqual(`${todoFilterLoadError}<br/>Switching to default`)

          return successResolver({ isConfirmed: true, isDenied: true, isDismissed: true })()
        })
      }
    })

    const command = update(
      validState,
      MainAction.handleTodoFilterLoadError(todoFilterLoadError),
      effects
    )

    expect(await testRun(command, effects)).toEqual<MainState>(validState)

    expect(effects.Todos.updateTodoFilter).toHaveBeenCalled()
    expect(effects.Alert.showError).toHaveBeenCalled()
  })
})
