import 'reflect-metadata';
import logger from '@graphmarket/logger';
import config from '@app/config';
import productServer from './server/productServer';

const bootstrap = async () => {
  await productServer.connectDatabase();
  logger.info(`Product service connected to database`);

  const serverInfo = await productServer.listen(config.NODE.PORT);
  logger.info(`Product service listening at ${serverInfo.url}`);

  logger.info('Product service bootstrap successfully');
};

bootstrap().catch((error) => {
  logger.error(`Product service bootstrap error: ${error.message}`);
});
