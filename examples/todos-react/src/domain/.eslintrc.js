module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['*react*', '@ts-elmish/*']
      }
    ]
  }
}
