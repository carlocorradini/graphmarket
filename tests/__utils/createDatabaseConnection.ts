import { ConnectionOptions, createConnection } from 'typeorm';
// TODO
import { User } from '../../src/entities';
import env from './env';

export default () => {
  return createConnection(<ConnectionOptions>{
    type: 'postgres',
    url: env.DATABASE_URL,
    synchronize: true,
    dropSchema: true,
    logging: false,
    ssl: false,
    entities: [User],
    cache: {
      type: 'ioredis',
      port: env.REDIS_URL,
    },
  });
};
