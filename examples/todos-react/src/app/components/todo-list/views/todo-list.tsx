import React, { useEffect } from 'react'
import { ElmishProps } from '@ts-elmish/react'
import { pipe } from 'pipe-ts'
import { Dict } from 'ts-micro-dict'
import { usePipe } from 'use-pipe-ts'
import { TodoListState, TodoListAction } from '../todo-list-state'
import { Effects } from '../../../effects'
import { TodoItem } from './todo-item'

const {
  Todos: { listenTodoDictChanges, listenTodoFilterChanges, filteredTodos }
} = Effects

export const TodoList: React.FunctionComponent<ElmishProps<TodoListState, TodoListAction>> =
  React.memo(function TodoList({ dispatch, todos, todoFilter, editedTodoKey }) {
    useEffect(
      () =>
        listenTodoDictChanges({
          success: pipe(TodoListAction.setTodos, dispatch)
        }),
      [dispatch]
    )

    useEffect(
      () =>
        listenTodoFilterChanges({
          success: pipe(TodoListAction.setTodoFilter, dispatch),
          failure: pipe(TodoListAction.showTodoFilterAlert, dispatch)
        }),
      [dispatch]
    )

    const removeTodo = usePipe(TodoListAction.removeTodo, dispatch)

    const toggleCompletedTodo = usePipe(TodoListAction.toggleCompleted, dispatch)

    const startTodoEdit = usePipe(TodoListAction.startTodoEdit, dispatch)

    const cancelTodoEdit = usePipe(TodoListAction.cancelTodoEdit, dispatch)

    const confirmTodoEdit = usePipe(TodoListAction.confirmTodoEdit, dispatch)

    console.log('render TodoList')

    return (
      <div>
        {Dict.toArray(
          (todo, key) => (
            <React.Fragment key={key}>
              <TodoItem
                {...todo}
                id={key}
                isEdited={editedTodoKey === key}
                onRemove={removeTodo}
                onToggleCompleted={toggleCompletedTodo}
                onStartEdit={startTodoEdit}
                onCancelEdit={cancelTodoEdit}
                onConfirmEdit={confirmTodoEdit}
              />
            </React.Fragment>
          ),
          filteredTodos(todos, todoFilter)
        )}
      </div>
    )
  })
