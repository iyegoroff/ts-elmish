const projects = [
  'packages/core',
  'packages/basic-effects',
  'packages/railway-effects',
  'examples/counters-mithril',
  'examples/todos-react'
]

const config = {
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^\\./(views)$': '<rootDir>/stub.js'
  },
  testPathIgnorePatterns: ['blueprint-templates'],
  testRegex: '\\.spec\\.ts$',
  transform: {
    '^.+\\.(js|tsx?)$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/src/tsconfig.json'
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
