import envalid, { str, port, bool, url } from 'envalid';

const env = envalid.cleanEnv(
  process.env,
  {
    NODE_ENV: str({ default: 'production', choices: ['production', 'development', 'test'] }),
    PORT: port({ devDefault: 8080 }),
    DATABASE_URL: url(),
    DATABASE_SSL: bool({ default: true, devDefault: false }),
    DATABASE_SYNCHRONIZE: bool({ default: false, devDefault: true }),
    DATABASE_LOGGING: bool({ default: false }),
    JWT_SECRET: str(),
    JWT_EXPIRATION_TIME: str(),
    GRAPHQL_PLAYGROUND: bool({ default: false, devDefault: true }),
  },
  {
    strict: true,
  },
);

export default env;
