/** @type { import("eslint").Linter.Config } */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2023,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:solid/typescript'],
  plugins: ['prettier', '@typescript-eslint', 'solid'],
  env: {
    browser: true,
    es2023: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-nested-ternary': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 'off',
    'prettier/prettier': [
      'error',
      {
        useTabs: false,
        tabWidth: 2,
        arrowParens: 'avoid',
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 120,
        endOfLine: 'lf',
        plugins: ['prettier-plugin-tailwindcss'],
      },
    ],
  },
};
