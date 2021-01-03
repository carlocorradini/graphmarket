import 'reflect-metadata';
import logger from '@graphmarket/logger';
import config from '@app/config';
import server from '@app/server';

/**
 * Bootstrap the user service.
 */
const bootstrap = async () => {
  await server.initAdapters();
  logger.info(`Adapters initialized`);

  await server.connectDatabase();
  logger.info(`Database connected`);

  const serverInfo = await server.listen(config.NODE.PORT);
  logger.info(`Listening at ${serverInfo.address} on port ${serverInfo.port}`);

  logger.info('Bootstrap successfully');
};

bootstrap().catch((error) => {
  logger.error(`Bootstrap error: ${error.message}`);
  process.exit(1);
});
