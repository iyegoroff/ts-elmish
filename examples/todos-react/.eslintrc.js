module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./src/tsconfig.json', './src/tsconfig.build.json']
  },
  plugins: ['@typescript-eslint', 'prettier', 'no-null', 'functional'],
  extends: [
    'plugin:react-hooks/recommended',
    'standard-with-typescript',
    'plugin:react/recommended',
    'prettier',
    'plugin:functional/external-recommended',
    'plugin:functional/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'max-params': ['error', 3],
    'no-shadow': 'error',
    'prettier/prettier': 'warn',
    'no-null/no-null': 'error',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          null: null,
          void: null
        }
      }
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    'functional/functional-parameters': 'off',
    'functional/no-conditional-statement': ['error', { allowReturningBranches: true }],
    'functional/no-expression-statement': [
      'error',
      {
        ignorePattern: '^(useFocusEffect|useEffect|assert|(describe|test|expect|console)[^\\w])'
      }
    ],
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          'react-native-vector-icons/*',
          '**/types',
          '**/*-screen/name',
          '**/domain/config',
          '**/domain/util'
        ]
      }
    ],
    'import/namespace': 'off',
    'import/order': 'error',
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './examples/todos-react/src/services',
            from: './examples/todos-react/src/app'
          },
          {
            target: './examples/todos-react/src/services',
            from: './examples/todos-react/src/domain'
          },
          {
            target: './examples/todos-react/src/domain',
            from: './examples/todos-react/src/app'
          }
        ]
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
