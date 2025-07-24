// @ts-check
import typescriptParser from '@typescript-eslint/parser'
import vueESLintParser from 'vue-eslint-parser'
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			parser: typescriptParser,
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/no-multiple-template-roots': 'off',
			'vue/no-multiple-template-root': 'off',
			'vue/component-api-style': ['error', ['script-setup', 'composition']],
			'vue/block-lang': [
				'error',
				{
					script: {
						lang: 'ts',
					},
				},
			],
			'vue/component-tags-order': [
				'error',
				{
					order: ['template', 'script', 'style'],
				},
			],
			'no-unused-vars': 'off',
			'no-undef': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@stylistic/operator-linebreak': 'off',
			'@stylistic/brace-style': 'off',
			'@stylistic/arrow-parens': 'off',
			'@stylistic/indent': 'off',
			'@stylistic/no-tabs': 'off',
			'@stylistic/indent-binary-ops': 'off',
		},
	},
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: vueESLintParser,
			parserOptions: {
				parser: typescriptParser,
				sourceType: 'module',
			},
		},
		rules: {
			'vue/singleline-html-element-content-newline': 'off',
			'vue/html-self-closing': 'off',
			'vue/no-multiple-template-roots': 'off',
			'vue/no-multiple-template-root': 'off',
			'vue/html-indent': 'off',
			'vue/operator-linebreak': 'off',
		},
	},
	{
		files: ['**/api/**/*.{get,post,put,patch,delete}.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
	{
		ignores: ['.nuxt/', '.output/', 'node_modules/', 'dist/', '*.md*', '*.json', 'generated', 'pnpm-lock.yaml'],
	},
)
