import path from 'path';
import { ConnectionOptions, createConnection } from 'typeorm';
// eslint-disable-next-line import/no-named-as-default
import config from '../../src/config';

export default () =>
  createConnection(<ConnectionOptions>{
    type: 'postgres',
    url: config.DATABASE.URL,
    synchronize: true,
    dropSchema: true,
    logging: false,
    ssl: false,
    entities: [path.resolve(__dirname, '../../src/entities/**/*.ts')],
    cache: {
      type: 'ioredis',
      port: config.REDIS.URL,
    },
  });
