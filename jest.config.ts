import type { Config } from '@jest/types';
import commonConfig from './jest.config.common';

export default {
  ...commonConfig,
  roots: undefined,
  projects: ['<rootDir>/packages/*/jest.config.ts'],
} as Config.InitialOptions;
