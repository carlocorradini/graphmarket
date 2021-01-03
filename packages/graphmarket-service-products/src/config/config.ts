import logger from '@graphmarket/logger';
import { IConfigProductsService } from '@app/interfaces';
import env from './env';

/**
 * Configuration object.
 *
 * @see env
 */
const config: IConfigProductsService = {
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
    UPLOAD: {
      CLOUD_NAME: env.ADAPTER_UPLOAD_CLOUD_NAME,
      API_KEY: env.ADAPTER_UPLOAD_API_KEY,
      API_SECRET: env.ADAPTER_UPLOAD_API_SECRET,
      FOLDER: env.ADAPTER_UPLOAD_FOLDER,
      MAX_FILE_SIZE: env.ADAPTER_UPLOAD_MAX_FILE_SIZE,
      MAX_FILES: env.ADAPTER_UPLOAD_MAX_FILES,
    },
  },
};

logger.debug('Configuration object constructed');

export default config;
