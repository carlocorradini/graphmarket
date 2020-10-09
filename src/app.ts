import 'reflect-metadata';
import '@app/config/env';
import path from 'path';
import { createConnection, ConnectionOptions } from 'typeorm';
import config from '@app/config';
import logger from '@app/logger';
import Server from '@app/server';

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

    logger.debug('Database connected');

    const serverInfo = await Server.getInstance().listen(config.NODE.PORT);

    logger.info(`Server listening ${serverInfo.address} on port ${serverInfo.port}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

boostrap();
