import 'reflect-metadata';
import { AddressInfo } from 'net';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { graphqlUploadExpress } from 'graphql-upload';
import jwt from 'express-jwt';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import logger from '@app/logger';
import { EnvUtil } from '@app/utils';
import config from '@app/config';
import { userServer } from '@app/services';
import { IContext } from '@app/types';

const app = express();

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

const bootstrap = async () => {
  const serviceList = [
    {
      name: 'users',
      url: (await userServer.listen(config.SERVICES.USER.PORT)).url,
    },
  ];

  // TODO gateway
  const { schema, executor } = await new ApolloGateway({
    serviceList,
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }: { request: any; context: IContext }) {
          request.http?.headers.set('user', context.user ? JSON.stringify(context.user) : null);
        },
      });
    },
  }).load();

  const server = new ApolloServer({
    schema,
    executor,
    playground: config.GRAPHQL.PLAYGROUND,
    uploads: false,
    tracing: !EnvUtil.isProduction(),
    context: ({ req }) => {
      const context: IContext = {
        user: req.user || undefined,
      };
      return context;
    },
  });

  server.applyMiddleware({
    app,
    path: config.GRAPHQL.PATH,
  });

  const httpServer = app
    .listen(config.NODE.PORT, () => {
      const info: AddressInfo = httpServer.address() as AddressInfo;

      logger.info(`Server started and listening at ${info.address} on port ${info.port}`);
    })
    .on('error', (error) => {
      logger.error(`Error starting HTTP server: ${error.message}`);
    });
};

bootstrap().catch((error) => {
  logger.error(`Error bootstrapping: ${error.message}`);
});
