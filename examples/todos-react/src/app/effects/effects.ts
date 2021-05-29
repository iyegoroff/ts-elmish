import { Domain } from '../../domain'
import { Services } from '../../services'

const {
  LocalData: { listenChanges, load, update },
  HashLocation: { listenChanges: listenHashChanges, change, current }
} = Services

const {
  Todos: {
    addTodo,
    clearCompleted,
    listenTodoDictChanges,
    listenTodoFilterChanges,
    loadTodoFilter,
    loadTodoDict,
    removeTodo,
    updateTodo,
    updateTodoDict,
    updateTodoFilter
  }
} = Domain

export const Effects = {
  Todos: {
    addTodo: addTodo(load, update),
    clearCompleted: clearCompleted(load, update),
    listenTodoDictChanges: listenTodoDictChanges(listenChanges),
    listenTodoFilterChanges: listenTodoFilterChanges(listenHashChanges),
    loadTodoFilter: loadTodoFilter(current),
    loadTodoDict: loadTodoDict(load),
    removeTodo: removeTodo(load, update),
    updateTodo: updateTodo(load, update),
    updateTodoDict: updateTodoDict(update),
    updateTodoFilter: updateTodoFilter(change)
  }
} as const
