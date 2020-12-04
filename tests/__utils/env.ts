import path from 'path';
import envalid, { url } from 'envalid';
import _ from 'lodash';

const env = envalid.cleanEnv(
  process.env,
  {
    DATABASE_URL: url(),
    REDIS_URL: url(),
  },
  {
    dotEnvPath: path.resolve(process.cwd(), '.env.test'),
    strict: true,
  },
);

process.env = {
  ...process.env,
  ..._.omit({ ...env }, 'isDev', 'isDevelopment', 'isProd', 'isProduction', 'isTest'),
};

export default env;
