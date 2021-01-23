import envalid, { str, port, url } from 'envalid';
import { buildEnv } from '@graphmarket/helpers';
import { EnvUtil } from '@graphmarket/utils';

/**
 * Environment variables sanitized and immutable.
 */
const env = buildEnv(
  envalid.cleanEnv(
    process.env,
    {
      NODE_ENV: str({
        default: 'production',
        devDefault: 'development',
        choices: ['production', 'development', 'test'],
      }),
      PORT: port({ devDefault: 8080 }),
      GRAPHQL_PATH: str({ default: '/graphql' }),
      REDIS_URL: url(),
      REDIS_TOKEN_BLACKLIST: str({ default: 'TOKEN_BLACKLIST' }),
      TOKEN_SECRET: str({ devDefault: 'password' }),
      TOKEN_ALGORITHM: str({ default: 'HS256' }),
      SERVICE_AUTHENTICATIONS_URL: url({ devDefault: 'http://localhost:8081/graphql' }),
      SERVICES_USERS_URL: url({ devDefault: 'http://localhost:8082/graphql' }),
      SERVICES_PRODUCTS_URL: url({ devDefault: 'http://localhost:8083/graphql' }),
      SERVICES_INVENTORIES_URL: url({ devDefault: 'http://localhost:8084/graphql' }),
      SERVICES_PURCHASES_URL: url({ devDefault: 'http://localhost:8085/graphql' }),
    },
    {
      strict: true,
      dotEnvPath: EnvUtil.getDotEnvPath(),
    },
  ),
);

export default env;
