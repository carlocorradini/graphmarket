import 'reflect-metadata';
import '@app/config/env';
import path from 'path';
import { createConnection, ConnectionOptions, useContainer } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import jwt from 'express-jwt';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import { IContext } from '@app/types';
import { AuthMiddleware } from '@app/middleware';
import config from '@app/config';
import logger from '@app/logger';
import { AddressInfo } from 'net';

// TODO change server style
const boostrap = async () => {
  try {
    useContainer(Container);

    logger.debug('Dependency injection configured');

    const schema = await buildSchema({
      resolvers: [path.join(__dirname, config.GRAPHQL.RESOLVERS)],
      authChecker: AuthMiddleware,
      container: Container,
    });

    logger.debug('GraphQL schema built');

    const app = express();

    const server = new ApolloServer({
      schema,
      playground: config.GRAPHQL.PLAYGROUND,
      context: ({ req }) => {
        const context: IContext = {
          req,
          user: req.user,
        };

        return context;
      },
    });

    app.use(
      '/graphql',
      jwt({
        secret: config.JWT.SECRET,
        algorithms: [config.JWT.ALGORITHM],
        credentialsRequired: false,
      }),
    );

    server.applyMiddleware({ app, path: '/graphql' });

    logger.debug('Server configured');

    await createConnection(<ConnectionOptions>{
      type: config.DATABASE.TYPE,
      url: config.DATABASE.URL,
      extra: {
        ssl: config.DATABASE.SSL,
      },
      synchronize: config.DATABASE.SYNCHRONIZE,
      logging: config.DATABASE.LOGGING,
      entities: [path.join(__dirname, config.DATABASE.ENTITIES)],
      migrations: [path.join(__dirname, config.DATABASE.MIGRATIONS)],
      subscribers: [path.join(__dirname, config.DATABASE.SUBSCRIBERS)],
    });

    logger.debug('Database connected');

    // TODO cambia
    const serverListener = app.listen(config.NODE.PORT, () => {
      const serverInfo = serverListener.address() as AddressInfo;
      logger.info(`Server running on ${serverInfo.address} and port ${serverInfo.port}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

boostrap();
