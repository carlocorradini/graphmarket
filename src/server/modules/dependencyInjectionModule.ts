import { getConnection } from 'typeorm';

import { IServerModule } from '@app/types';
import logger from '@app/logger';

const dependencyInjectionModule: IServerModule = {
  async start(): Promise<void> {
    // Make sure no connection to the database already exists
    try {
      getConnection();
    } catch (error) {
      // See https://github.com/typeorm/typeorm/blob/master/src/connection/ConnectionManager.ts#L40
      if (error.name !== 'ConnectionNotFoundError') {
        logger.error('Error while getting connection to the database');
        return Promise.reject(error);
      }
    }

    logger.debug('Dependency injection module started');
    return Promise.resolve();
  },
  stop(): Promise<void> {
    logger.debug('Dependency injection module stopped');
    return Promise.resolve();
  },
};

export default dependencyInjectionModule;
