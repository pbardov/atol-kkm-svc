import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import xoTs from 'eslint-config-xo-typescript';

// берём из xo только конфиги, у которых files нацелены на ts/tsx
const tsOnly = xoTs.filter(
	(c) => Array.isArray(c.files) && c.files.some((p) => /\*\.tsx?$/.test(p))
);

export default tseslint.config(
	// игноры общие
	{
		ignores: [
			'dist/',
			'src/migration/*',
			'local_modules/**/*',
		],
	},

	// TS файлы
	{
		files: ['**/*.ts', '**/*.tsx'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			...tsOnly, // только TS-часть из xo-typescript
		],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				// новый способ у typescript-eslint v8 — не требовать прямого пути к tsconfig
				projectService: true,
				tsconfigRootDir: new URL('.', import.meta.url),
			},
		},
		rules: {
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ fixStyle: 'inline-type-imports' },
			],
			'@typescript-eslint/no-restricted-types': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/naming-convention': 'off',
			'no-negated-condition': 'off',
			'new-cap': 'off',
			'no-await-in-loop': 'off',
			'capitalized-comments': 'off',
		},
	},
);
