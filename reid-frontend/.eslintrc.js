module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'comma-dangle': ['warn', 'always-multiline'],
    indent: ['warn', 2, {
      SwitchCase: 1,
    }],
    'react/prop-types': ['off'],
    'newline-before-return': 'warn',
    'eol-last': 'warn',
    'no-multiple-empty-lines': 'warn',
    'standard/no-callback-literal': ['off'],
    'no-mixed-spaces-and-tabs': 0,
    semi: ['error', 'never'],
    'react/jsx-one-expression-per-line': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'error',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-return-assign': [
      'error',
      'except-parens',
    ],
    'object-curly-newline': 'off',
    'no-sequences': 'off',
    'import/no-extraneous-dependencies': [
      'off',
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-unused-vars': ['warn'],
    'no-confusing-arrow': 'off',
    'linebreak-style': 'off',
    quotes: ['warn', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'jsx-quotes': ['warn', 'prefer-single'],
  },
}
