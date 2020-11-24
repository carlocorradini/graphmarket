import envalid, { str, host, port, bool } from 'envalid';

/**
 * Environment variables sanitized and immutable.
 */
const env = envalid.cleanEnv(
  process.env,
  {
    NODE_ENV: str({
      default: 'production',
      devDefault: 'development',
      choices: ['production', 'development', 'test'],
    }),
    PORT: port({
      default: 80,
      devDefault: 8000,
    }),
    // Database
    DATABASE_USER: str({
      devDefault: 'postgres',
    }),
    DATABASE_PASSWORD: str({
      devDefault: 'password',
    }),
    DATABASE_HOST: host({
      devDefault: 'localhost',
    }),
    DATABASE_PORT: port({
      devDefault: 5000,
    }),
    DATABASE_NAME: str({
      devDefault: 'graphqldb',
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
      devDefault: true,
    }),
    // Redis
    REDIS_PASSWORD: str({
      devDefault: 'password',
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
    JWT_SECRET: str(),
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
