import xo from 'eslint-config-xo-typescript';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
	files: ['**/*.ts'],
	extends: [
		eslint.configs.recommended,
		...xo
	],
	rules: {
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{
				'fixStyle': 'inline-type-imports'
			}
		],
		'no-negated-condition': 'off',
		'new-cap': 'off',
		'no-await-in-loop': 'off',
		'capitalized-comments': 'off',
	}
})
