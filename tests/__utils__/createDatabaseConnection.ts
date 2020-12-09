import path from 'path';
import { ConnectionOptions, createConnection } from 'typeorm';
import config from '@app/config';

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
