import onetime from 'onetime'
import { LocalData } from '../../services/local-data/types'
import { HashLocation } from '../../services/hash-location/types'
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
  create: onetime(
    ({ load, update, listenChanges }: LocalData, hashLocation: HashLocation) =>
      ({
        addTodo: addTodo(load, update),
        updateTodo: updateTodo(load, update),
        listenTodoDictChanges: listenTodoDictChanges(listenChanges),
        removeTodo: removeTodo(load, update),
        loadTodoDict: loadTodoDict(load),
        updateTodoDict: updateTodoDict(update),
        filteredTodos,
        clearCompleted: clearCompleted(load, update),
        compareTodos,
        listenTodoFilterChanges: listenTodoFilterChanges(hashLocation.listenChanges),
        updateTodoFilter: updateTodoFilter(hashLocation.change),
        loadTodoFilter: loadTodoFilter(hashLocation.current)
      } as const),
    { throw: true }
  )
} as const
