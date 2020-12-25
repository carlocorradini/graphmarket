import 'reflect-metadata';
import { AddressInfo } from 'net';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'express-jwt';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { logger, EnvUtil, IContext } from '@graphmarket/commons';
import config from '@app/config';

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
    jwt({
      secret: config.TOKEN.SECRET,
      algorithms: [config.TOKEN.ALGORITHM],
      credentialsRequired: false,
      // TODO Problem in response when the token is revoked
      // isRevoked: blacklist.isRevoked,
    }),
  );

const bootstrap = async (): Promise<void> => {
  const serviceList = [{ name: 'users', url: config.SERVICES.USERS.URL }];

  // TODO gateway
  const { schema, executor } = await new ApolloGateway({
    serviceList,
    __exposeQueryPlanExperimental: false,
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
    subscriptions: false,
    tracing: config.GRAPHQL.TRACING,
    context: ({ req }): IContext => ({
      user: req.user || undefined,
    }),
  });

  server.applyMiddleware({
    app,
    path: config.GRAPHQL.PATH,
  });

  return new Promise((resolve, reject) => {
    const httpServer = app
      .listen(config.NODE.PORT, () => {
        const info: AddressInfo = httpServer.address() as AddressInfo;

        logger.info(`Gateway listening at ${info.address} on port ${info.port}`);
        logger.info(`Gateway bootstrap successfully`);
        resolve();
      })
      .on('error', (error) => reject(error));
  });
};

bootstrap().catch((error) => {
  logger.error(`Gateway bootstrap error: ${error.message}`);
});
