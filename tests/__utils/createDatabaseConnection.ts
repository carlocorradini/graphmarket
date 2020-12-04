import path from 'path';
import { ConnectionOptions, createConnection } from 'typeorm';
import env from './env';

export default () => {
  return createConnection(<ConnectionOptions>{
    type: 'postgres',
    url: env.DATABASE_URL,
    synchronize: true,
    dropSchema: true,
    logging: false,
    ssl: false,
    entities: [path.resolve(__dirname, '../../src/entities/**/*.ts')],
    cache: {
      type: 'ioredis',
      port: env.REDIS_URL,
    },
  });
};
