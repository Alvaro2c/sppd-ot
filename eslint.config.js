import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'warn',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-dupe-else-if': 'error',
      'no-empty': 'warn',
      'no-extra-semi': 'error',
      'no-irregular-whitespace': 'error',
      'no-unexpected-multiline': 'error',
      'valid-typeof': 'error'
    }
  }
]; 