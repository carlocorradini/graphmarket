import { createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../src/entities';

export default async () => {
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
  console.log(`REDIS_URL: ${process.env.REIDS_URL}`);

  return createConnection(<ConnectionOptions>{
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [User],
    cache: {
      type: 'ioredis',
      port: process.env.REDIS_URL,
    },
  });
};
