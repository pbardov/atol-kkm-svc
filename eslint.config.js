import xo from 'eslint-config-xo-typescript';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

// Извлекаем все правила из xo
const xoRules = xo.reduce((rules, config) => {
	return { ...rules, ...(config.rules || {}) };
}, {});

export default tseslint.config({
	files: ['**/*.ts'],
	extends: [
		eslint.configs.recommended,
		// Не используем ...xo напрямую
	],
	// Добавляем правила из xo вручную
	rules: {
		...xoRules,
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{
				'fixStyle': 'inline-type-imports'
			}
		],
		'@typescript-eslint/no-restricted-types': 'off',
		'no-negated-condition': 'off',
		'new-cap': 'off',
		'no-await-in-loop': 'off',
		'capitalized-comments': 'off',
	},
	// Копируем другие важные настройки из xo (кроме languageOptions.allowTrailingCommas)
	// Здесь вам может потребоваться добавить другие важные настройки из xo
	ignores: [
		'dist/',
		'src/migration/*',
		'local_modules/**/*',
	]
})
