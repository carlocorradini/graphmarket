import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { EnvUtil } from '@app/util';

const consoleTransport = new transports.Console();

const fileTransport = new DailyRotateFile({
  format: format.uncolorize(),
  dirname: 'log',
  filename: '%DATE%',
  extension: '.log',
  datePattern: 'YYYY-MM-DD',
  eol: '\n',
  zippedArchive: true,
  maxFiles: '112d',
});

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
  transports: [consoleTransport, fileTransport],
});

// Remove Console transport in production environment
if (EnvUtil.isProduction()) logger.remove(consoleTransport);

logger.debug(`Logger initialized at ${logger.level} level`);

export default logger;
