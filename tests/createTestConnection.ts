import { createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../src/entities';

export default async () => {
  return createConnection(<ConnectionOptions>{
    type: 'postgres',
    url: 'postgres://postgres:postgres@localhost:5432/graphmarket-test',
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [User],
    cache: {
      type: 'ioredis',
      port: 'redis://:@localhost:6379/1',
    },
  });
};
