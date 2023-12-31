/** @type { import("eslint").Linter.Config } */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2023,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['prettier', '@typescript-eslint'],
  env: {
    browser: true,
    es2023: true,
    node: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        useTabs: false,
        tabWidth: 2,
        arrowParens: 'avoid',
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 120,
        endOfLine: 'crlf',
        plugins: ['prettier-plugin-tailwindcss'],
      },
    ],
  },
};
