import type { Config } from '@jest/types';
import commonConfig from './jest.config.common';

export default {
  ...commonConfig,
  projects: ['<rootDir>/packages/*/jest.config.ts'],
  // coverageDirectory: '<rootDir>/coverage/',
} as Config.InitialOptions;
