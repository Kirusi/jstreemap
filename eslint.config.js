/**
 * @file ESLint config with very aggressive rules.
 */
const jsImport = require('eslint-plugin-import');
const jsDoc = require('eslint-plugin-jsdoc');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const tseslint = require('typescript-eslint');

const allFiles = {
  files: [
    './*.ts',
    './*.js',
    './src/*.ts',
    './src/*.js',
    './tests/**/*.ts',
    './tests/**/*.js',
  ],
  ignores: ['dist/**', 'node_modules/**'],
};

const srcFiles = {
  files: ['./src/**/*.ts', './src/**/*.js', './src/*.ts', './src/*.js'],
  ignores: ['dist/**', 'node_modules/**'],
};

const localJsRules = {
  ...allFiles,
  rules: {
    // Options that are listed along with recommended ones, but not enabled by default.
    ...{
      'array-callback-return': 'error',
      'constructor-super': 'error',
      'for-direction': 'error',
      'getter-return': 'error',
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-const-assign': 'error',
      'no-constant-binary-expression': 'error',
      'no-constant-condition': 'error',
      'no-constructor-return': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-else-if': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': ['error', { includeExports: true }],
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-ex-assign': 'error',
      'no-fallthrough': 'error',
      'no-func-assign': 'error',
      'no-import-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-loss-of-precision': 'error',
      'no-misleading-character-class': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-obj-calls': 'error',
      'no-promise-executor-return': 'error',
      'no-prototype-builtins': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-setter-return': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-this-before-super': 'error',
      'no-unexpected-multiline': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-unused-private-class-members': 'error',
      'no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          //"ignoreClassWithStaticInitBlock": false,
          ignoreRestSiblings: false,
          //"reportUsedIgnorePattern": false
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
      'no-use-before-define': 'error',
      'no-useless-assignment': 'error',
      'no-useless-backreference': 'error',
      'require-atomic-updates': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
    },

    // Suggested rules
    ...{
      'accessor-pairs': 'error',
      'arrow-body-style': ['error', 'always'],
      'block-scoped-var': 'error',
      camelcase: 'error',
      /* "capitalized-comments": [
        "error",
        "always",
        {
          "ignorePattern": "pragma|ignored",
          "ignoreInlineComments": true
        }
      ], */
      // 'class-methods-use-this': 'error',
      complexity: ['error', 20],
      // 'consistent-return': 'error',
      'consistent-this': ['error', 'that'],
      curly: 'error',
      'default-case': 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'dot-notation': 'error',
      eqeqeq: 'error',
      'func-name-matching': 'error',
      'func-names': ['error', 'always'],
      'func-style': ['error', 'declaration'],
      'grouped-accessor-pairs': 'error',
      'guard-for-in': 'error',
      // 'init-declarations': ['error', 'always'],
      'logical-assignment-operators': ['error', 'always'],
      // 'max-classes-per-file': ['error', 1],
      // 'max-depth': ["error", 4],
      // 'max-lines': ["error", 500],
      // 'max-lines-per-function': ["error", 500]
      // 'max-nested-callbacks': ["error", 1],
      // 'max-params': ["error", 10],
      // 'max-statements': ["error", 500],
      'new-cap': 'error',
      'no-alert': 'error',
      'no-array-constructor': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-console': 'error',
      // 'no-continue': 'error',
      'no-delete-var': 'error',
      'no-div-regex': 'error',
      'no-else-return': 'error',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-empty-static-block': 'error',
      'no-eq-null': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-label': 'error',
      'no-global-assign': 'error',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      // 'no-inline-comments': 'error',
      'no-invalid-this': 'error',
      'no-iterator': 'error',
      'no-label-var': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-loop-func': 'error',
      // 'no-magic-numbers': 'error',
      // 'no-multi-assign': 'error',
      // 'no-multi-str': 'error',
      'no-negated-condition': 'error',
      'no-nested-ternary': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-nonoctal-decimal-escape': 'error',
      'no-object-constructor': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      // 'no-plusplus': 'error',
      'no-proto': 'error',
      'no-redeclare': 'error',
      'no-regex-spaces': 'error',
      'no-return-assign': ['error', 'always'],
      'no-script-url': 'error',
      'no-sequences': 'error',
      'no-shadow': 'error',
      'no-shadow-restricted-names': 'error',
      // 'no-ternary': 'error',
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      // 'no-undefined': 'error',
      // 'no-underscore-dangle': 'error',
      'no-unneeded-ternary': 'error',
      'no-unused-expressions': 'error',
      'no-unused-labels': 'error',
      'no-useless-call': 'error',
      'no-useless-catch': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-constructor': 'error',
      'no-useless-escape': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-void': 'error',
      // 'no-warning-comments': 'error',
      // 'no-with': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'operator-assignment': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      /*'prefer-destructuring': ['error', {
        'array': true,
        'object': true
      }],*/
      'prefer-exponentiation-operator': 'error',
      'prefer-named-capture-group': 'error',
      'prefer-numeric-literals': 'error',
      'prefer-object-has-own': 'error',
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      radix: ['error', 'always'],
      'require-await': 'error',
      'require-unicode-regexp': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
      //'sort-keys': 'error',
      'sort-vars': 'error',
      strict: ['error', 'global'],
      'symbol-description': 'error',
      // 'vars-on-top': 'error',
      yoda: ['error', 'never', { exceptRange: true, onlyEquality: true }],

      // Layout & Formatting
      'unicode-bom': 'error',
    },
  },
};

// eslint-disable-next-line no-unused-vars
const localTsRules = {
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['eslint.config.js', 'vite.config.ts'],
      },
      //FIXME: VK uncomennt the next line when TS is enabled
      // tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    // '@typescript-eslint/ban-tslint-comment': 'error',
    '@typescript-eslint/class-literal-property-style': 'error',
    // '@typescript-eslint/class-methods-use-this': 'error',
    '@typescript-eslint/consistent-generic-constructors': [
      'error',
      'type-annotation',
    ],
    '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
    // '@typescript-eslint/consistent-return': 'error',
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/consistent-type-exports': [
      'error',
      { fixMixedExportsWithInlineTypeSpecifier: true },
    ],
    /* '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: true,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ], */
    '@typescript-eslint/default-param-last': 'error',
    '@typescript-eslint/dot-notation': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    // '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/explicit-module-boundary-types': [
      'error',
      {
        allowArgumentsExplicitlyTypedAsAny: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowedNames: [],
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    // '@typescript-eslint/init-declarations': 'error',
    // '@typescript-eslint/max-params': ['error', { max: 5 }],
    // "@typescript-eslint/member-ordering": "error",
    '@typescript-eslint/method-signature-style': ['error', 'method'],
    // '@typescript-eslint/naming-convention': 'error'
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-array-delete': 'error',
    '@typescript-eslint/no-base-to-string': 'error',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    // '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/no-deprecated': 'error',
    '@typescript-eslint/no-dupe-class-members': 'error',
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-duplicate-type-constituents': 'error',
    '@typescript-eslint/no-dynamic-delete': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    '@typescript-eslint/no-empty-object-type': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    // '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    // '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-invalid-this': 'error',
    '@typescript-eslint/no-invalid-void-type': 'error',
    '@typescript-eslint/no-loop-func': 'error',
    '@typescript-eslint/no-loss-of-precision': 'error',
    // '@typescript-eslint/no-magic-numbers': 'error',
    '@typescript-eslint/no-meaningless-void-operator': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-mixed-enums': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    //'@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/no-redundant-type-constituents': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    /*
    '@typescript-eslint/no-unnecessary-condition': [
      'error',
      {
        allowConstantLoopConditions: true,
        allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: false,
        checkTypePredicates: false,
      },
    ],
    */
    '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-template-expression': 'error',
    '@typescript-eslint/no-unnecessary-type-arguments': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unnecessary-type-parameters': 'error',
    // '@typescript-eslint/no-unsafe-argument': 'error',
    // '@typescript-eslint/no-unsafe-assignment': 'error',
    // '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-declaration-merging': 'error',
    '@typescript-eslint/no-unsafe-enum-comparison': 'error',
    '@typescript-eslint/no-unsafe-function-type': 'error',
    // '@typescript-eslint/no-unsafe-member-access': 'error',
    // '@typescript-eslint/no-unsafe-return': 'error',
    // '@typescript-eslint/no-unsafe-type-assertion': 'error',
    '@typescript-eslint/no-unsafe-unary-minus': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        //"ignoreClassWithStaticInitBlock": false,
        ignoreRestSiblings: false,
        //"reportUsedIgnorePattern": false
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-useless-empty-export': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-wrapper-object-types': 'error',
    '@typescript-eslint/non-nullable-type-assertion-style': 'error',
    '@typescript-eslint/only-throw-error': 'error',
    '@typescript-eslint/parameter-properties': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    // '@typescript-eslint/prefer-destructuring': 'error',
    '@typescript-eslint/prefer-enum-initializers': 'error',
    '@typescript-eslint/prefer-find': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    // '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-literal-enum-member': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-promise-reject-errors': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    // '@typescript-eslint/prefer-readonly-parameter-types': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-regexp-exec': 'error',
    '@typescript-eslint/prefer-return-this-type': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/related-getter-setter-pairs': 'error',
    // '@typescript-eslint/require-array-sort-compare': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/return-await': 'error',
    '@typescript-eslint/sort-type-constituents': 'error',
    // '@typescript-eslint/strict-boolean-expressions': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/typedef': 'error',
  },
};

const localPrettierRules = {
  rules: {
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'always',
        bracketSameLine: false,
        bracketSpacing: true,
        jsxSingleQuote: false,
        parser: 'typescript',
        printWidth: 80,
        quoteProps: 'as-needed',
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
      },
      {
        usePrettierrc: false,
      },
    ],
  },
};

const localJsDocRules = {
  ...srcFiles,
  plugins: {
    jsdoc: jsDoc,
  },
  settings: {
    jsdoc: {
      // mode: 'closure',
      ignorePrivate: true, // Disables linting for private blocks
    },
  },
  rules: {
    'jsdoc/check-access': 'error', // Recommended
    'jsdoc/check-alignment': 'error', // Recommended
    // 'jsdoc/check-examples': 'error',
    'jsdoc/check-indentation': ['error', { allowIndentedSections: true }],
    'jsdoc/check-line-alignment': 'error',
    'jsdoc/check-param-names': 'error', // Recommended
    'jsdoc/check-template-names': 'error',
    'jsdoc/check-property-names': 'error', // Recommended
    'jsdoc/check-syntax': 'error',
    'jsdoc/check-tag-names': 'error', // Recommended
    'jsdoc/check-types': 'error', // Recommended
    'jsdoc/check-values': 'error', // Recommended
    // 'jsdoc/empty-tags': 'error',
    'jsdoc/implements-on-classes': 'error', // Recommended
    'jsdoc/informative-docs': 'error',
    // 'jsdoc/match-description': 'error',
    'jsdoc/multiline-blocks': 'error', // Recommended
    'jsdoc/no-bad-blocks': 'error',
    'jsdoc/no-blank-block-descriptions': 'error',
    'jsdoc/no-defaults': 'error',
    // 'jsdoc/no-missing-syntax': 'error',
    'jsdoc/no-multi-asterisks': 'error', // Recommended
    // 'jsdoc/no-restricted-syntax': 'error',
    //'jsdoc/no-types': 'error',
    'jsdoc/no-undefined-types': [
      'error',
      {
        definedTypes: [
          'InsertionResult',
          'JsIterator',
          'JsReverseIterator',
          'ReverseIterator',
          'TreeNode',
        ],
      },
    ], // Recommended
    'jsdoc/require-asterisk-prefix': 'error',
    'jsdoc/require-description': 'error',
    // 'jsdoc/require-description-complete-sentence': 'error',
    // 'jsdoc/require-example': 'error',
    // 'jsdoc/require-file-overview': 'error',
    'jsdoc/require-hyphen-before-param-description': 'error',
    'jsdoc/require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
      },
    ],
    'jsdoc/require-param': 'error', // Recommended
    'jsdoc/require-param-description': 'error', // Recommended
    'jsdoc/require-param-name': 'error', // Recommended
    'jsdoc/require-param-type': 'error', // Recommended
    'jsdoc/require-property': 'error', // Recommended
    'jsdoc/require-property-description': 'error', // Recommended
    'jsdoc/require-property-name': 'error', // Recommended
    'jsdoc/require-property-type': 'error', // Recommended
    'jsdoc/require-returns': 'error', // Recommended
    'jsdoc/require-returns-check': 'error', // Recommended
    'jsdoc/require-returns-description': 'error', // Recommended
    'jsdoc/require-returns-type': 'error', // Recommended
    'jsdoc/require-template': 'error',
    // 'jsdoc/require-throws': 'error',
    'jsdoc/require-yields': 'error', // Recommended
    'jsdoc/require-yields-check': 'error', // Recommended
    'jsdoc/sort-tags': 'error',
    'jsdoc/tag-lines': 'error', // Recommended
    'jsdoc/valid-types': 'error', // Recommended
  },
};

const localImportRules = {
  ...allFiles,
  plugins: {
    // eslint-disable-next-line prettier/prettier
    'import': jsImport,
  },
  rules: {
    // turn on errors for missing imports
    'import/no-unresolved': 'error',
    // 'import/no-named-as-default-member': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Built-in imports (come from NodeJS native) go first
          'external', // <- External imports
          'internal', // <- Absolute imports
          ['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
          'index', // <- index imports
          'unknown', // <- unknown
        ],
        'newlines-between': 'always',
        alphabetize: {
          /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
          order: 'asc',
          /* ignore case. Options: [true, false] */
          caseInsensitive: true,
        },
      },
    ],
  },
};

// export default
module.exports = tseslint.config(
  // jsImport.flatConfigs.typescript,
  localImportRules,
  localJsRules,
  // tseslint.configs.recommended,
  // localTsRules,
  eslintPluginPrettierRecommended,
  localPrettierRules,
  localJsDocRules
);
