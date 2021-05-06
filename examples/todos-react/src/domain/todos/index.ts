import { Services } from '../../services'
import { listenTodoFilterChanges, updateTodoFilter, loadTodoFilter } from './todo-filter'
import {
  addTodo,
  updateTodo,
  listenTodoListChanges,
  removeTodo,
  loadTodoList,
  updateTodoList
} from './todo-list'

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
  listenTodoListChanges: listenTodoListChanges(listenChanges),
  removeTodo: removeTodo(load, update),
  loadTodoList: loadTodoList(load),
  updateTodoList: updateTodoList(update)
} as const
