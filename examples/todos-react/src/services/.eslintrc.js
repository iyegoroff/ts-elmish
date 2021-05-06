module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@ts-elmish/*']
      }
    ]
  }
}
