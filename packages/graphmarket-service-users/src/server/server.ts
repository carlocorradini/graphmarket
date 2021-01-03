import { AddressInfo } from 'net';
import { buildFederatedSchema, buildService } from '@graphmarket/helpers';
import { User } from '@graphmarket/entities';
import config from '@app/config';
import { UserResolver, resolveUserReference } from '@app/resolvers';
import { EmailAdapter, PhoneAdapter, UploadAdapter, TokenAdapter } from '@graphmarket/adapters';
import Container from 'typedi';
import { Connection, createConnection, ConnectionOptions } from 'typeorm';

const schema = buildFederatedSchema(
  {
    resolvers: [UserResolver],
    orphanedTypes: [User],
    container: Container,
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

const listen = (port: number): Promise<AddressInfo> =>
  new Promise((resolve, reject) => {
    const server = app
      .listen(port, () => {
        resolve(server.address() as AddressInfo);
      })
      .on('error', (error) => {
        reject(error);
      });
  });

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

const initAdapters = (): Promise<void> => {
  Container.get(TokenAdapter).init(config.REDIS.URL);
  Container.get(PhoneAdapter).init(config.ADAPTERS.PHONE.USERNAME, config.ADAPTERS.PHONE.PASSWORD, {
    VERIFICATION: config.ADAPTERS.PHONE.SERVICES.VERIFICATION,
  });
  Container.get(EmailAdapter).init(config.ADAPTERS.EMAIL.API_KEY);
  Container.get(UploadAdapter).init(
    config.ADAPTERS.UPLOAD.CLOUD_NAME,
    config.ADAPTERS.UPLOAD.API_KEY,
    config.ADAPTERS.UPLOAD.API_SECRET,
    config.ADAPTERS.UPLOAD.FOLDER,
  );

  return Promise.resolve();
};

export default { listen, connectDatabase, initAdapters };
