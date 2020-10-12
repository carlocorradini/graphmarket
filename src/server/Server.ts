import path from 'path';
import { AddressInfo } from 'net';
import express from 'express';
import jwt from 'express-jwt';
import compression from 'compression';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';
import { getConnection, useContainer } from 'typeorm';
import { Container } from 'typedi';
import config from '@app/config';
import logger from '@app/logger';
import { IContext } from '@app/types';
import { AuthorizationMiddleware } from '@app/middlewares';

export default class Server {
  public static readonly DEFAULT_PORT = 0;

  private static instance: Server;

  private readonly app: express.Application;

  private server!: ApolloServer;

  private constructor() {
    this.app = express();

    this.configure();
    logger.info('Server ready');
  }

  // eslint-disable-next-line class-methods-use-this
  private configureChecks(): void {
    try {
      getConnection();
      logger.error(
        'Server must be instantiated before database connection to allow dependency injection',
      );
      process.exit(1);
    } catch (error) {
      if (error.name !== 'ConnectionNotFoundError') throw error;
    }
  }

  private configure(): void {
    this.configureChecks();

    this.app
      .enable('trust proxy')
      .use(compression())
      .use(cors())
      .use(
        config.GRAPHQL.PATH,
        jwt({
          secret: config.JWT.SECRET,
          algorithms: [config.JWT.ALGORITHM],
          credentialsRequired: false,
        }),
      );
    logger.debug('Express configured');

    useContainer(Container);
    logger.debug('Dependency injection applied');

    const schema = buildSchemaSync({
      resolvers: [path.join(__dirname, '..', config.GRAPHQL.RESOLVERS)],
      authChecker: AuthorizationMiddleware,
      container: Container,
    });
    logger.debug('GraphQL schema built');

    this.server = new ApolloServer({
      schema,
      playground: config.GRAPHQL.PLAYGROUND,
      context: ({ req, res }) => {
        const context: IContext = {
          req,
          res,
          user: req.user,
        };

        return context;
      },
    });
    logger.debug('Apollo server configured');

    this.server.applyMiddleware({ app: this.app, path: config.GRAPHQL.PATH });
    logger.debug(`Express middleware applied to Apollo server on path ${config.GRAPHQL.PATH}`);

    logger.debug('Server configured');
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
      logger.debug('Server instantiated');
    }
    return Server.instance;
  }

  public listen(port: number = Server.DEFAULT_PORT): Promise<AddressInfo> {
    return new Promise((resolve, reject) => {
      const serverInfo = this.app
        .listen(port, () => {
          resolve(serverInfo.address() as AddressInfo);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
