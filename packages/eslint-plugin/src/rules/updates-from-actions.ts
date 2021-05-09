import { TSESTree as es } from '@typescript-eslint/experimental-utils'
import { camelCase, paramCase, pascalCase } from 'change-case'
import { getLoc, getParserServices } from 'eslint-etc'
import { isDefined } from 'ts-is-defined'
import { ruleCreator } from '../utils'
import { RuleListener } from '@typescript-eslint/experimental-utils/dist/ts-eslint'

type Action = {
  readonly action: es.TSTypeOperator
  readonly name: string
  readonly literal: string
}

const spaces = /\s|[^\s\S]/g

const actionCase = (text: string) => camelCase(text).replace(/Action$/, '')

const last = <T>(arr: readonly T[]) => arr[arr.length - 1]

const stateType = (literal: string, { typeAnnotation }: es.TSTypeOperator) => {
  const state = `${pascalCase(actionCase(literal))}State`

  if (typeAnnotation?.type === 'TSTupleType' && typeAnnotation.elementTypes.length > 1) {
    const act = last(typeAnnotation.elementTypes)

    return act.type === 'TSTypeReference' && act.typeName.type === 'Identifier'
      ? act.typeName.name.replace(/Action$/, 'State')
      : state
  }

  return state
}

const ruleName = 'updates-from-actions'

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
      invalidUpdate: 'update function format invalid',
      invalidParam: 'invalid update function param'
    },
    schema: [],
    type: 'problem'
  },
  name: ruleName,
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
        const requiredActions: Action[] = []
        const declaredActions: string[] = []
        const declaredUpdates: string[] = []
        const declaredUpdatesParams: Record<string, es.Parameter[] | undefined> = {}
        const declaredUpdatesActionParams: Record<string, es.TypeNode | undefined> = {}
        const updateCases: Array<{
          readonly name: es.Literal
          readonly argsCount: number
        }> = []
        const updateStatements: es.Identifier[] = []
        const comments = code.getAllComments()

        const addAction = (act: es.TypeNode) => {
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
        }

        node.body.forEach((val) => {
          if (
            val.type === 'VariableDeclaration' &&
            val.declarations.length === 1 &&
            val.declarations[0].type === 'VariableDeclarator' &&
            val.declarations[0].id.type === 'Identifier' &&
            val.declarations[0].id.name === 'Action'
          ) {
            if (val.declarations[0].init?.type === 'ObjectExpression') {
              actionsObject = val.declarations[0].init
            } else if (
              val.declarations[0].init?.type === 'TSAsExpression' &&
              val.declarations[0].init?.expression.type === 'ObjectExpression'
            ) {
              actionsObject = val.declarations[0].init.expression
            }

            actionsObject?.properties.forEach((p) => {
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

          if (val.type === 'TSTypeAliasDeclaration' && code.getText(val.id) === 'Action') {
            action = val

            if (val.typeAnnotation.type === 'TSUnionType') {
              val.typeAnnotation.types.forEach(addAction)
            } else if (val.typeAnnotation.type === 'TSTypeOperator') {
              addAction(val.typeAnnotation)
            }
          }

          const decl = val.type === 'ExportNamedDeclaration' ? val.declaration : val

          if (decl?.type === 'VariableDeclaration' && decl.declarations.length > 0) {
            const firstDecl = decl.declarations[0]
            const name = code.getText(firstDecl.id)

            if (name.endsWith('Update')) {
              if (isDefined(firstDecl.init) && firstDecl.init.type === 'ArrowFunctionExpression') {
                declaredUpdatesParams[name] = firstDecl.init.params

                firstDecl.init.params.forEach((p) => {
                  if (
                    'typeAnnotation' in p &&
                    code
                      .getText(p.typeAnnotation?.typeAnnotation)
                      .includes(paramCase(name.replace(/Update$/, '')))
                  ) {
                    declaredUpdatesActionParams[name] = p.typeAnnotation?.typeAnnotation
                  }
                })
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
            if (
              c.test?.type === 'Literal' &&
              isDefined(c.consequent[0]) &&
              c.consequent[0].type === 'ReturnStatement' &&
              c.consequent[0].argument?.type === 'CallExpression'
            ) {
              updateCases.push({
                name: c.test,
                argsCount: c.consequent[0].argument.arguments.length
              })
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

        const spread = (arg?: es.TypeNode): string => {
          return arg?.type === 'TSNamedTupleMember'
            ? spread(arg.elementType)
            : arg?.type === 'TSTypeOperator'
            ? spread(arg.typeAnnotation)
            : arg?.type === 'TSTupleType'
            ? '...'
            : ''
        }

        const argName = (arg: es.TypeNode, idx: number) =>
          arg.type === 'TSNamedTupleMember' ? arg.label.name : `arg${idx}`

        const actionBody = requiredActions
          .map(({ name, literal: raw, action: act }) => {
            const actionName = raw.endsWith("-action'") ? `${name}Action` : name

            if (act.typeAnnotation?.type === 'TSTupleType') {
              const { elementTypes } = act.typeAnnotation
              const args = elementTypes.slice(1)

              const signature =
                args.length === 0
                  ? `(): Action => `
                  : args.reduce(
                      (acc, arg, idx) =>
                        `${acc}(${spread(arg)}${argName(arg, idx)}: ${code.getText(
                          arg.type === 'TSNamedTupleMember' ? arg.elementType : arg
                        )})${idx === args.length - 1 ? ': Action' : ''} => `,
                      ''
                    )

              return `\n  ${actionName}: ${signature}[${raw}${args.reduce(
                (acc, arg, idx) => `${acc}, ${argName(arg, idx)}`,
                ''
              )}]`
            }

            return ''
          })
          .join(',')

        if (
          code.getText(defActionsObject).replace(/^\{|\}$|\s|[^\s\S]/g, '') !==
            actionBody.replace(/^\{|\}$|\s|[^\s\S]/g, '') &&
          requiredActions.every(({ action: act }) => act.typeAnnotation?.type === 'TSTupleType')
        ) {
          context.report({
            messageId: 'noAction',
            loc: getLoc(esTreeNodeToTSNodeMap.get(defActionsObject)),
            fix: (fixer) => {
              const [start, end] = defActionsObject.range

              return fixer.replaceTextRange([start + 1, end - 1], `${actionBody}\n`)
            }
          })
        }

        requiredActions.forEach(({ name, literal: raw, action: act }) => {
          const updateName = `${name}Update`
          const param = declaredUpdatesActionParams[updateName]

          if (
            isDefined(param) &&
            code.getText(act).replace(spaces, '') !== code.getText(param).replace(spaces, '')
          ) {
            context.report({
              messageId: 'invalidParam',
              loc: getLoc(esTreeNodeToTSNodeMap.get(param)),
              fix: (fixer) => fixer.replaceText(param, code.getText(act))
            })
          }

          if (
            !hasInvalidUpdate &&
            code.getText(defUpdate.body).replace(spaces, '') !== updateBody.replace(spaces, '')
          ) {
            context.report({
              messageId: 'invalidUpdate',
              loc: getLoc(esTreeNodeToTSNodeMap.get(defUpdate)),
              fix: (fixer) => fixer.replaceTextRange(defUpdate.body.range, updateBody)
            })
          }

          if (!declaredUpdates.includes(updateName)) {
            const isSetter = raw.startsWith("'set-")

            const isDictAction =
              raw.endsWith("-action'") &&
              act.typeAnnotation?.type === 'TSTupleType' &&
              act.typeAnnotation.elementTypes.length === 3

            const isAction =
              raw.endsWith("-action'") &&
              act.typeAnnotation?.type === 'TSTupleType' &&
              act.typeAnnotation.elementTypes.length === 2

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
                    : isDictAction
                    ? `[, id, action]$2`
                    : '$1$2'
                )
              )
              .join(',\n')
              .replace('Action', code.getText(act))}\n)${code.getText(defUpdate.returnType)}${
              !isDefined(state)
                ? ` => {\n  return Effect.none()\n}\n\n`
                : isDictAction
                ? ` => {\n  const { ${actionCase(raw)} } = state\n  const prevState = ${actionCase(
                    raw
                  )}[id]\n\n  if (prevState === undefined) {\n    return [state, Effect.none()]\n  }\n\n  const [nextState, effect] = ${stateType(
                    raw,
                    act
                  )}.update(prevState, action)\n\n  return [\n    { ...state, ${actionCase(
                    raw
                  )}: Dict.put(${actionCase(
                    raw
                  )}, id, nextState) },\n    Effect.map(Action.${actionCase(
                    raw
                  )}Action(id), effect)\n  ]\n}\n\n`
                : isAction
                ? isStateless
                  ? ` => {\n  const ${actionCase(raw)}Effect = ${stateType(
                      raw,
                      act
                    )}.update(action${restUpdateParams})\n\n  return [state, Effect.map(Action.${actionCase(
                      raw
                    )}Action, ${actionCase(raw)}Effect)]\n}\n\n`
                  : ` => {\n  const [${actionCase(raw)}, ${actionCase(raw)}Effect] = ${stateType(
                      raw,
                      act
                    )}.update(state.${actionCase(
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

            const leadingComment = comments.find(
              ({ range: [, end] }) => end + 1 === defUpdateNode.range[0]
            )
            const range = isDefined(leadingComment) ? leadingComment.range : defUpdateNode.range

            context.report({
              messageId: 'noUpdate',
              loc: getLoc(esTreeNodeToTSNodeMap.get(act)),
              fix: (fixer) => fixer.insertTextBeforeRange(range, upd)
            })
          }
        })
      }
    }
  }
})

export = { name: ruleName, rule }
