import envalid, { str, port, bool, url, num } from 'envalid';
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
      PORT: port({ devDefault: 8082 }),
      GRAPHQL_PATH: str({ default: '/graphql' }),
      TOKEN_SECRET: str({ devDefault: 'password' }),
      TOKEN_ALGORITHM: str({ default: 'HS256' }),
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
      ADAPTER_UPLOAD_CLOUD_NAME: str(),
      ADAPTER_UPLOAD_API_KEY: str(),
      ADAPTER_UPLOAD_API_SECRET: str(),
      ADAPTER_UPLOAD_FOLDER: str({ default: 'graphmarket/' }),
      ADAPTER_UPLOAD_MAX_FILE_SIZE: num({ default: convert(4).from('MB').to('B') }),
      ADAPTER_UPLOAD_MAX_FILES: num({ default: 8 }),
    },
    {
      strict: true,
      dotEnvPath: EnvUtil.getDotEnvPath(),
    },
  ),
);

export default env;
