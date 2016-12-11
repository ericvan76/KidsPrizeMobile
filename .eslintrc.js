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
    'indent': [2, 2, { 'SwitchCase': 1 }],
    'linebreak-style': [2, 'unix'],
    'quotes': [2, 'single'],
    'semi': [2, 'always'],
    'flowtype/require-valid-file-annotation': [2, 'always', { 'annotationStyle': 'block' }],
    'flowtype/require-parameter-type': [2, { 'excludeArrowFunctions': 'expressionsOnly' }]
  }
};