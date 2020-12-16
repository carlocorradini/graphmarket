import path from 'path';
import { ConnectionOptions, createConnection, getConnection, useContainer } from 'typeorm';
import { Container } from 'typedi';
import { IServerModule } from '@app/types';
import config from '@app/config';
import logger from '@app/logger';

const databaseModule: IServerModule = {
  async start(): Promise<void> {
    // Attach DI container
    useContainer(Container);

    try {
      await createConnection(<ConnectionOptions>{
        type: config.DATABASE.TYPE,
        url: config.DATABASE.URL,
        extra: {
          ssl: config.DATABASE.SSL,
        },
        synchronize: config.DATABASE.SYNCHRONIZE,
        dropSchema: config.DATABASE.DROP_SCHEMA,
        logging: config.DATABASE.LOGGING,
        entities: [path.join(__dirname, '../..', config.DATABASE.ENTITIES)],
        migrations: [path.join(__dirname, '../..', config.DATABASE.MIGRATIONS)],
        subscribers: [path.join(__dirname, '../..', config.DATABASE.SUBSCRIBERS)],
        cache: {
          type: 'ioredis',
          port: config.REDIS.URL,
        },
      });
      logger.debug('Database connected');
    } catch (error) {
      // See https://github.com/typeorm/typeorm/blob/master/src/connection/ConnectionManager.ts#L57
      logger.error(`Error connecting the database: ${error.message}`);
      return Promise.reject(error);
    }

    logger.debug('Database module started');
    return Promise.resolve();
  },
  async stop(): Promise<void> {
    let conn;

    try {
      conn = getConnection();
    } catch (error) {
      // See https://github.com/typeorm/typeorm/blob/master/src/connection/ConnectionManager.ts#L40
      logger.error(`Error getting database connection: ${error.message}`);
      return Promise.reject(error);
    }

    try {
      await conn.close();
      logger.debug('Database disconnected');
    } catch (error) {
      // https://github.com/typeorm/typeorm/blob/master/src/connection/Connection.ts#L226
      logger.error(`Error closing the database connection: ${error.message}`);
      return Promise.reject(error);
    }

    logger.debug('Database module stopped');
    return Promise.resolve();
  },
};

export default databaseModule;
