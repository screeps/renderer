module.exports = {
    extends: 'airbnb-base',
    rules: {
        'class-methods-use-this': 0,
        'comma-dangle': ['error', {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'never',
        }],
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
        'no-console': 0,
        'no-else-return': 0,
        'no-param-reassign': 0,
        'no-shadow': 0,
        'no-underscore-dangle': 0,
        'object-curly-newline': 0,
        strict: ['error', 'global'],
        'linebreak-style': 0,
        'import/no-extraneous-dependencies': 0
    },
    globals: {
        PIXI: true,
        RENDERER_METADATA: true,
    },
    parserOptions: {
        sourceType: 'module',
    },

    settings: {
        'import/resolver': {
            node: {
                moduleDirectory: [
                    'node_modules',
                    '.',
                ],
            },
        },
    },
};
