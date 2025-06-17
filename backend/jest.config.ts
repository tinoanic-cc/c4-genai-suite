import { Config } from 'jest';

const config: Config = {
  maxWorkers: 1,
  projects: [
    {
      displayName: 'Unit Tests',
      testRegex: '.*\\.spec\\.ts$',
      testPathIgnorePatterns: ['.*\\e2e.spec\\.ts$'],
      coveragePathIgnorePatterns: ['/generated/'],
      collectCoverageFrom: ['**/*.(t|j)s'],
      coverageDirectory: '../coverage',
      testEnvironment: 'node',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/$1',
      },
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: 'src',
    },
    {
      displayName: 'E2E Tests',
      testRegex: '.*\\.e2e.spec\\.ts$',
      collectCoverageFrom: ['**/*.(t|j)s'],
      coveragePathIgnorePatterns: ['/generated/', '/migrations/'],
      coverageDirectory: '../coverage',
      testEnvironment: 'node',
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      moduleNameMapper: {
        '^../extensions/(.*).js$': '<rootDir>/extensions/$1.ts',
        '^src/(.*)$': '<rootDir>/$1',
      },
      moduleFileExtensions: ['js', 'json', 'ts'],
      globalSetup: '../jest.setup.e2e.ts',
      globalTeardown: '../jest.teardown.e2e.ts',
      rootDir: 'src',
    },
  ],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
};

export default config;
