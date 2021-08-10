import { Todo } from '../../../domain/todos/types'
import { createTestRun, successResolver, stubEffects } from '../../../test-util'
import { TodoListAction, TodoListState } from './todo-list-state'

const { init, update } = TodoListState

const testRun = createTestRun(update)

const key = 'x'
const todo = {
  text: 'test',
  completed: false
}

const validState: TodoListState = {
  todos: { [key]: todo },
  todoFilter: 'all'
}

describe('components > todo-list', () => {
  test('init - success', async () => {
    const effects = stubEffects()

    const command = init(validState.todos, validState.todoFilter)

    expect(await testRun(command, effects)).toEqual<TodoListState>(validState)
  })

  test('start-todo-edit - todo found', async () => {
    const effects = stubEffects()

    const command = update(validState, TodoListAction.startTodoEdit(key), effects)

    expect(await testRun(command, effects)).toEqual<TodoListState>({
      ...validState,
      editedTodoKey: key
    })
  })

  test('start-todo-edit - todo not found', async () => {
    const effects = stubEffects()

    const command = update(validState, TodoListAction.startTodoEdit('y'), effects)

    expect(await testRun(command, effects)).toBe<TodoListState>(validState)
  })

  test('confirm-todo-edit - todo found', async () => {
    const text = '123'
    const effects = stubEffects({
      Todos: {
        updateTodo: jest.fn((k: string, t: Todo) => {
          expect(k).toEqual(key)
          expect(t).toEqual({
            ...todo,
            text
          })

          return successResolver(undefined)()
        })
      }
    })

    const command = update(validState, TodoListAction.confirmTodoEdit(key, text), effects)

    expect(await testRun(command, effects)).toEqual<TodoListState>({
      ...validState,
      todos: {
        [key]: {
          ...todo,
          text
        }
      }
    })

    expect(effects.Todos.updateTodo).toHaveBeenCalled()
  })

  test('confirm-todo-edit - todo not found', async () => {
    const effects = stubEffects()

    const command = update(validState, TodoListAction.confirmTodoEdit('y', 'text'), effects)

    expect(await testRun(command, effects)).toBe<TodoListState>(validState)
  })

  test('cancel-todo-edit', async () => {
    const effects = stubEffects()

    const command = update(
      {
        ...validState,
        editedTodoKey: key
      },
      TodoListAction.cancelTodoEdit(),
      effects
    )

    expect(await testRun(command, effects)).toEqual<TodoListState>(validState)
  })

  test('remove-todo', async () => {
    const effects = stubEffects({
      Todos: {
        removeTodo: jest.fn((k: string) => {
          expect(k).toEqual(key)

          return successResolver(undefined)()
        })
      }
    })

    const command = update(validState, TodoListAction.removeTodo(key), effects)

    expect(await testRun(command, effects)).toEqual<TodoListState>({
      ...validState,
      todos: {}
    })

    expect(effects.Todos.removeTodo).toHaveBeenCalled()
  })

  test('toggle-completed - todo found', async () => {
    const expectedTodo = {
      ...todo,
      completed: !todo.completed
    }

    const effects = stubEffects({
      Todos: {
        updateTodo: jest.fn((k: string, t: Todo) => {
          expect(k).toEqual(key)
          expect(t).toEqual(expectedTodo)

          return successResolver(undefined)()
        })
      }
    })

    const command = update(validState, TodoListAction.toggleCompleted(key), effects)

    expect(await testRun(command, effects)).toEqual<TodoListState>({
      ...validState,
      todos: {
        [key]: expectedTodo
      }
    })

    expect(effects.Todos.updateTodo).toHaveBeenCalled()
  })

  test('toggle-completed - todo not found', async () => {
    const effects = stubEffects()

    const command = update(validState, TodoListAction.toggleCompleted('y'), effects)

    expect(await testRun(command, effects)).toBe<TodoListState>(validState)
  })

  test('set-todos', async () => {
    const effects = stubEffects({
      Todos: {
        compareTodos: () => false
      }
    })

    const command = update(validState, TodoListAction.setTodos({}), effects)

    expect(await testRun(command, effects)).toEqual<TodoListState>({ ...validState, todos: {} })
  })

  test('set-todos - same state', async () => {
    const effects = stubEffects({
      Todos: {
        compareTodos: () => true
      }
    })

    const command = update(validState, TodoListAction.setTodos({ ...validState.todos }), effects)

    expect(await testRun(command, effects)).toBe<TodoListState>(validState)
  })

  test('set-todo-filter', async () => {
    const todoFilter = 'active' as const
    const effects = stubEffects()

    const command = update(validState, TodoListAction.setTodoFilter(todoFilter), effects)

    expect(await testRun(command, effects)).toEqual<TodoListState>({ ...validState, todoFilter })
  })

  test('set-todo-filter - same state', async () => {
    const todoFilter = 'all' as const
    const effects = stubEffects()

    const command = update(validState, TodoListAction.setTodoFilter(todoFilter), effects)

    expect(await testRun(command, effects)).toBe<TodoListState>(validState)
  })

  test('show-todo-filter-alert', async () => {
    const todoFilterLoadError = `Invalid todo filter - what?` as const

    const effects = stubEffects({
      Alert: {
        showError: jest.fn((error: string) => {
          expect(error).toEqual(todoFilterLoadError)

          return successResolver({ isConfirmed: true, isDenied: true, isDismissed: true })()
        })
      }
    })

    const command = update(
      validState,
      TodoListAction.showTodoFilterAlert(todoFilterLoadError),
      effects
    )

    expect(await testRun(command, effects)).toBe<TodoListState>(validState)

    expect(effects.Alert.showError).toHaveBeenCalled()
  })
})
