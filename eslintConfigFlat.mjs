import antfu from '@antfu/eslint-config'
import stylistic from '@stylistic/eslint-plugin'
import eslintPluginQuery from '@tanstack/eslint-plugin-query'
import format from 'eslint-plugin-format'
import eslintPluginSonarjs from 'eslint-plugin-sonarjs'

function getPrettierDefaults() {
  return {
    embeddedLanguageFormatting: 'auto',
    printWidth: 100,
    singleQuote: true,
    semi: false,
    htmlWhitespaceSensitivity: 'ignore',
    endOfLine: 'auto',
  }
}

function getPrettierConfig() {
  const extensions = ['less', 'scss', 'sass', 'css', 'html', 'md', 'js', 'mjs', 'ts', 'jsx', 'tsx']
  return [
    { name: 'prettier:setup', plugins: { format } },
    ...extensions.map((ext) => ({
      files: [`**/*.${ext}`],
      name: `prettier:${ext}`,
      languageOptions: ['ts', 'js', 'mjs', 'md', 'jsx', 'tsx'].includes(ext)
        ? {}
        : { parser: format.parserPlain },
      rules: {
        'format/prettier': ['warn', getPrettierDefaults()],
      },
    })),
  ]
}

export default function getConfig(...additionalConfigs) {
  return antfu(
    {
      react: true,
      stylistic: false,
      formatters: { prettierOptions: getPrettierDefaults() },
    },
    ...getPrettierConfig(),
    eslintPluginSonarjs.configs.recommended,
    ...eslintPluginQuery.configs['flat/recommended'],
    {
      name: 'default',
      plugins: {
        style: stylistic,
      },
      rules: {
        'unicorn/number-literal-case': ['off'],
        'react/prefer-destructuring-assignment': ['off'],
        'import/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
        'node/prefer-global/process': ['off'],
        'unicorn/no-array-for-each': ['error'],
        'object-shorthand': ['warn', 'always', { avoidQuotes: false }],
        'sonarjs/no-duplicate-string': ['off'], // too many positives with tailwind classes
        'style/jsx-curly-brace-presence': [
          'warn',
          { props: 'always', children: 'always', propElementValues: 'always' },
        ],
        'style/jsx-self-closing-comp': ['warn'],
        'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
        'react-refresh/only-export-components': ['off'],
        'unused-imports/no-unused-vars': [
          'warn',
          {
            args: 'none',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        'import/order': [
          'warn',
          {
            'newlines-between': 'always',
            alphabetize: { order: 'asc' },
            groups: ['type', ['builtin', 'external'], 'parent', 'sibling'],
            distinctGroup: false,
            pathGroupsExcludedImportTypes: ['builtin', 'type'],
            pathGroups: [
              {
                pattern: '@/**',
                group: 'parent',
                position: 'before',
              },
              {
                pattern: '@@/**',
                group: 'parent',
                position: 'before',
              },
            ],
          },
        ],
        'react/no-useless-fragment': ['off'],
      },
    },
    ...additionalConfigs,
  )
}
