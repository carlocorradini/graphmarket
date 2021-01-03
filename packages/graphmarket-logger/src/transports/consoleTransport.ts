import { transports } from 'winston';

/**
 * Console transport.
 */
const consoleTransport = new transports.Console();

export default consoleTransport;
