import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
	{ files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'] },
	{ files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: globals.node } },
	{
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'warn',
			'quotes': [
				'error',
				'single'
			],
			'semi': [
				'error',
				'never'
			]
		},
	},
	{
		ignores: [
			'.build/',
			'.sst/',
			'node_modules/',
		]
	},
	tseslint.configs.recommended,
])
