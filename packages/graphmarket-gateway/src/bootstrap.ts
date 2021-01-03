import logger from '@graphmarket/logger';
import config from '@app/config';
import { server } from '@app/server';
import { services } from '@app/services';

/**
 * Bootstrap the gateway.
 */
const bootstrap = async (): Promise<void> => {
  logger.info(`Available ${services.length} services`);
  // eslint-disable-next-line no-restricted-syntax
  for (const service of services) {
    logger.info(`Service ${service.name} at ${service.url}`);
  }

  const serverInfo = await server.listen(config.NODE.PORT);
  logger.info(`Listening at ${serverInfo.address} on port ${serverInfo.port}`);

  logger.info(`Bootstrap successfully`);
};

bootstrap().catch((error) => {
  logger.error(`Bootstrap error: ${error.message}`);
  process.exit(1);
});
