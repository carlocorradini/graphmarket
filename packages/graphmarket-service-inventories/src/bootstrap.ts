import 'reflect-metadata';
import logger from '@graphmarket/logger';
import config from '@app/config';
import server from '@app/server';

/**
 * Bootstrap the inventories service.
 */
const bootstrap = async () => {
  logger.info('Connecting database...');
  await server.connectDatabase();
  logger.info(`Database connected`);

  logger.info('Starting the server...')
  const serverInfo = await server.listen(config.NODE.PORT);
  logger.info(`Listening at ${serverInfo.address} on port ${serverInfo.port}`);

  logger.info('Bootstrap successful');
};

bootstrap().catch((error) => {
  logger.error(`Bootstrap error: ${error.message}`);
  process.exit(1);
});
