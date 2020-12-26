import logger from '@graphmarket/logger';
import IConfigGateway from '../interfaces/IConfigGateway';
import env from './env';

/**
 * Configuration object.
 *
 * @see env
 */
const config: IConfigGateway = {
  NODE: {
    ENV: env.NODE_ENV,
    PORT: env.PORT,
  },
  GRAPHQL: {
    PATH: env.GRAPHQL_PATH,
    PLAYGROUND: env.GRAPHQL_PLAYGROUND,
  },
  REDIS: {
    URL: env.REDIS_URL,
    TOKEN_BLOCKLIST: env.REDIS_TOKEN_BLOCKLIST,
  },
  TOKEN: {
    SECRET: env.TOKEN_SECRET,
    ALGORITHM: env.TOKEN_ALGORITHM,
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
