import { createLogger, format } from 'winston';
import { EnvUtil } from '@graphmarket/utils';
import { consoleTransport, fileTransport } from './transports';

/**
 * Logger.
 */
const logger = createLogger({
  level: EnvUtil.isProduction() ? 'info' : 'debug',
  exitOnError: false,
  format: format.combine(
    format((info) => {
      // eslint-disable-next-line no-param-reassign
      info.level = info.level.toUpperCase();
      return info;
    })(),
    format.colorize(),
    format.align(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level} ${message}`),
  ),
  transports: [
    // Enable file transport only in production
    ...(EnvUtil.isProduction() ? [fileTransport] : []),
    // Enable console transport only in development or test mode
    ...(EnvUtil.isDevelopment() || EnvUtil.isTest() ? [consoleTransport] : []),
  ],
});

logger.debug(`Logger initialized at ${logger.level} level`);

export default logger;
