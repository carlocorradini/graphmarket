import 'reflect-metadata';
import logger from '@graphmarket/logger';
import config from '@app/config';
import { server } from './server';

const bootstrap = async () => {
  await server.initAdapters();
  logger.info(`User service adapters initialized`);

  await server.connectDatabase();
  logger.info(`User service connected to database`);

  const serverInfo = await server.listen(config.NODE.PORT);
  logger.info(`User service listening at ${serverInfo.address} on port ${serverInfo.port}`);

  logger.info('User service bootstrap successfully');
};

bootstrap().catch((error) => {
  logger.error(`User service bootstrap error: ${error.message}`);
  process.exit(1);
});
