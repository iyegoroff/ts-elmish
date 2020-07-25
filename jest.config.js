const config = {
  moduleFileExtensions: ['js', 'ts'],
  testPathIgnorePatterns: ['blueprint-templates'],
  testRegex: '\\.spec\\.ts$',
  transform: {
    '^.+\\.(js|tsx?)$': 'ts-jest'
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverage: true,
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/src/tsconfig.test.json',
      packageJson: 'package.json'
    }
  }
}

module.exports = {
  projects: [
    {
      displayName: 'example',
      rootDir: './example',
      ...config
    }
  ]
}
