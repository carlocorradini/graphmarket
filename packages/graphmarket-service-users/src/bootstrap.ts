import 'reflect-metadata';
import logger from '@graphmarket/logger';
import config from '@app/config';
import userServer from './server/userServer';

const bootstrap = async () => {
  await userServer.connectDatabase();
  logger.info(`User service connected to database`);

  const serverInfo = await userServer.listen(config.NODE.PORT);
  logger.info(`User service listening at ${serverInfo.address} on port ${serverInfo.port}`);

  logger.info('User service bootstrap successfully');
};

bootstrap().catch((error) => {
  logger.error(`User service bootstrap error: ${error.message}`);
  process.exit(1);
});
