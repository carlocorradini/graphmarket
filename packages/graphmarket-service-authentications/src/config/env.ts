import envalid, { str, port, url, num, bool } from 'envalid';
import convert from 'convert-units';
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
      PORT: port({ devDefault: 8081 }),
      GRAPHQL_PATH: str({ default: '/graphql' }),
      TOKEN_SECRET: str({ devDefault: 'password' }),
      TOKEN_ALGORITHM: str({ default: 'HS256' }),
      TOKEN_EXPIRATION_TIME: num({ default: convert(1).from('week').to('s') }),
      DATABASE_URL: url(),
      DATABASE_SSL: bool({ default: true, devDefault: false }),
      DATABASE_SYNCHRONIZE: bool({ default: false, devDefault: true }),
      DATABASE_DROP_SCHEMA: bool({ default: false, devDefault: false }),
      DATABASE_LOGGING: bool({ default: false }),
      REDIS_URL: url(),
      ADAPTER_PHONE_USERNAME: str(),
      ADAPTER_PHONE_PASSWORD: str(),
      ADAPTER_PHONE_SERVICE_VERIFICATION: str(),
      ADAPTER_EMAIL_API_KEY: str(),
    },
    {
      strict: true,
      dotEnvPath: EnvUtil.getDotEnvPath(),
    },
  ),
);

export default env;
