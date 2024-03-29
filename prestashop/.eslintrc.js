module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'accessor-pairs': 'error',
    'array-bracket-newline': ['error', { multiline: true }],
    'array-bracket-spacing': 'error',
    'array-callback-return': 'error',
    'array-element-newline': ['error', 'consistent'],
    'arrow-body-style': 'error',
    'arrow-spacing': 'error',
    'block-scoped-var': 'error',
    'block-spacing': 'error',
    'brace-style': 'error',
    'class-methods-use-this': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',
    'comma-style': 'error',
    'complexity': 'error',
    'computed-property-spacing': 'error',
    'consistent-return': 'warn',
    'consistent-this': 'error',
    'curly': 'error',
    'default-case': 'error',
    'default-case-last': 'error',
    'default-param-last': 'error',
    'dot-location': ['error', 'property'],
    'dot-notation': 'error',
    'eol-last': 'error',
    'eqeqeq': 'error',
    'func-call-spacing': 'error',
    'func-name-matching': 'error',
    'func-names': 'error',
    'function-call-argument-newline': ['error', 'consistent'],
    'generator-star-spacing': 'error',
    'grouped-accessor-pairs': 'error',
    'guard-for-in': 'error',
    'id-denylist': 'error',
    'id-match': 'error',
    'implicit-arrow-linebreak': 'error',
    'indent': ['error', 2],
    'init-declarations': 'error',
    'jsx-quotes': 'error',
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'linebreak-style': 'error',
    'max-classes-per-file': 'error',
    'max-depth': 'error',
    'max-len': ['error', { code: 120, ignoreComments: true, ignoreStrings: true }],
    'max-lines': 'error',
    'max-lines-per-function': ['error', 100],
    'max-nested-callbacks': 'error',
    'max-params': 'error',
    'max-statements-per-line': 'error',
    'multiline-ternary': ['error', 'always-multiline'],
    'new-parens': 'error',
    'newline-per-chained-call': 'error',
    'no-alert': 'error',
    'no-array-constructor': 'error',
    'no-await-in-loop': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-confusing-arrow': 'error',
    'no-constructor-return': 'error',
    'no-continue': 'error',
    'no-div-regex': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-extra-parens': 'error',
    'no-floating-decimal': 'error',
    'no-implicit-coercion': 'error',
    'no-implicit-globals': 'error',
    'no-implied-eval': 'error',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-loss-of-precision': 'error',
    'no-mixed-operators': 'error',
    'no-multi-assign': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': 'error',
    'no-negated-condition': 'error',
    'no-nested-ternary': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-wrappers': 'error',
    'no-nonoctal-decimal-escape': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-plusplus': 'error',
    'no-promise-executor-return': 'error',
    'no-proto': 'error',
    'no-restricted-exports': 'error',
    'no-restricted-globals': 'error',
    'no-restricted-imports': 'error',
    'no-restricted-properties': 'error',
    'no-restricted-syntax': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-tabs': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unneeded-ternary': 'error',
    'no-unreachable-loop': 'error',
    'no-unsafe-optional-chaining': 'error',
    'no-unused-expressions': 'error',
    'no-use-before-define': ['error', { functions: false }],
    'no-useless-backreference': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': 'error',
    'object-curly-newline': ['error', { consistent: true, minProperties: 4 }],
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
    'object-shorthand': 'error',
    'one-var-declaration-per-line': 'error',
    'operator-assignment': 'error',
    'padded-blocks': ['error', 'never'],
    'padding-line-between-statements': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': 'error',
    'prefer-exponentiation-operator': 'error',
    'prefer-named-capture-group': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-regex-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'consistent-as-needed'],
    'require-atomic-updates': 'error',
    'require-await': 'warn',
    'require-unicode-regexp': 'error',
    'rest-spread-spacing': 'error',
    'semi': 'error',
    'semi-spacing': 'error',
    'semi-style': 'error',
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'sort-vars': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never', asyncArrow: 'always' },
    ],
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    'strict': 'error',
    'switch-colon-spacing': 'error',
    'symbol-description': 'error',
    'template-curly-spacing': 'error',
    'template-tag-spacing': 'error',
    'unicode-bom': 'error',
    'vars-on-top': 'error',
    'wrap-iife': 'error',
    'wrap-regex': 'error',
    'yield-star-spacing': 'error',
    'yoda': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'warn',
      {
        multiline: {
          delimiter: 'semi',

          requireLast: true,
        },

        singleline: {
          delimiter: 'semi',

          requireLast: true,
        },
      },
    ],
  },
};
