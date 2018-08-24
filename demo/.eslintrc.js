'use strict';

module.exports = {
  extends: 'airbnb',
  rules: {
    'class-methods-use-this': 0,
    'consistent-return': 0,
    'function-paren-newline': 0,
      indent: ['error', 4, {
          SwitchCase: 1,
          VariableDeclarator: 1,
          outerIIFEBody: 1,
          // MemberExpression: null,
          // CallExpression: {
          // parameters: null,
          // },
          FunctionDeclaration: {
              parameters: 1,
              body: 1,
          },
          FunctionExpression: {
              parameters: 1,
              body: 1,
          },
      }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'jsx-a11y/label-has-for': 0,
    'no-console': 0,
    'no-else-return': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': ['error', { 'allow': ['_id', '__STATE'] }],
    'object-curly-newline': 0,
    // 'react/forbid-component-props': ['error', { 'forbid': ['data', 'item'] }],
    'react/jsx-indent': ['error', 4],
    'react/jsx-indent-props': ['error', 4],
    'react/prop-types': ['error', {
        ignore: [],
        customValidators: [],
      },
    ],
    'react/require-default-props': 0,
    semi: ['error', 'always'],
    'linebreak-style': 0
  },
  parser: 'babel-eslint',
  env: {
    browser: true,
    mocha: true,
    node: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: [
          'node_modules',
          '.',
        ]
      }
    }
  }
};
