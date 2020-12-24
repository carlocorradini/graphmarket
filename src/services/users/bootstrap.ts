import 'reflect-metadata';
import logger from '@app/logger';
import config from '@app/config';
import userServer from './server/userServer';

const bootstrap = async () => {
  const serverInfo = await userServer.listen(config.SERVICES.USER.PORT);
  logger.info(`User service listening at ${serverInfo.url}`);

  logger.info('User service bootstrap successfully');
};

bootstrap().catch((error) => {
  logger.error(`User service bootstrap error: ${error.message}`);
});
