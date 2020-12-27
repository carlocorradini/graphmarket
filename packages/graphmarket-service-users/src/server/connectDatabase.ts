import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { User } from '@graphmarket/entities';
import config from '@app/config';

const connectDatabase = (): Promise<Connection> =>
  createConnection(<ConnectionOptions>{
    type: config.DATABASE.TYPE,
    url: config.DATABASE.URL,
    extra: {
      ssl: config.DATABASE.SSL,
    },
    synchronize: config.DATABASE.SYNCHRONIZE,
    dropSchema: config.DATABASE.DROP_SCHEMA,
    logging: config.DATABASE.LOGGING,
    entities: [User],
    cache: {
      type: 'ioredis',
      port: config.REDIS.URL,
    },
  });

export default connectDatabase;
