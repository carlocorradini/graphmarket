import 'reflect-metadata';
import logger from '@graphmarket/logger';
import config from '@app/config';
import { gatewayServer, serviceList } from '@app/server';

const bootstrap = async (): Promise<void> => {
  logger.info(`Available ${serviceList.length} services`);
  // eslint-disable-next-line no-restricted-syntax
  for (const [i, service] of serviceList.entries()) {
    logger.info(`Service ${i + 1}: ${service.name} at ${service.url}`);
  }

  const serverInfo = await gatewayServer.listen(config.NODE.PORT);
  logger.info(`Gateway listening at ${serverInfo.address} on port ${serverInfo.port}`);

  logger.info(`Gateway bootstrap successfully`);
};

bootstrap().catch((error) => {
  logger.error(`Gateway bootstrap error: ${error.message}`);
});
