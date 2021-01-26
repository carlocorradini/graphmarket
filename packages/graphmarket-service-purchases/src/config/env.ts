import envalid, { str, port, bool, url } from 'envalid';
import { buildEnv } from '@graphmarket/helpers';
import { EnvUtil } from '@graphmarket/utils';

/**
 * Environment variables sanitized and immutable.
 */
const env = buildEnv(
  envalid.cleanEnv(
    process.env,
    {
      NODE_ENV: str({
        default: 'production',
        devDefault: 'development',
        choices: ['production', 'development', 'test'],
      }),
      PORT: port({ devDefault: 8085 }),
      GRAPHQL_PATH: str({ default: '/graphql' }),
      DATABASE_URL: url(),
      DATABASE_SSL: bool({ default: true, devDefault: false }),
      DATABASE_SYNCHRONIZE: bool({ default: false, devDefault: true }),
      DATABASE_DROP_SCHEMA: bool({ default: false, devDefault: false }),
      DATABASE_LOGGING: bool({ default: false }),
      REDIS_URL: url(),
    },
    {
      strict: true,
      dotEnvPath: EnvUtil.getDotEnvPath(),
    },
  ),
);

export default env;
