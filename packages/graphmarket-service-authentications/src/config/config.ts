import logger from '@graphmarket/logger';
import { IConfigAuthenticationsService } from '@app/interfaces';
import env from './env';

/**
 * Configuration object.
 *
 * @see env
 */
const config: IConfigAuthenticationsService = {
  NODE: {
    ENV: env.NODE_ENV,
    PORT: env.PORT,
  },
  GRAPHQL: {
    PATH: env.GRAPHQL_PATH,
    PLAYGROUND: false,
  },
  TOKEN: {
    SECRET: env.TOKEN_SECRET,
    ALGORITHM: env.TOKEN_ALGORITHM,
    EXPIRATION_TIME: env.TOKEN_EXPIRATION_TIME,
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
    PHONE: {
      USERNAME: env.ADAPTER_PHONE_USERNAME,
      PASSWORD: env.ADAPTER_PHONE_PASSWORD,
      SERVICES: {
        VERIFICATION: env.ADAPTER_PHONE_SERVICE_VERIFICATION,
      },
    },
    EMAIL: {
      API_KEY: env.ADAPTER_EMAIL_API_KEY,
    },
  },
};

logger.debug('Configuration object constructed');

export default config;
