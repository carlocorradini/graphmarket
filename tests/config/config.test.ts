import config from '../../src/config/config';
import { env } from '../__utils';

describe('Config config testing', () => {
  test('config object should be equal to the provided', () => {
    expect(config).toStrictEqual({
      NODE: {
        ENV: 'test',
        PORT: 8080,
      },
      DATABASE: {
        TYPE: 'postgres',
        URL: env.DATABASE_URL,
        SSL: false,
        SYNCHRONIZE: true,
        DROP_SCHEMA: true,
        LOGGING: false,
        ENTITIES: 'entities/**/*.{ts,js}',
        MIGRATIONS: 'migration/**/*.{ts,js}',
        SUBSCRIBERS: 'subscriber/**/*.{ts,js}',
      },
      REDIS: {
        URL: env.REDIS_URL,
        TOKEN_BLOCKLIST: 'TOKEN_BLOCKLIST',
      },
      TOKEN: {
        SECRET: 'password',
        ALGORITHM: 'HS256',
        EXPIRATION_TIME: 60 * 60 * 24 * 7,
      },
      GRAPHQL: {
        PATH: '/graphql',
        PLAYGROUND: true,
        RESOLVERS: 'graphql/resolvers/**/*.{ts,js}',
      },
    });
  });
});
