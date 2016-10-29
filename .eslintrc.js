module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:flowtype/recommended'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
      classes: true
    },
    sourceType: 'module'
  },
  plugins: [
    'react',
    'flowtype'
  ],
  rules: {
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'flowtype/require-valid-file-annotation': [2, 'always', { 'annotationStyle': 'block' }],
    'flowtype/require-parameter-type': [2, { 'excludeArrowFunctions': 'expressionsOnly' }]
  }
};