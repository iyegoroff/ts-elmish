import React, { KeyboardEvent, useCallback } from 'react'
import { usePipe } from 'use-pipe-ts'
import { useNullRef } from 'use-null-ref'
import { Todo } from '../../../../domain/todos/types'
import { destroy, label, todoInput, todoItem, toggle } from './todo-item.css'

type TodoItemProps = Todo & {
  readonly id: string
  readonly isEdited: boolean
  readonly onStartEdit: (id: string) => undefined
  readonly onConfirmEdit: (id: string, text: string) => undefined
  readonly onCancelEdit: () => undefined
  readonly onRemove: (id: string) => undefined
  readonly onToggleCompleted: (id: string) => undefined
}

export const TodoItem = React.memo(function TodoItem({
  text,
  completed,
  onStartEdit,
  onConfirmEdit,
  onCancelEdit,
  onRemove,
  onToggleCompleted,
  isEdited,
  id: key
}: TodoItemProps) {
  const editInput = useNullRef<HTMLInputElement>()
  const getKey = useCallback(() => key, [key])
  const toggleCompleted = usePipe(getKey, onToggleCompleted)
  const edit = usePipe(getKey, onStartEdit)
  const remove = usePipe(getKey, onRemove)

  const processEdit = useCallback(
    ({ code }: KeyboardEvent) =>
      code === 'Enter'
        ? onConfirmEdit(key, editInput.current?.value ?? '')
        : code === 'Escape'
        ? onCancelEdit()
        : undefined,
    [onCancelEdit, onConfirmEdit, key, editInput]
  )

  const item = (
    <>
      <input
        key={'item'}
        className={toggle}
        type={'checkbox'}
        checked={completed}
        onChange={toggleCompleted}
      />
      <label className={label[completed ? 'completed' : 'active']} onDoubleClick={edit}>
        {text}
      </label>
      <button className={destroy} onClick={remove}></button>
    </>
  )

  const edited = (
    <input
      key={'edited'}
      className={todoInput}
      defaultValue={text}
      onKeyDown={processEdit}
      ref={editInput}
      autoFocus={true}
      onBlur={onCancelEdit}
    />
  )

  console.log(`render TodoItem ${text}`)

  return <div className={todoItem}>{isEdited ? edited : item}</div>
})
