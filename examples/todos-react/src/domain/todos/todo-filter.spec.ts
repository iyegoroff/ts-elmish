import { Result } from 'ts-railway'
import { loadTodoFilter, updateTodoFilter, listenTodoFilterChanges } from './todo-filter'

type LoadTodoFilter = ReturnType<ReturnType<typeof loadTodoFilter>>
type UpdateTodoFilter = ReturnType<ReturnType<typeof updateTodoFilter>>

describe('domain > todos > todo-filter', () => {
  test('loadTodoFilter', () => {
    expect(loadTodoFilter(() => 'active')()).toEqual<LoadTodoFilter>(Result.success('active'))
    expect(loadTodoFilter(() => '')()).toEqual<LoadTodoFilter>(Result.success('all'))
  })

  test('updateTodoFilter', () => {
    expect(updateTodoFilter((x) => x)('active')).toEqual<UpdateTodoFilter>(Result.success('active'))
  })

  test('listenTodoFilterChanges', () => {
    expect(listenTodoFilterChanges(() => () => 1)({ success: () => 1 })).toBeDefined()
  })
})
