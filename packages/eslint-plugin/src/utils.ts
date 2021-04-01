import { ESLintUtils } from '@typescript-eslint/experimental-utils'

export const ruleCreator = ESLintUtils.RuleCreator(
  (name) =>
    `https://github/iyegoroff/ts-elmish/tree/main/packages/eslint-plugin/docs/rules/${name}.md`
)
