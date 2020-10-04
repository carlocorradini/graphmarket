import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  exitOnError: false,
  format: format.combine(
    format.label({
      label: path.basename(process.mainModule !== undefined ? process.mainModule.filename : '?'),
    }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' })
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format((info) => {
          // eslint-disable-next-line no-param-reassign
          info.level = info.level.toUpperCase();
          return info;
        })(),
        format.colorize(),
        format.printf(
          (info) =>
            `${info.timestamp} ${info.level} [${info.label}]: ${info.message
              .replace(/\s+/g, ' ')
              .trim()}`
        )
      ),
    }),
    new DailyRotateFile({
      dirname: 'log',
      filename: '%DATE%',
      extension: '.log',
      datePattern: 'YYYY-MM-DD',
      eol: '\n',
      zippedArchive: true,
      maxFiles: '112d',
      format: format.combine(
        format.printf(
          (info) =>
            `${info.timestamp} ${info.level.toUpperCase()} [${info.label}]: ${info.message
              .replace(/\s+/g, ' ')
              .trim()}`
        )
      ),
    }),
  ],
});

logger.info(`Logger initialized at ${logger.level} level`);

export default logger;
