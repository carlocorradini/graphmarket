import logger from '@graphmarket/logger';
import { IConfigPurchasesService } from '@app/interfaces';
import env from './env';

/**
 * Configuration object.
 *
 * @see env
 */
const config: IConfigPurchasesService = {
  NODE: {
    ENV: env.NODE_ENV,
    PORT: env.PORT,
  },
  GRAPHQL: {
    PATH: env.GRAPHQL_PATH,
    PLAYGROUND: false,
  },
  DATABASE: {
    TYPE: 'postgres',
    URL: env.DATABASE_URL,
    SSL: env.DATABASE_SSL,
    SYNCHRONIZE: env.DATABASE_SYNCHRONIZE,
    DROP_SCHEMA: env.DATABASE_DROP_SCHEMA,
    LOGGING: env.DATABASE_LOGGING,
  },
  REDIS: {
    URL: env.REDIS_URL,
  },
  ADAPTERS: {
    EMAIL: {
      API_KEY: env.ADAPTER_EMAIL_API_KEY,
    },
  },
};

logger.debug('Configuration object constructed');

export default config;
