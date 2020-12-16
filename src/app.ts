// --- ALWAYS FIRST
import 'reflect-metadata';
import '@app/config/env';
// --- END
import readline from 'readline';
import config from '@app/config';
import logger from '@app/logger';
import Server from '@app/server';

// --- BOOTSTRAP
(async () => {
  try {
    await Server.getInstance().start(config.NODE.PORT);
  } catch (error) {
    logger.error(error);
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
  sigintCalled = true;

  await Server.getInstance().stop();
  process.exit(0);
});
// --- END
