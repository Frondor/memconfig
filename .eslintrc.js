module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:@typescript-eslint/recommended',
    'standard',
    'plugin:import/typescript',
    'plugin:jest/all',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'jest', 'standard', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2015,
    project: './tsconfig.eslint.json',
  },
  rules: {
    'prettier/prettier': 'error',
    'jest/prefer-expect-assertions': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': [2, { caseSensitive: false }],
  },
}
