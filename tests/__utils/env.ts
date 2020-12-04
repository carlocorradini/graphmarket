import path from 'path';
import envalid, { str, url } from 'envalid';

const env = envalid.cleanEnv(
  process.env,
  {
    DATABASE_URL: url(),
    REDIS_URL: url(),
    JWT_SECRET: str({ default: 'password' }),
  },
  {
    dotEnvPath: path.resolve(process.cwd(), '.env.test'),
    strict: true,
  },
);

export default env;
