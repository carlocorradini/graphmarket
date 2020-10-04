import 'reflect-metadata';
import path from 'path';
import { createConnection, ConnectionOptions } from 'typeorm';
import config from '@app/config';
import logger from '@app/logger';

const boostrap = async () => {
  try {
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

    logger.info(`Database connected`);

    // logger.info(`Server running at ${addressInfo.address} on port ${addressInfo.port}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

boostrap();
