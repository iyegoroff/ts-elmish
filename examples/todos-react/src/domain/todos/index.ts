import { Services } from '../../services'
import { listenTodoFilterChanges, updateTodoFilter, loadTodoFilter } from './todo-filter'
import {
  addTodo,
  updateTodo,
  listenTodoDictChanges,
  removeTodo,
  loadTodoDict,
  updateTodoDict
} from './todo-dict'

const {
  LocalData: { listenChanges, load, update },
  HashLocation: { listenChanges: listenHashChanges, change, current }
} = Services

export const Todos = {
  updateTodoFilter: updateTodoFilter(change),
  loadTodoFilter: loadTodoFilter(current),
  listenTodoFilterChanges: listenTodoFilterChanges(listenHashChanges),
  addTodo: addTodo(load, update),
  updateTodo: updateTodo(load, update),
  listenTodoDictChanges: listenTodoDictChanges(listenChanges),
  removeTodo: removeTodo(load, update),
  loadTodoDict: loadTodoDict(load),
  updateTodoDict: updateTodoDict(update)
} as const
