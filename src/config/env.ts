import envalid, { str, port, bool, url, num } from 'envalid';
import _ from 'lodash';

/**
 * One week in seconds
 */
const ONE_WEEK_IN_SECONDS: number = 60 * 60 * 24 * 7;

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
        DATABASE_URL: url(),
        DATABASE_SSL: bool({ default: true, devDefault: false }),
        DATABASE_SYNCHRONIZE: bool({ default: false, devDefault: true }),
        DATABASE_DROP_SCHEMA: bool({ default: false, devDefault: true }),
        DATABASE_LOGGING: bool({ default: false }),
        REDIS_URL: url(),
        REDIS_TOKEN_BLOCKLIST: str({ default: 'TOKEN_BLOCKLIST' }),
        TOKEN_SECRET: str({ devDefault: 'password' }),
        TOKEN_ALGORITHM: str({ default: 'HS256' }),
        TOKEN_EXPIRATION_TIME: num({ default: ONE_WEEK_IN_SECONDS }),
        GRAPHQL_PATH: str({ default: '/graphql' }),
        GRAPHQL_PLAYGROUND: bool({ default: false, devDefault: true }),
        SERVICE_PHONE_TWILIO_ACCOUNT_SID: str(),
        SERVICE_PHONE_TWILIO_AUTH_TOKEN: str(),
        SERVICE_PHONE_TWILIO_VERIFICATION_SID: str(),
        SERVICE_PHONE_DEBUG: bool({ default: false }),
      },
      {
        strict: true,
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
