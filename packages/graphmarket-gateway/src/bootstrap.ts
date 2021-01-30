import logger from '@graphmarket/logger';
import config from '@app/config';
import { server } from '@app/server';
import { healthChecks, services } from '@app/services';

/**
 * Bootstrap the gateway.
 */
const bootstrap = async (): Promise<void> => {
  logger.debug(`${services.length} services are available`);
  // eslint-disable-next-line no-restricted-syntax
  for (const service of services) {
    logger.debug(`Service ${service.name} at ${service.url}`);
  }

  logger.info('Starting health checks...');
  await healthChecks();
  logger.info('Health checks completed');

  logger.info('Starting the server...');
  const serverInfo = await server.listen(config.NODE.PORT);
  logger.info(`Listening at ${serverInfo.address} on port ${serverInfo.port}`);

  logger.info(`Bootstrap successful`);
};

bootstrap().catch((error) => {
  logger.error(`Bootstrap error: ${error.message}`);
  process.exit(1);
});
