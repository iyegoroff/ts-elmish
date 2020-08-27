import { ESLintUtils } from '@typescript-eslint/experimental-utils'

// export function createRegExpForWords(config: string | string[]): RegExp | null {
//   if (!config || !config.length) {
//     return null
//   }
//   const flags = 'i'
//   if (typeof config === 'string') {
//     return new RegExp(config, flags)
//   }
//   const words = config
//   const joined = words.map((word) => String.raw`(\b|_)${word}(\b|_)`).join('|')
//   return new RegExp(`(${joined})`, flags)
// }

export const ruleCreator = ESLintUtils.RuleCreator(
  (name) =>
    `https://github/iyegoroff/ts-elmish/tree/main/packages/eslint-plugin/docs/rules/${name}.md`
)
