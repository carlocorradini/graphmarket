import path from 'path';
import { AddressInfo } from 'net';
import express from 'express';
import jwt from 'express-jwt';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { ApolloServer } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';
import { getConnection, useContainer } from 'typeorm';
import { Container } from 'typedi';
import config from '@app/config';
import logger from '@app/logger';
import { IContext } from '@app/types';
import { AuthorizationMiddleware } from '@app/middlewares';
import { CacheService } from '@app/services';
import { JWTHelper } from '@app/helper';
import { UnauthorizedError } from '@app/error';
import { EnvUtil } from '@app/util';

export default class Server {
  public static readonly DEFAULT_PORT = 0;

  private static instance: Server;

  private readonly app: express.Application;

  private server!: ApolloServer;

  private constructor() {
    this.app = express();

    this.configure();
    logger.info('Server is ready');
  }

  private configure(): void {
    this.preConfigureChecks();
    this.configureServices();
    this.configureServer();

    logger.debug('Server configured');
  }

  // eslint-disable-next-line class-methods-use-this
  private preConfigureChecks(): void {
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

  // eslint-disable-next-line class-methods-use-this
  private configureServices(): void {
    CacheService.mount(config.REDIS.URL);
  }

  private configureServer(): void {
    this.app
      .enable('trust proxy')
      .use(compression())
      .use(cors())
      .use(helmet({ contentSecurityPolicy: EnvUtil.isProduction() ? undefined : false }))
      .use(
        config.GRAPHQL.PATH,
        jwt({
          secret: config.JWT.SECRET,
          algorithms: [config.JWT.ALGORITHM],
          credentialsRequired: false,
          // TODO Problem in response when the token is revoked
          isRevoked: async (req, _, done) => {
            const token: string | undefined = JWTHelper.getToken(req);

            if (!token || (await JWTHelper.isBlocked(token))) {
              return done(new UnauthorizedError('The JWT token has been revoked'), true);
            }

            return done(undefined, false);
          },
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
    logger.debug(`Express middleware applied to Apollo Server on path ${config.GRAPHQL.PATH}`);
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
