import http from 'http';
import { AddressInfo } from 'net';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'express-jwt';
import { graphqlUploadExpress } from 'graphql-upload';
import { IServerModule } from '@app/types';
import config from '@app/config';
import logger from '@app/logger';
import { EnvUtil } from '@app/utils';
import { apollo } from './graphqlModule';

const app = express();
let server: http.Server | undefined;

// Configure express app
app
  .enable('trust proxy')
  .use(compression())
  .use(cors())
  .use(
    helmet({
      contentSecurityPolicy: EnvUtil.isProduction() ? undefined : false,
    }),
  )
  .use(
    config.GRAPHQL.PATH,
    graphqlUploadExpress({
      maxFileSize: config.SERVICES.UPLOAD.MAX_FILE_SIZE,
      maxFiles: config.SERVICES.UPLOAD.MAX_FILES,
    }),
  )
  .use(
    config.GRAPHQL.PATH,
    jwt({
      secret: config.TOKEN.SECRET,
      algorithms: [config.TOKEN.ALGORITHM],
      credentialsRequired: false,
      // TODO Problem in response when the token is revoked
      // isRevoked: blacklist.isRevoked,
    }),
  );

const appModule: IServerModule = {
  async start(): Promise<void> {
    apollo.applyMiddleware({
      app,
      path: config.GRAPHQL.PATH,
    });
    logger.debug('Apollo middleware applied');

    return new Promise((resolve, reject) => {
      server = app
        .listen(config.NODE.PORT, () => {
          const info: AddressInfo = server!.address() as AddressInfo;

          logger.debug('App module started');
          logger.info(`Server started and listening at ${info.address} on port ${info.port}`);
          resolve();
        })
        .on('error', (error) => {
          logger.error('Error while starting HTTP server');
          reject(error);
        });
    });
  },
  stop(): Promise<void> {
    if (!server) {
      logger.warn('Attempted to stop uninitialized server');
      logger.debug('App module stopped');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      server!.close((error) => {
        if (error) {
          logger.error(`Could not close server: ${error.message}`);
          reject(error);
        }

        server = undefined;

        logger.debug('App module stopped');
        resolve();
      });
    });
  },
};

export default appModule;
