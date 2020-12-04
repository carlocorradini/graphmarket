import path from 'path';
import envalid, { url } from 'envalid';

export interface ITestEnv {
  DATABASE_URL: string;
  REDIS_URL: string;
}

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

export default env;
