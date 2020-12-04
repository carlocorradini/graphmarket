import { createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../src/entities';

export default async () => {
  return createConnection(<ConnectionOptions>{
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [User],
    cache: {
      type: 'ioredis',
      options: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    },
  });
};
