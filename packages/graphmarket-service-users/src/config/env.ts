import envalid, { str, port, bool, url, num } from 'envalid';
import _ from 'lodash';
import convert from 'convert-units';
import { EnvUtil } from '@graphmarket/utils';

/**
 * Path to the file that is parsed by dotenv.
 * Null skip dotenv processing entirely and only load from process.env.
 * '.env' load .env file used in development environment.
 * '.env.test' load .env.test file used in test environment.
 */
let dotEnvPath: string | undefined | null = null;
if (EnvUtil.isProduction()) dotEnvPath = null;
else if (EnvUtil.isDevelopment()) dotEnvPath = '.env';
else if (EnvUtil.isTest()) dotEnvPath = '.env.test';

/**
 * Environment variables sanitized and immutable.
 */
const env = _.omit(
  {
    ...envalid.cleanEnv(
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
        ADAPTER_UPLOAD_CLOUD_NAME: str(),
        ADAPTER_UPLOAD_API_KEY: str(),
        ADAPTER_UPLOAD_API_SECRET: str(),
        ADAPTER_UPLOAD_FOLDER: str({ default: 'graphmarket/' }),
        ADAPTER_UPLOAD_MAX_FILE_SIZE: num({ default: convert(4).from('MB').to('B') }),
        ADAPTER_UPLOAD_MAX_FILES: num({ default: 8 }),
      },
      {
        strict: true,
        dotEnvPath,
      },
    ),
  },
  'isDev',
  'isDevelopment',
  'isProd',
  'isProduction',
  'isTest',
);

export default env;
