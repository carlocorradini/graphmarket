import env from '../../src/config/env';
import { env as envTest } from '../__utils__';

describe('Env config testing', () => {
  test('env object should be equal to the provided', () => {
    expect(env).toStrictEqual({
      NODE_ENV: 'test',
      PORT: 8080,
      DATABASE_URL: envTest.DATABASE_URL,
      DATABASE_SSL: false,
      DATABASE_SYNCHRONIZE: true,
      DATABASE_DROP_SCHEMA: true,
      DATABASE_LOGGING: false,
      REDIS_URL: envTest.REDIS_URL,
      REDIS_TOKEN_BLOCKLIST: 'TOKEN_BLOCKLIST',
      TOKEN_SECRET: 'password',
      TOKEN_ALGORITHM: 'HS256',
      TOKEN_EXPIRATION_TIME: 60 * 60 * 24 * 7,
      GRAPHQL_PATH: '/graphql',
      GRAPHQL_PLAYGROUND: true,
      SERVICE_PHONE_TWILIO_ACCOUNT_SID: envTest.SERVICE_PHONE_TWILIO_ACCOUNT_SID,
      SERVICE_PHONE_TWILIO_AUTH_TOKEN: envTest.SERVICE_PHONE_TWILIO_AUTH_TOKEN,
      SERVICE_PHONE_TWILIO_VERIFICATION_SID: envTest.SERVICE_PHONE_TWILIO_VERIFICATION_SID,
      SERVICE_PHONE_DEBUG: false,
    });
  });
});
