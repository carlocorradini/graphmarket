import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import { graphqlUploadExpress } from 'graphql-upload';
import jwt from 'express-jwt';
import jwtBlacklist from 'express-jwt-blacklist';
import { EnvUtil } from '@graphmarket/utils';
import { IBuildExpressAppOptions } from '@app/interfaces';

/**
 * Build express app given the options.
 *
 * @param options - Express app build options
 * @returns Express app
 */
const buildExpressApp = (options: IBuildExpressAppOptions) => {
  const app = express();

  app
    .enable('trust proxy')
    .use(compression())
    .use(
      helmet({
        contentSecurityPolicy:
          EnvUtil.isProduction() && !options.graphql.playground ? undefined : false,
      }),
    );

  if (options.token && options.redis) {
    jwtBlacklist.configure({
      strict: false,
      store: {
        type: 'redis',
        url: options.redis.url,
      },
    });

    app.use(
      options.graphql.path,
      jwt({
        secret: options.token.secret,
        algorithms: [options.token.algorithm],
        credentialsRequired: false,
        isRevoked: jwtBlacklist.isRevoked,
      }),
    );
  }

  if (options.upload) {
    app.use(
      options.graphql.path,
      graphqlUploadExpress({
        maxFileSize: options.upload.maxFileSize,
        maxFiles: options.upload.maxFiles,
      }),
    );
  }

  return app;
};

export default buildExpressApp;
