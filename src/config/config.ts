import { IConfig } from '@app/typings';
import logger from '@app/logger';
import env from './env';

const config: IConfig = {
  NODE: {
    ENV: env.NODE_ENV,
    PORT: env.PORT,
  },
  DATABASE: {
    TYPE: 'postgres',
    URL: env.DATABASE_URL,
    SSL: env.DATABASE_SSL,
    SYNCHRONIZE: env.DATABASE_SYNCHRONIZE,
    LOGGING: env.DATABASE_LOGGING,
    ENTITIES: 'entities/**/*.{ts,js}',
    MIGRATIONS: 'migration/**/*.{ts,js}',
    SUBSCRIBERS: 'subscriber/**/*.{ts,js}',
  },
  JWT: {
    SECRET: env.JWT_SECRET,
    EXPIRATION_TIME: env.JWT_EXPIRATION_TIME,
  },
  GRAPHQL: {
    PLAYGROUND: env.GRAPHQL_PLAYGROUND,
    RESOLVERS: 'graphql/resolvers/**/*.{ts,js}',
  },
};

logger.debug('Configuration object constructed');

export default config;
