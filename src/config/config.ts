import { IConfig } from '@app/types';
import logger from '@app/logger';
import env from './env';

/**
 * Configuration object.
 *
 * @see env
 */
const config: IConfig = {
  NODE: {
    ENV: env.NODE_ENV,
    PORT: env.PORT,
  },
  DATABASE: {
    TYPE: 'postgres',
    USER: env.DATABASE_USER,
    PASSWORD: env.DATABASE_PASSWORD,
    HOST: env.DATABASE_HOST,
    PORT: env.DATABASE_PORT,
    NAME: env.DATABASE_NAME,
    URL: `postgres://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`,
    SSL: env.DATABASE_SSL,
    SYNCHRONIZE: env.DATABASE_SYNCHRONIZE,
    LOGGING: env.DATABASE_LOGGING,
    ENTITIES: 'entities/**/*.{ts,js}',
    MIGRATIONS: 'migration/**/*.{ts,js}',
    SUBSCRIBERS: 'subscriber/**/*.{ts,js}',
  },
  REDIS: {
    PASSWORD: env.REDIS_PASSWORD,
    HOST: env.REDIS_HOST,
    PORT: env.REDIS_PORT,
    URL: `redis://:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}/0`,
    JWT_BLOCKLIST: env.REDIS_JWT_BLOCKLIST,
  },
  JWT: {
    SECRET: env.JWT_SECRET,
    ALGORITHM: env.JWT_ALGORITHM,
    EXPIRATION_TIME: env.JWT_EXPIRATION_TIME,
  },
  GRAPHQL: {
    PATH: env.GRAPHQL_PATH,
    PLAYGROUND: env.GRAPHQL_PLAYGROUND,
    RESOLVERS: 'graphql/resolvers/**/*.{ts,js}',
  },
};

logger.debug('Configuration object constructed');

export default config;
