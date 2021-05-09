import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import { ruleTester } from '../utils'
// @ts-expect-error
import rule from '../../src/rules/react-exhaustive-deps'

ruleTester({ types: true }).run(rule.name, rule.rule, {
  valid: [
    fromFixture(
      stripIndent`
        // VALID
        export const TodoList: React.FunctionComponent<
          ElmishProps<TodoListState, TodoListAction>
        > = ElmishMemo(function TodoList({ dispatch }) {
          useEffect(
            () =>
              listenTodoFilterChanges({
                success: pipe(TodoListAction.setTodoFilter, dispatch)
              }),
            []
          )

          return <div>TodoList</div>
        })
      `
    )
  ],
  invalid: []
})
