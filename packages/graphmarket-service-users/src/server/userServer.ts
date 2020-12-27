import { AddressInfo } from 'net';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { User } from '@graphmarket/entities';
import { buildFederatedSchema, buildService } from '@graphmarket/helpers';
import config from '@app/config';
import { UserResolver, resolveUserReference } from '@app/resolvers';

const listen = async (port: number): Promise<AddressInfo> => {
  const schema = await buildFederatedSchema(
    {
      resolvers: [UserResolver],
      orphanedTypes: [User],
    },
    {
      User: { __resolveReference: resolveUserReference },
    },
  );

  const app = buildService({
    graphql: {
      schema,
      path: config.GRAPHQL.PATH,
      playground: config.GRAPHQL.PLAYGROUND,
    },
    upload: {
      maxFileSize: config.ADAPTERS.UPLOAD.MAX_FILE_SIZE,
      maxFiles: config.ADAPTERS.UPLOAD.MAX_FILES,
    },
  });

  return new Promise((resolve, reject) => {
    const server = app
      .listen(port, () => {
        resolve(server.address() as AddressInfo);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

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

export default { listen, connectDatabase };
