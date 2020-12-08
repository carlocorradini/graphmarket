import path from 'path';
import envalid, { bool, str, url } from 'envalid';
import _ from 'lodash';

const env = _.omit(
  {
    ...envalid.cleanEnv(
      process.env,
      {
        DATABASE_URL: url(),
        REDIS_URL: url(),
        DATABASE_SYNCHRONIZE: bool({ default: true }),
        DATABASE_DROP_SCHEMA: bool({ default: true }),
        SERVICE_PHONE_TWILIO_ACCOUNT_SID: str(),
        SERVICE_PHONE_TWILIO_AUTH_TOKEN: str(),
        SERVICE_PHONE_TWILIO_VERIFICATION_SID: str(),
      },
      {
        dotEnvPath: path.resolve(process.cwd(), '.env.test'),
        strict: true,
      },
    ),
  },
  'isDev',
  'isDevelopment',
  'isProd',
  'isProduction',
  'isTest',
);

// @ts-ignore
process.env = {
  ...process.env,
  ...env,
};

export default env;
