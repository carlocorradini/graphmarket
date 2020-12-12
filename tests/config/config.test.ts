import config from '@app/config';

describe('Config config testing', () => {
  test('config object should be equal to the provided', () => {
    expect(config).toStrictEqual({
      NODE: {
        ENV: 'test',
        PORT: 8080,
      },
      DATABASE: {
        TYPE: 'postgres',
        URL: config.DATABASE.URL,
        SSL: false,
        SYNCHRONIZE: true,
        DROP_SCHEMA: true,
        LOGGING: false,
        ENTITIES: 'entities/**/*.{ts,js}',
        MIGRATIONS: 'migration/**/*.{ts,js}',
        SUBSCRIBERS: 'subscriber/**/*.{ts,js}',
      },
      REDIS: {
        URL: config.REDIS.URL,
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
      SERVICES: {
        PHONE: {
          TWILIO_ACCOUNT_SID: config.SERVICES.PHONE.TWILIO_ACCOUNT_SID,
          TWILIO_AUTH_TOKEN: config.SERVICES.PHONE.TWILIO_AUTH_TOKEN,
          TWILIO_VERIFICATION_SID: config.SERVICES.PHONE.TWILIO_VERIFICATION_SID,
          DEBUG: false,
        },
        EMAIL: {
          SENDGRID_API_KEY: config.SERVICES.EMAIL.SENDGRID_API_KEY,
        },
        UPLOAD: {
          CLOUDINARY_CLOUD_NAME: config.SERVICES.UPLOAD.CLOUDINARY_CLOUD_NAME,
          CLOUDINARY_API_KEY: config.SERVICES.UPLOAD.CLOUDINARY_API_KEY,
          CLOUDINARY_API_SECRET: config.SERVICES.UPLOAD.CLOUDINARY_API_SECRET,
          CLOUDINARY_FOLDER: 'graphmarket/',
          MAX_FILE_SIZE: 4194304,
          MAX_FILES: 8,
        },
      },
    });
  });
});
