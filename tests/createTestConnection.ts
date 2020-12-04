import { createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../src/entities';

export default async () => {
  return createConnection(<ConnectionOptions>{
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    dropSchema: true,
    logging: false,
    ssl: false,
    entities: [User],
    cache: {
      type: 'ioredis',
      port: process.env.REDIS_URL,
    },
  });
};
