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
  },
  TOKEN: {
    SECRET: env.TOKEN_SECRET,
    ALGORITHM: env.TOKEN_ALGORITHM,
  },
  SERVICES: {
    AUTHENTICATIONS: {
      URL: env.SERVICES_AUTHENTICATIONS_URL,
    },
    USERS: {
      URL: env.SERVICES_USERS_URL,
    },
    PRODUCTS: {
      URL: env.SERVICES_PRODUCTS_URL,
    },
    INVENTORIES: {
      URL: env.SERVICES_INVENTORIES_URL,
    },
    PURCHASES: {
      URL: env.SERVICES_PURCHASES_URL,
    },
    REVIEWS: {
      URL: env.SERVICES_REVIEWS_URL,
    }
  },
};

logger.debug('Configuration object constructed');

export default config;
