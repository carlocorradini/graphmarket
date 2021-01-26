import type { Config } from '@jest/types';
import commonConfig from '../../jest.config.common';
import jsonPackage from './package.json';

export default {
  ...commonConfig,
  name: jsonPackage.name,
  displayName: jsonPackage.name,
} as Config.InitialOptions;
