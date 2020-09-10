const projects = ['packages/core', 'examples/todos']

const config = {
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '\\./views': '<rootDir>/stub.js'
  },
  testPathIgnorePatterns: ['blueprint-templates'],
  testRegex: '\\.spec\\.ts$',
  transform: {
    '^.+\\.(js|tsx?)$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/src/tsconfig.test.json',
      packageJson: 'package.json'
    }
  }
}

module.exports = {
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testEnvironment: 'node',
  projects: projects.map((dir) => ({
    displayName: dir,
    rootDir: dir,
    ...config
  }))
}
