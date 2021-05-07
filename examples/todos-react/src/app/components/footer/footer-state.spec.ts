import 'ts-jest'
import { Result } from 'ts-railway'
import { createTestRun, successResolver } from '../../../util'
import { stubEffects } from '../../effects'
import { FooterState } from './footer-state'

const { init, update } = FooterState

const testRun = createTestRun(update)

describe('components > footer', () => {
  test('init - success', async () => {
    const effects = stubEffects({
      Todos: {
        loadTodoFilter: () => Result.success('all'),
        loadTodoDict: successResolver({
          x: { text: '', completed: true }
        })
      }
    })

    const command = init(effects)

    expect(await testRun(command, effects)).toEqual<FooterState>({
      activeTodosAmount: 0,
      selectedTodoFilter: 'all'
    })
  })
})
