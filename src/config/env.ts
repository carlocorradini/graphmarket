import envalid, { str, host, port, bool, url } from 'envalid';

/**
 * Environment variables sanitized and immutable.
 */
const env = envalid.cleanEnv(
  process.env,
  {
    NODE_ENV: str({
      default: 'production',
      choices: ['production', 'development', 'test'],
    }),
    PORT: port({
      default: 80,
      devDefault: 8080,
    }),
    // Database
    DATABASE_URL: url({
      devDefault: 'postgres://postgres:@localhost:5432/graphqldb',
    }),
    DATABASE_SSL: bool({
      default: true,
      devDefault: false,
    }),
    DATABASE_SYNCHRONIZE: bool({
      default: false,
      devDefault: true,
    }),
    DATABASE_LOGGING: bool({
      default: false,
    }),
    // Redis
    REDIS_URL: url({
      devDefault: 'redis://localhost:6379/0',
    }),
    REDIS_PASSWORD: str({
      devDefault: '',
    }),
    REDIS_HOST: host({
      devDefault: 'localhost',
    }),
    REDIS_PORT: port({
      devDefault: 6379,
    }),
    REDIS_JWT_BLOCKLIST: str({
      default: 'JWT_BLOCKLIST',
    }),
    JWT_SECRET: str({
      devDefault: 'secret',
    }),
    JWT_ALGORITHM: str({
      default: 'HS256',
    }),
    JWT_EXPIRATION_TIME: str({
      default: '7d',
    }),
    GRAPHQL_PATH: str({
      default: '/graphql',
    }),
    GRAPHQL_PLAYGROUND: bool({
      default: false,
      devDefault: true,
    }),
  },
  {
    strict: true,
  },
);

export default env;
