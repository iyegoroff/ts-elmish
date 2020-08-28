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
    fixable: undefined,
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
    const { esTreeNodeToTSNodeMap } = getParserServices(context)

    return {
      Program: (node: es.Program) => {
        let hasState = false
        let hasAction = false
        let hasUpdate = false
        let hasInvalidUpdate = false
        let update: es.Expression | undefined
        const requiredActions: es.TSTypeOperator[] = []
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
            hasAction = true

            val.typeAnnotation.types.forEach((action) => {
              if (
                action.type === 'TSTypeOperator' &&
                action.typeAnnotation?.type === 'TSTupleType'
              ) {
                requiredActions.push(action)
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
            hasUpdate = true

            update = decl.declarations[0].init
          }
        })

        if (!(hasUpdate && hasState && hasAction && isDefined(update))) {
          return
        }

        if (
          update.type === 'ArrowFunctionExpression' &&
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
            loc: getLoc(esTreeNodeToTSNodeMap.get(update))
          })
        }

        requiredActions.forEach((action) => {
          if (
            isDefined(update) &&
            action.typeAnnotation?.type === 'TSTupleType' &&
            action.typeAnnotation.elementTypes.length > 0 &&
            action.typeAnnotation.elementTypes[0].type === 'TSLiteralType' &&
            action.typeAnnotation.elementTypes[0].literal.type === 'Literal'
          ) {
            const { raw } = action.typeAnnotation.elementTypes[0].literal
            const name = camelCase(raw)
            const actionName = `${name}Action`
            const updateName = `${name}Update`

            if (
              !hasInvalidUpdate &&
              !updateCases.some((c, i) => c.raw === raw && updateStatements[i].name === updateName)
            ) {
              context.report({
                messageId: 'invalidUpdate',
                loc: getLoc(esTreeNodeToTSNodeMap.get(update))
              })
            }

            if (
              !exportedActions.includes(actionName) &&
              !declaredActions.includes(actionName) &&
              !comments.some((c) => new RegExp(`const ${actionName} =`).test(c))
            ) {
              context.report({
                messageId: 'noAction',
                loc: getLoc(esTreeNodeToTSNodeMap.get(action))
              })
            }

            if (!exportedUpdates.includes(updateName) && !declaredUpdates.includes(updateName)) {
              context.report({
                messageId: 'noUpdate',
                loc: getLoc(esTreeNodeToTSNodeMap.get(action))
              })
            }
          }
        })
      }
    }
  }
})

export = rule
