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
