import { createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../src/entities';

export default async () => {
  return createConnection(<ConnectionOptions>{
    type: 'postgres',
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
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
