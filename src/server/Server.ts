import path from 'path';
import http from 'http';
import { AddressInfo } from 'net';
import { ApolloServer } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';
import { Connection, ConnectionOptions, createConnection, getConnection, useContainer } from 'typeorm';
import { ConnectionNotFoundError } from 'typeorm/error/ConnectionNotFoundError';
import { Container } from 'typedi';
import blacklist from 'express-jwt-blacklist';
import config from '@app/config';
import logger from '@app/logger';
import { IContext } from '@app/types';
import { AuthorizationMiddleware } from '@app/middlewares';
import { EnvUtil } from '@app/util';
import app from '@app/server/App';

/**
 * Application Server.
 */
export default class Server {
  /**
   * Singleton server instance.
   */
  private static instance: Server;

  /**
   * Http server instance.
   */
  private server?: http.Server;

  /**
   * Construct the server. Throw errors if configuration fails.
   */
  private constructor() {
    this.server = undefined;

    logger.info('Configuration started. Doing preliminary checks...');
    Server.doChecks();

    logger.info('Checks passed. Configuring services...');
    Server.configureServices();

    logger.info('Services configured. Configuring server...');
    Server.configureServer();

    logger.info('Configuration successful');
  }

  /**
   * Performs the preliminary checks before starting the server.
   */
  private static doChecks(): void {
    // Make sure there is no connection to the database.
    try {
      getConnection();
    } catch (error) {
      if (error instanceof ConnectionNotFoundError) return;
      // Probably AlreadyHasActiveConnectionError
      throw error;
    }
  }

  /**
   * Configures the app services.
   */
  private static configureServices(): void {
    blacklist.configure({
      strict: false,
      store: {
        type: 'redis',
        url: config.REDIS.URL,
      },
    });
  }

  /**
   * Configure the app server.
   */
  private static configureServer(): void {
    // Dependency injection
    useContainer(Container);

    const server = new ApolloServer({
      schema: buildSchemaSync({
        resolvers: [path.join(__dirname, '..', config.GRAPHQL.RESOLVERS)],
        authChecker: AuthorizationMiddleware,
        container: Container,
      }),
      playground: config.GRAPHQL.PLAYGROUND,
      tracing: !EnvUtil.isProduction(),
      context: ({ req, res }) => {
        const context: IContext = {
          req,
          res,
          user: req.user,
        };

        return context;
      },
    });

    server.applyMiddleware({ app, path: config.GRAPHQL.PATH });
  }

  /**
   * Return the current server instance.
   * If the instance is undefined a new instance is created.
   *
   * @returns Current server instance
   */
  public static getInstance(): Server {
    if (!Server.instance) Server.instance = new Server();
    return Server.instance;
  }

  /**
   * Connects the database and starts the server.
   *
   * @param port - Listening port
   * @returns Server listening address information
   */
  public async start(port: number = config.NODE.PORT): Promise<AddressInfo> {
    if (this.server) {
      logger.warn(`Attempted to start the server while it was already started`);
      return this.server.address() as AddressInfo;
    }

    // Test if we can get a connection. If not, error is thrown.
    await getConnection();

    return new Promise((resolve, reject) => {
      this.server = app
        .listen(port, () => {
          resolve(this.server!.address() as AddressInfo);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   *  Stops the server.
   */
  public async stop(): Promise<void> {
    if (!this.server) {
      logger.warn(`Attempted to stop the server but server was undefined`);
      return;
    }
    if (!this.server!.listening) {
      logger.warn(`Attempted to stop the server but it was not listening`);
      return;
    }

    this.server!.close(() => {
      this.server = undefined;
    });
  }

  /**
   * Connects the database.
   */
  public static async connectDatabase(): Promise<void> {
    await createConnection(<ConnectionOptions>{
      type: config.DATABASE.TYPE,
      url: config.DATABASE.URL,
      extra: {
        ssl: config.DATABASE.SSL,
      },
      synchronize: config.DATABASE.SYNCHRONIZE,
      logging: config.DATABASE.LOGGING,
      entities: [path.join(__dirname, '..', config.DATABASE.ENTITIES)],
      migrations: [path.join(__dirname, '..', config.DATABASE.MIGRATIONS)],
      subscribers: [path.join(__dirname, '..', config.DATABASE.SUBSCRIBERS)],
      cache: {
        type: 'ioredis',
        options: {
          host: config.REDIS.HOST,
          port: config.REDIS.PORT,
          password: config.REDIS.PASSWORD,
        },
      },
    });
  }

  /**
   * Disconnects the database.
   */
  public static async disconnectDatabase(): Promise<void> {
    let conn: Connection;
    try {
      conn = getConnection();
    } catch (error) {
      // ConnectionNotFoundError
      return error;
    }

    if (!conn.isConnected) {
      logger.warn('Attempted to disconnect the database but database is not connected');
      return undefined;
    }
    return conn.close();
  }
}
