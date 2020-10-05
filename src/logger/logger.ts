import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = createLogger({
  level: process.env.isProduction === 'true' ? 'info' : 'debug',
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
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level} ${message}`)
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      format: format.uncolorize(),
      dirname: 'log',
      filename: '%DATE%',
      extension: '.log',
      datePattern: 'YYYY-MM-DD',
      eol: '\n',
      zippedArchive: true,
      maxFiles: '112d',
    }),
  ],
});

logger.info(`Logger initialized at ${logger.level} level`);

export default logger;
