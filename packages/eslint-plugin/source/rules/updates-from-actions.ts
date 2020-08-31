import { TSESTree as es } from '@typescript-eslint/experimental-utils'
import { camelCase } from 'change-case'
import { getLoc, getParserServices } from 'eslint-etc'
import { isDefined } from 'ts-is-defined'
import { ruleCreator } from '../utils'
import { RuleListener } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Eslint codegen',
      recommended: false
    },
    fixable: 'code',
    messages: {
      noAction: 'needs action creator function',
      noUpdate: 'needs update function',
      invalidUpdate: 'update function format invalid'
    },
    schema: [],
    type: 'problem'
  },
  name: 'updates-from-actions',
  create: (context): RuleListener => {
    const code = context.getSourceCode()
    // @ts-expect-error version conflict
    const { esTreeNodeToTSNodeMap } = getParserServices(context)

    return {
      Program: (node: es.Program) => {
        let hasState = false
        let hasInvalidUpdate = false
        let action: es.TSTypeAliasDeclaration | undefined
        let updateNode: es.Node | undefined
        let update: es.Expression | undefined
        let init: es.Node | undefined
        const requiredActions: Array<{
          readonly action: es.TSTypeOperator
          readonly name: string
          readonly literal: string
        }> = []
        const exportedActions: string[] = []
        const declaredActions: string[] = []
        const exportedUpdates: string[] = []
        const declaredUpdates: string[] = []
        const updateCases: es.Literal[] = []
        const updateStatements: es.Identifier[] = []
        const comments = (node.comments ?? []).map((c) => c.value)

        node.body.forEach((val) => {
          if (val.type === 'ImportDeclaration') {
            val.specifiers.forEach((spec) => {
              const name = spec.type === 'ImportSpecifier' ? spec.local.name : ''

              if (name.endsWith('Action')) {
                exportedActions.push(name)
              }

              if (name.endsWith('Update')) {
                exportedUpdates.push(name)
              }
            })
          }

          if (val.type === 'TSTypeAliasDeclaration' && code.getText(val.id) === 'State') {
            hasState = true
          }

          if (
            val.type === 'TSTypeAliasDeclaration' &&
            code.getText(val.id) === 'Action' &&
            val.typeAnnotation.type === 'TSUnionType'
          ) {
            action = val

            val.typeAnnotation.types.forEach((act) => {
              if (
                act.type === 'TSTypeOperator' &&
                act.typeAnnotation?.type === 'TSTupleType' &&
                act.typeAnnotation.elementTypes.length > 0
              ) {
                const first = act.typeAnnotation.elementTypes[0]
                const literal =
                  first.type === 'TSLiteralType' && first.literal.type === 'Literal'
                    ? first.literal.raw
                    : first.type === 'TSNamedTupleMember' &&
                      first.elementType.type === 'TSLiteralType' &&
                      first.elementType.literal.type === 'Literal'
                    ? first.elementType.literal.raw
                    : undefined

                if (isDefined(literal)) {
                  requiredActions.push({
                    action: act,
                    literal,
                    name: camelCase(literal)
                  })
                }
              }
            })
          }

          const decl = val.type === 'ExportNamedDeclaration' ? val.declaration : val

          if (decl?.type === 'VariableDeclaration' && decl.declarations.length > 0) {
            const name = code.getText(decl.declarations[0].id)

            if (name.endsWith('Action')) {
              declaredActions.push(name)
            }

            if (name.endsWith('Update')) {
              declaredUpdates.push(name)
            }
          }

          if (
            decl?.type === 'VariableDeclaration' &&
            decl.declarations.length > 0 &&
            code.getText(decl.declarations[0].id).startsWith('update') &&
            isDefined(decl.declarations[0].init)
          ) {
            updateNode = val
            update = decl.declarations[0].init
          }

          if (
            decl?.type === 'VariableDeclaration' &&
            decl.declarations.length > 0 &&
            code.getText(decl.declarations[0].id).startsWith('init') &&
            isDefined(decl.declarations[0].init)
          ) {
            init = decl.parent
          }
        })

        if (
          !(
            hasState &&
            isDefined(update) &&
            isDefined(action) &&
            isDefined(update) &&
            isDefined(init) &&
            isDefined(updateNode) &&
            update.type === 'ArrowFunctionExpression'
          )
        ) {
          return
        }

        const defUpdate = update
        const defInit = init
        const defUpdateNode = updateNode

        const params = update.params.map((p, i) => (p.type === 'Identifier' ? p.name : `arg${i}`))
        const subst =
          '{\n  switch (action[0]) {\n' +
          requiredActions
            .map(
              (val) =>
                `    case ${val.literal}:\n      return ${val.name}Update(${params.join(', ')})\n`
            )
            .join('\n') +
          '  }\n}'

        if (
          update.body.type === 'BlockStatement' &&
          update.body.body.length === 1 &&
          update.body.body[0].type === 'SwitchStatement' &&
          update.body.body[0].cases.filter(
            (c) =>
              c.test?.type === 'Literal' &&
              c.consequent.length === 1 &&
              c.consequent[0].type === 'ReturnStatement' &&
              c.consequent[0].argument?.type === 'CallExpression' &&
              c.consequent[0].argument.callee.type === 'Identifier'
          ).length === requiredActions.length
        ) {
          update.body.body[0].cases.forEach((c) => {
            if (c.test?.type === 'Literal') {
              updateCases.push(c.test)
            }

            if (
              c.consequent.length === 1 &&
              c.consequent[0].type === 'ReturnStatement' &&
              c.consequent[0].argument?.type === 'CallExpression' &&
              c.consequent[0].argument.callee.type === 'Identifier'
            ) {
              updateStatements.push(c.consequent[0].argument.callee)
            }
          })
        } else {
          hasInvalidUpdate = true

          context.report({
            messageId: 'invalidUpdate',
            // @ts-expect-error
            loc: getLoc(esTreeNodeToTSNodeMap.get(update)),
            fix: (fixer) => fixer.replaceTextRange(defUpdate.body.range, subst)
          })
        }

        requiredActions.forEach(({ name, literal: raw, action: act }) => {
          const actionName = `${name}Action`
          const updateName = `${name}Update`

          if (
            !hasInvalidUpdate &&
            !updateCases.some((c, i) => c.raw === raw && updateStatements[i].name === updateName)
          ) {
            context.report({
              messageId: 'invalidUpdate',
              // @ts-expect-error version conflict
              loc: getLoc(esTreeNodeToTSNodeMap.get(defUpdate)),
              fix: (fixer) => fixer.replaceTextRange(defUpdate.body.range, subst)
            })
          }

          if (
            !exportedActions.includes(actionName) &&
            !declaredActions.includes(actionName) &&
            !comments.some((c) => new RegExp(`const ${actionName} =`).test(c)) &&
            act.typeAnnotation?.type === 'TSTupleType'
          ) {
            const { elementTypes } = act.typeAnnotation

            context.report({
              messageId: 'noAction',
              // @ts-expect-error version conflict
              loc: getLoc(esTreeNodeToTSNodeMap.get(act)),
              fix: (fixer) => {
                const val =
                  elementTypes.length === 1
                    ? ''
                    : elementTypes.length === 2
                    ? `val: ${code.getText(
                        elementTypes[1].type === 'TSNamedTupleMember'
                          ? elementTypes[1].elementType
                          : elementTypes[1]
                      )}`
                    : `val: readonly ${code.getText(act.typeAnnotation).replace(`${raw}, `, '')}`

                return fixer.insertTextBefore(
                  defInit,
                  `// const ${actionName} = (${val}): Action => [${raw}${
                    elementTypes.length === 1 ? '' : ', val'
                  }]\n\n`
                )
              }
            })
          }

          if (!exportedUpdates.includes(updateName) && !declaredUpdates.includes(updateName)) {
            const isSetter = raw.startsWith("'set-")
            const upd = `const ${updateName} = (\n${defUpdate.params
              .map((p) =>
                `  ${code.getText(p)}`.replace(
                  /(\w+)(: Action)/,
                  isSetter ? `[, ${camelCase(raw.replace(/'set-([\w-]+)'/, '$1'))}]$2` : '$1$2'
                )
              )
              .join(',\n')
              .replace('Action', code.getText(act))}\n)${code.getText(
              defUpdate.returnType
            )} => {\n  return [${
              isSetter ? `{ ...state, ${camelCase(raw.replace(/'set-([\w-]+)'/, '$1'))} }` : 'state'
            }, Effect.none()]\n}\n\n`

            context.report({
              messageId: 'noUpdate',
              // @ts-expect-error version conflict
              loc: getLoc(esTreeNodeToTSNodeMap.get(act)),
              fix: (fixer) => fixer.insertTextBefore(defUpdateNode, upd)
            })
          }
        })
      }
    }
  }
})

export = rule
