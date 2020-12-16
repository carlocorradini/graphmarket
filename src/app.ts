// --- ALWAYS FIRST
import 'reflect-metadata';
import '@app/config/env';
// --- END
import readline from 'readline';
import logger from '@app/logger';
import {
  dependencyInjectionModule,
  databaseModule,
  appModule,
  graphqlModule,
} from '@app/server/modules';

// --- BOOTSTRAP
(async () => {
  try {
    logger.info('Hello Graph Market, initiating bootstrap procedure');

    logger.info('Starting dependency injection module...');
    await dependencyInjectionModule.start();
    logger.info('Dependency injection module started');

    logger.info('Starting database module...');
    await databaseModule.start();
    logger.info('Database module started');

    logger.info('Starting GraphQL module...');
    await graphqlModule.start();
    logger.info('GraphQL module started');

    logger.info('Starting app module...');
    await appModule.start();
    logger.info('App module started');

    logger.info('* * * GraphQL Market is ready! * * *');
  } catch (error) {
    logger.error(`Could not bootstrap Graph Market: ${error.message}`);
    process.exit(1);
  }
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

let sigintCalled = false;

process.on('SIGINT', async () => {
  if (sigintCalled) {
    logger.warn('SIGINT caught twice, skipping');
    return;
  }

  logger.info('Stopping Graph Market');
  sigintCalled = true;

  logger.info('Stopping Graph Market');
  sigintCalled = true;

  try {
    logger.info('Stopping database module...');
    await databaseModule.stop();
    logger.info('Database module stopped');
  } catch (error) {
    // Log the error and continue anyways
    logger.error(`Could not properly stop the database module: ${error.message}`);
  }

  try {
    logger.info('Stopping app module...');
    await appModule.stop();
    logger.info('App module stopped');
  } catch (error) {
    logger.error(`Could not stop the server: ${error.message}`);
  }

  // Whatever happened, we now exit the process
  logger.info('Bye, cruel world');
  process.exit(0);
});
// --- END