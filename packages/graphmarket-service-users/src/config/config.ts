import logger from '@graphmarket/logger';
import { IConfigUserService } from '@app/interfaces';
import env from './env';

/**
 * Configuration object.
 *
 * @see env
 */
const config: IConfigUserService = {
  NODE: {
    ENV: env.NODE_ENV,
    PORT: env.PORT,
  },
  GRAPHQL: {
    PATH: env.GRAPHQL_PATH,
    PLAYGROUND: false,
  },
  TOKEN: {
    SECRET: env.TOKEN_ALGORITHM,
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
    UPLOAD: {
      MAX_FILE_SIZE: env.ADAPTER_UPLOAD_MAX_FILE_SIZE,
      MAX_FILES: env.ADAPTER_UPLOAD_MAX_FILES,
    },
  },
};

logger.debug('Configuration object constructed');

export default config;
