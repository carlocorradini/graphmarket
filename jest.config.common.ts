import type { Config } from '@jest/types';

export default {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 10000,
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.ts'],
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/$1',
    '@test/(.*)': '<rootDir>/$1',
  },
  testMatch: ['**/?(*.)+(spec|test).+(ts|js)'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
} as Config.InitialOptions;
