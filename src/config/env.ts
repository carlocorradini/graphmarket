import envalid, { str, host, port, bool } from 'envalid';

/**
 * Environment variables sanitized and immutable.
 */
const env = envalid.cleanEnv(
  process.env,
  {
    NODE_ENV: str({ default: 'production', choices: ['production', 'development', 'test'] }),
    PORT: port({ devDefault: 8080 }),
    // Database
    DATABASE_USER: str(),
    DATABASE_PASSWORD: str(),
    DATABASE_HOST: host(),
    DATABASE_PORT: port(),
    DATABASE_NAME: str(),
    DATABASE_SSL: bool({ default: true, devDefault: false }),
    DATABASE_SYNCHRONIZE: bool({ default: false, devDefault: true }),
    DATABASE_LOGGING: bool({ default: false }),
    // Redis
    REDIS_PASSWORD: str(),
    REDIS_HOST: host(),
    REDIS_PORT: port(),
    REDIS_JWT_BLOCKLIST: str({ default: 'JWT_BLOCKLIST' }),
    JWT_SECRET: str(),
    JWT_ALGORITHM: str({ default: 'HS256' }),
    JWT_EXPIRATION_TIME: str({ default: '7d' }),
    GRAPHQL_PATH: str({ default: '/graphql' }),
    GRAPHQL_PLAYGROUND: bool({ default: false, devDefault: true }),
  },
  {
    strict: true,
  },
);

export default env;
