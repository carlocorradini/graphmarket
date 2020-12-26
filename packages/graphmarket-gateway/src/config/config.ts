import logger from '@graphmarket/logger';
import { IConfig } from '@app/types';
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
  TOKEN: {
    SECRET: env.TOKEN_SECRET,
    ALGORITHM: env.TOKEN_ALGORITHM,
  },
  GRAPHQL: {
    PATH: env.GRAPHQL_PATH,
    PLAYGROUND: env.GRAPHQL_PLAYGROUND,
    TRACING: env.GRAPHQL_TRACING,
  },
  SERVICES: {
    USERS: {
      NAME: 'users',
      URL: env.SERVICES_USERS_URL,
    },
    PRODUCTS: {
      NAME: 'products',
      URL: env.SERVICES_PRODUCTS_URL,
    },
  },
};

logger.debug('Configuration object constructed');

export default config;
