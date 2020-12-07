import path from 'path';
import envalid, { bool, url } from 'envalid';
import _ from 'lodash';

const env = envalid.cleanEnv(
  process.env,
  {
    DATABASE_URL: url(),
    REDIS_URL: url(),
    DATABASE_SYNCHRONIZE: bool({ default: true }),
    DATABASE_DROP_SCHEMA: bool({ default: true }),
  },
  {
    dotEnvPath: path.resolve(process.cwd(), '.env.test'),
    strict: true,
  },
);

// @ts-ignore
process.env = {
  ...process.env,
  ..._.omit({ ...env }, 'isDev', 'isDevelopment', 'isProd', 'isProduction', 'isTest'),
};

export default env;
