// --- ALWAYS FIRST
import 'reflect-metadata';
import '@app/config/env';
// --- END
import readline from 'readline';
import config from '@app/config';
import logger from '@app/logger';
import Server from '@app/server';
import { AddressInfo } from 'net';

// --- BOOTSTRAP
(async () => {
  logger.info('Getting a server instance...');
  let server: Server;
  try {
    server = Server.getInstance();
  } catch (error) {
    logger.error(`Cannot get server instance due to ${error}`);
    process.exit(1);
  }

  logger.info('Server instance obtained. Connecting database...');
  try {
    await Server.connectDatabase();
  } catch (error) {
    logger.error(`Cannot connect database due to ${error}`);
    process.exit(1);
  }

  logger.info('Database connected. Staring the server...');
  let addressInfo: AddressInfo;
  try {
    addressInfo = await server.start(config.NODE.PORT);
  } catch (error) {
    logger.error(`Cannot start the server due to ${error}`);
    process.exit(1);
  }

  logger.info(`Server started. Listening at ${addressInfo.address} on port ${addressInfo.port}`);
})();
// --- END

// --- GRACEFUL SHUTDOWN
if (process.platform === 'win32') {
  readline
    .createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    .on('SIGINT', () => {
      // @ts-ignore: Argument of type '"SIGINT"' is not assignable to parameter of type '"disconnect"'.
      process.emit('SIGINT');
    });
}

process.on('SIGINT', async () => {
  logger.info('Stopping the server...');
  try {
    await Server.getInstance()!.stop();
  } catch (error) {
    logger.error(`Cannot stop the server due to ${error}`);
  }

  logger.info('Server stopped. Disconnecting database...');

  try {
    await Server.disconnectDatabase();
  } catch (error) {
    logger.error(`Cannot disconnect the database due to ${error}`);
  }

  logger.info('Exiting');
  process.exit(0);
});
// --- END
