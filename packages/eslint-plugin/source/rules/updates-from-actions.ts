import { TSESTree as es } from '@typescript-eslint/experimental-utils'
import { camelCase, pascalCase } from 'change-case'
import { getLoc, getParserServices } from 'eslint-etc'
import { isDefined } from 'ts-is-defined'
import { ruleCreator } from '../utils'
import { RuleListener } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

const actionCase = (text: string) => camelCase(text).replace(/Action$/, '')

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
      noAction: 'action object format invalid',
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
        let hasInvalidUpdate = false
        let state: es.TSTypeLiteral | undefined
        let action: es.TSTypeAliasDeclaration | undefined
        let actionsObject: es.ObjectExpression | undefined
        let updateNode: es.Node | undefined
        let update: es.Expression | undefined
        const requiredActions: Array<{
          readonly action: es.TSTypeOperator
          readonly name: string
          readonly literal: string
        }> = []
        const declaredActions: string[] = []
        const declaredUpdates: string[] = []
        const declaredUpdatesParams: Record<string, es.Parameter[] | undefined> = {}
        const updateCases: es.Literal[] = []
        const updateStatements: es.Identifier[] = []

        node.body.forEach((val) => {
          if (
            val.type === 'VariableDeclaration' &&
            val.declarations.length === 1 &&
            val.declarations[0].type === 'VariableDeclarator' &&
            val.declarations[0].id.type === 'Identifier' &&
            val.declarations[0].id.name === 'Action' &&
            val.declarations[0].init?.type === 'ObjectExpression'
          ) {
            actionsObject = val.declarations[0].init

            actionsObject.properties.forEach((p) => {
              if (p.type === 'Property' && p.key.type === 'Identifier') {
                declaredActions.push(p.key.name)
              }
            })
          }

          if (
            val.type === 'TSTypeAliasDeclaration' &&
            code.getText(val.id) === 'State' &&
            val.typeAnnotation.type === 'TSTypeLiteral'
          ) {
            state = val.typeAnnotation
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
                    name: actionCase(literal)
                  })
                }
              }
            })
          }

          const decl = val.type === 'ExportNamedDeclaration' ? val.declaration : val

          if (decl?.type === 'VariableDeclaration' && decl.declarations.length > 0) {
            const firstDecl = decl.declarations[0]
            const name = code.getText(firstDecl.id)

            if (name.endsWith('Update')) {
              if (isDefined(firstDecl.init) && firstDecl.init.type === 'ArrowFunctionExpression') {
                declaredUpdatesParams[name] = firstDecl.init.params
              }

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
        })

        if (
          !(
            isDefined(update) &&
            isDefined(action) &&
            isDefined(actionsObject) &&
            isDefined(updateNode) &&
            update.type === 'ArrowFunctionExpression'
          )
        ) {
          return
        }

        const defUpdate = update
        const defUpdateNode = updateNode
        const defActionsObject = actionsObject

        const params = (updateName: string) =>
          (declaredUpdatesParams[updateName] ?? defUpdate.params).map((_, i) => {
            const param = defUpdate.params[i]
            return param.type === 'Identifier' ? param.name : `arg_${i}`
          })

        const updateBody =
          '{\n  switch (action[0]) {\n' +
          requiredActions
            .map(
              ({ name, literal }) =>
                `    case ${literal}:\n      return ${actionCase(name)}Update(${params(
                  `${name}Update`
                ).join(', ')})\n`
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
            loc: getLoc(esTreeNodeToTSNodeMap.get(update)),
            fix: (fixer) => fixer.replaceTextRange(defUpdate.body.range, updateBody)
          })
        }

        if (
          requiredActions
            .map(({ name, literal }) => (literal.endsWith("-action'") ? `${name}Action` : name))
            .sort((x, y) => x.localeCompare(y))
            .join() !== [...declaredActions].sort((x, y) => x.localeCompare(y)).join() &&
          requiredActions.every(({ action: act }) => act.typeAnnotation?.type === 'TSTupleType')
        ) {
          context.report({
            messageId: 'noAction',
            loc: getLoc(esTreeNodeToTSNodeMap.get(defActionsObject)),
            fix: (fixer) => {
              const actionBody = requiredActions
                .map(({ name, literal: raw, action: act }) => {
                  const actionName = raw.endsWith("-action'") ? `${name}Action` : name

                  if (act.typeAnnotation?.type === 'TSTupleType') {
                    const { elementTypes } = act.typeAnnotation

                    const val =
                      elementTypes.length === 1
                        ? ''
                        : elementTypes.length === 2
                        ? `val: ${code.getText(
                            elementTypes[1].type === 'TSNamedTupleMember'
                              ? elementTypes[1].elementType
                              : elementTypes[1]
                          )}`
                        : `val: readonly ${code
                            .getText(act.typeAnnotation)
                            .replace(`${raw}, `, '')}`

                    return `\n  ${actionName}: (${val}): Action => [${raw}${
                      elementTypes.length === 1 ? '' : ', val'
                    }]`
                  }

                  return ''
                })
                .join(',')

              const [start, end] = defActionsObject.range

              return fixer.replaceTextRange([start + 1, end - 1], `${actionBody}\n`)
            }
          })
        }

        requiredActions.forEach(({ name, literal: raw, action: act }) => {
          const updateName = `${name}Update`

          if (
            !hasInvalidUpdate &&
            !updateCases.some((c, i) => c.raw === raw && updateStatements[i].name === updateName)
          ) {
            context.report({
              messageId: 'invalidUpdate',
              loc: getLoc(esTreeNodeToTSNodeMap.get(defUpdate)),
              fix: (fixer) => fixer.replaceTextRange(defUpdate.body.range, updateBody)
            })
          }

          if (!declaredUpdates.includes(updateName)) {
            const isSetter = raw.startsWith("'set-")
            const isAction = raw.endsWith("-action'")
            const isStateless = !(
              state?.members.some(
                (member) =>
                  member.type === 'TSPropertySignature' &&
                  member.key.type === 'Identifier' &&
                  member.key.name === name
              ) ?? false
            )
            const restUpdateParams = defUpdate.params
              .slice(2)
              .map((p) => code.getText(p).replace(/(\w+)(: \w+)/, ', $1'))
              .join('')

            const upd = `const ${updateName} = (\n${defUpdate.params
              .map((p) =>
                `  ${code.getText(p)}`.replace(
                  /(\w+)(: Action)/,
                  isSetter
                    ? `[, ${actionCase(raw.replace(/'set-([\w-]+)'/, '$1'))}]$2`
                    : isAction
                    ? `[, action]$2`
                    : '$1$2'
                )
              )
              .join(',\n')
              .replace('Action', code.getText(act))}\n)${code.getText(defUpdate.returnType)}${
              !isDefined(state)
                ? ` => {\n  return Effect.none()\n}\n\n`
                : isAction
                ? isStateless
                  ? ` => {\n  const ${actionCase(raw)}Effect = ${pascalCase(
                      actionCase(raw)
                    )}State.update(action${restUpdateParams})\n\n  return [state, Effect.map(Action.${actionCase(
                      raw
                    )}Action, ${actionCase(raw)}Effect)]\n}\n\n`
                  : ` => {\n  const [${actionCase(raw)}, ${actionCase(raw)}Effect] = ${pascalCase(
                      actionCase(raw)
                    )}State.update(state.${actionCase(
                      raw
                    )}, action${restUpdateParams})\n\n  return [{ ...state, ${actionCase(
                      raw
                    )} }, Effect.map(Action.${actionCase(raw)}Action, ${actionCase(
                      raw
                    )}Effect)]\n}\n\n`
                : ` => {\n  return [${
                    isSetter
                      ? `{ ...state, ${actionCase(raw.replace(/'set-([\w-]+)'/, '$1'))} }`
                      : 'state'
                  }, Effect.none()]\n}\n\n`
            }`

            context.report({
              messageId: 'noUpdate',
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
