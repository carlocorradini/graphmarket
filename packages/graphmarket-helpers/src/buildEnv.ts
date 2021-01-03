import _ from 'lodash';
import { CleanEnv } from 'envalid';

/**
 * Build the environment object removing unnecessary variables.
 *
 * @param env - Builded environment object
 * @returns Environment object
 */
const buildEnv = <T>(env: Readonly<T> & CleanEnv) =>
  _.omit({ ...env }, 'isDev', 'isDevelopment', 'isProd', 'isProduction', 'isTest');

export default buildEnv;
