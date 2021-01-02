import _ from 'lodash';
import { CleanEnv } from 'envalid';

const buildEnv = <T>(env: Readonly<T> & CleanEnv) =>
  _.omit(env, 'isDev', 'isDevelopment', 'isProd', 'isProduction', 'isTest');

export default buildEnv;
