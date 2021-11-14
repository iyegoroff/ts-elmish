import { Effect } from '@ts-elmish/railway-effects'
import { pipe } from 'pipe-ts'
import { Dict } from 'ts-micro-dict'
import { AsyncResult } from 'ts-railway'
import { Todo, TodoDict } from '../../../domain/todos/types'
import { Effects } from '../../effects/types'

type State = {
  readonly text: string
  readonly allTodosCompleted: boolean
}

type Action =
  | readonly ['set-text', string]
  | readonly ['add-todo']
  | readonly ['toggle-all-todos-completed']
  | readonly ['todo-dict-changed', TodoDict]

const Action = {
  setText: (arg0: string): Action => ['set-text', arg0],
  addTodo: (): Action => ['add-todo'],
  toggleAllTodosCompleted: (): Action => ['toggle-all-todos-completed'],
  todoDictChanged: (arg0: TodoDict): Action => ['todo-dict-changed', arg0]
} as const

type Command = readonly [State, Effect<Action>]

const allCompleted = Dict.every<Todo>(({ completed }) => completed)

const init = (todos: TodoDict): Command => {
  return [{ text: '', allTodosCompleted: allCompleted(todos) }, Effect.none()]
}

const update = (state: State, action: Action, effects: Effects): Command => {
  switch (action[0]) {
    case 'set-text': {
      const [, text] = action

      return [{ ...state, text }, Effect.none()]
    }

    case 'add-todo': {
      const {
        Todos: { addTodo }
      } = effects
      const { text } = state

      return [
        { ...state, text: '' },
        text === '' ? Effect.none() : Effect.from({ result: () => addTodo(text) })
      ]
    }

    case 'toggle-all-todos-completed': {
      const {
        Todos: { loadTodoDict, updateTodoDict }
      } = effects

      const allTodosCompleted = !state.allTodosCompleted

      return [
        { ...state, allTodosCompleted },
        Effect.from({
          result: pipe(
            loadTodoDict,
            AsyncResult.map(Dict.map((todo: Todo) => ({ ...todo, completed: allTodosCompleted }))),
            AsyncResult.flatMap(updateTodoDict)
          )
        })
      ]
    }

    case 'todo-dict-changed': {
      const [, todos] = action

      const allTodosCompleted = allCompleted(todos)

      return [
        allTodosCompleted !== state.allTodosCompleted ? { ...state, allTodosCompleted } : state,
        Effect.none()
      ]
    }
  }
}

export type TodoInputState = State
export type TodoInputAction = Action

export const TodoInputState = { init, update } as const
export const TodoInputAction = Action
