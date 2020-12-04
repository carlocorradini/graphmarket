import { createConnection, ConnectionOptions } from 'typeorm';
import { User } from '../src/entities';

export default async () => {
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
  console.log(`REDIS_URL: ${process.env.REDIS_URL}`);

  return createConnection(<ConnectionOptions>{
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number.parseInt(process.env.POSTGRES_PORT as string, 10),
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    synchronize: true,
    dropSchema: true,
    logging: false,
    ssl: false,
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
