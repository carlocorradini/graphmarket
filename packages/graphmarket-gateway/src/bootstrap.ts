import logger from '@graphmarket/logger';
import config from '@app/config';
import { server, serviceList } from '@app/server';

const bootstrap = async (): Promise<void> => {
  logger.info(`Available ${serviceList.length} services`);
  // eslint-disable-next-line no-restricted-syntax
  for (const service of serviceList) {
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
