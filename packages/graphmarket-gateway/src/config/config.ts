import logger from '@graphmarket/logger';
import IConfigGateway from '@app/interfaces/IConfigGateway';
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
    PLAYGROUND: true,
  },
  REDIS: {
    URL: env.REDIS_URL,
    TOKEN_BLACKLIST: env.REDIS_TOKEN_BLACKLIST,
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
