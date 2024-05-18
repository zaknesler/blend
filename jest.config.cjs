/** @type {import('jest').Config} */
module.exports = {
  transform: { '^.+\\.(t|j)sx?$': '@swc/jest' },
  moduleNameMapper: { '^~/(.*)$': '<rootDir>/ui/src/$1' },
  coveragePathIgnorePatterns: ['/node_modules/'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  passWithNoTests: true,
};
