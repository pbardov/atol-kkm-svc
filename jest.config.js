export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',

    // ВАЖНО: здесь только .ts (без .js)
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],

    testMatch: ['**/*.e2e-spec.ts', '**/*.spec.ts'],

    // Разрешаем трансформировать ESM внутри нужного пакета из node_modules
    transformIgnorePatterns: [
        '/node_modules/(?!(?:@pbardov/node-atol-rpc)/)'
    ],

    // Относительные импорты с .js → без .js, чтобы Jest нашёл .ts до трансформации
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^src/(.*)$': '<rootDir>/src/$1',
        '^test/(.*)$': '<rootDir>/test/$1'
    },

    transform: {
        // TS → ESM через ts-jest
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.test.json',
                useESM: true
            }
        ],
        // JS (в т.ч. ESM из node_modules/@pbardov/node-atol-rpc) → CJS через babel-jest
        '^.+\\.(mjs|js)$': [
            'babel-jest',
            {
                presets: [
                    ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }]
                ]
            }
        ]
    }
};
