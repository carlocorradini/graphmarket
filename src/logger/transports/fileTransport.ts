import { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

/**
 * File transport
 */
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

export default fileTransport;
