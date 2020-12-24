import logger from '@app/logger';
import userServer from './server/userServer';

const bootstrap = async () => {
  await userServer.listen(8081);

  logger.info('User service started');
};

bootstrap().catch((error) => {
  logger.error(`User service not started ${error.message}`);
});
