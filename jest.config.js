module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    ROOT_MODULE_NAME: ''
  },
  setupFiles: ['<rootDir>/test/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup-after-env.ts'],
  testPathIgnorePatterns: ['<rootDir>/test/smoke/'],
  verbose: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
  coverageReporters: ['text', 'text-summary', 'html']
};
