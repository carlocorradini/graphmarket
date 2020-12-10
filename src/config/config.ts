import { IConfig } from '@app/types';
import logger from '@app/logger';
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
  DATABASE: {
    TYPE: 'postgres',
    URL: env.DATABASE_URL,
    SSL: env.DATABASE_SSL,
    SYNCHRONIZE: env.DATABASE_SYNCHRONIZE,
    DROP_SCHEMA: env.DATABASE_DROP_SCHEMA,
    LOGGING: env.DATABASE_LOGGING,
    ENTITIES: 'entities/**/*.{ts,js}',
    MIGRATIONS: 'migration/**/*.{ts,js}',
    SUBSCRIBERS: 'subscriber/**/*.{ts,js}',
  },
  REDIS: {
    URL: env.REDIS_URL,
    TOKEN_BLOCKLIST: env.REDIS_TOKEN_BLOCKLIST,
  },
  TOKEN: {
    SECRET: env.TOKEN_SECRET,
    ALGORITHM: env.TOKEN_ALGORITHM,
    EXPIRATION_TIME: env.TOKEN_EXPIRATION_TIME,
  },
  GRAPHQL: {
    PATH: env.GRAPHQL_PATH,
    PLAYGROUND: env.GRAPHQL_PLAYGROUND,
    RESOLVERS: 'graphql/resolvers/**/*.{ts,js}',
  },
  SERVICES: {
    PHONE: {
      TWILIO_ACCOUNT_SID: env.SERVICE_PHONE_TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: env.SERVICE_PHONE_TWILIO_AUTH_TOKEN,
      TWILIO_VERIFICATION_SID: env.SERVICE_PHONE_TWILIO_VERIFICATION_SID,
      DEBUG: env.SERVICE_PHONE_DEBUG,
    },
    EMAIL: {
      SENDGRID_API_KEY: env.SERVICE_EMAIL_SENDGRID_API_KEY,
    },
  },
};

logger.debug('Configuration object constructed');

export default config;
