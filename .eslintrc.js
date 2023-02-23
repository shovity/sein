module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['plugin:prettier/recommended', 'eslint:recommended'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_|^next$',
            },
        ],
    },
    globals: {
        holder: true,
        chrome: true,
        window: true,
        document: true,
        HTMLElement: true,
        HTMLCollection: true,
        NodeList: true,
        Blob: true,
        FileReader: true,
    },
}
