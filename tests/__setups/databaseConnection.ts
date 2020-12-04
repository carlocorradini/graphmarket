import { ConnectionOptions, createConnection, getConnection } from 'typeorm';
import { User } from '../../src/entities';

beforeAll(async () => {
  await createConnection(<ConnectionOptions>{
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
});

afterAll(async () => {
  await getConnection().close();
});
