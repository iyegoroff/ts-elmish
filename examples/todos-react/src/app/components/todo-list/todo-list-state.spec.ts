import 'ts-jest'
import { Result } from 'ts-railway'
import { createTestRun, successResolver } from '../../../util'
import { stubEffects } from '../../effects'
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
  editedText: ''
}

describe('components > todo-list', () => {
  test('init - success', async () => {
    const todoFilter = 'all'
    const effects = stubEffects({
      Todos: {
        loadTodoFilter: () => Result.success(todoFilter),
        loadTodoDict: successResolver(validState.todos)
      }
    })

    const command = init(effects)

    expect(await testRun(command, effects)).toEqual<TodoListState>({
      ...validState,
      todoFilter
    })
  })

  test('start-todo-edit - todo found', async () => {
    const effects = stubEffects()

    const command = update(validState, TodoListAction.startTodoEdit(key), effects)

    expect(await testRun(command, effects)).toEqual<TodoListState>({
      ...validState,
      editedTodoKey: key,
      editedText: validState.todos[key]?.text ?? ''
    })
  })

  test('start-todo-edit - todo not found', async () => {
    const effects = stubEffects()

    const command = update(validState, TodoListAction.startTodoEdit('y'), effects)

    expect(await testRun(command, effects)).toEqual<TodoListState>(validState)
  })

  test('confirm-todo-edit - todo found', async () => {
    const text = '123'
    const effects = stubEffects({
      Todos: {
        updateTodo: jest.fn((k, t) => {
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

    expect(await testRun(command, effects)).toEqual<TodoListState>(validState)
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
        removeTodo: jest.fn((k) => {
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
        updateTodo: jest.fn((k, t) => {
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

    expect(await testRun(command, effects)).toEqual<TodoListState>(validState)
  })
})
