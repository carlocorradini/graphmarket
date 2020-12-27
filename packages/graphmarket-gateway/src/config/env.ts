import envalid, { str, port, url } from 'envalid';
import _ from 'lodash';
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
        PORT: port({ devDefault: 8080 }),
        GRAPHQL_PATH: str({ default: '/graphql' }),
        REDIS_URL: url(),
        REDIS_TOKEN_BLACKLIST: str({ default: 'TOKEN_BLACKLIST' }),
        TOKEN_SECRET: str({ devDefault: 'password' }),
        TOKEN_ALGORITHM: str({ default: 'HS256' }),
        SERVICES_USERS_URL: url({ devDefault: 'http://localhost:8081/graphql' }),
        SERVICES_PRODUCTS_URL: url({ devDefault: 'http://localhost:8082/graphql' }),
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
