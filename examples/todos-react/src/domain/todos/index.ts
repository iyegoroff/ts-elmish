import { listenTodoFilterChanges, updateTodoFilter, loadTodoFilter } from './todo-filter'
import {
  addTodo,
  updateTodo,
  listenTodoDictChanges,
  removeTodo,
  loadTodoDict,
  updateTodoDict,
  filteredTodos,
  clearCompleted,
  compareTodos
} from './todo-dict'

export const Todos = {
  updateTodoFilter,
  loadTodoFilter,
  listenTodoFilterChanges,
  addTodo,
  updateTodo,
  listenTodoDictChanges,
  removeTodo,
  loadTodoDict,
  updateTodoDict,
  clearCompleted,
  filteredTodos,
  compareTodos
} as const
