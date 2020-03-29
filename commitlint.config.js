/* eslint-env node */

/**
 * <type>(scope):<description><reference>
 * example:
 * feat(root): fixes commitlint CURPAY-356
 */

module.exports = {
  extends: ['@commitlint/config-lerna-scopes'],
  rules: {
    'header-max-length': [2, 'always', 120],
    'scope-enum': [2, 'always', ['root', 'compose', 'head', 'pipe', 'trace']],
    'type-enum': [2, 'always', ['chore', 'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'release', 'revert']],
  },
}
