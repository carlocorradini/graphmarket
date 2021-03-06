import { AddressInfo } from 'net';
import Container from 'typedi';
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { buildFederatedSchema, buildService } from '@graphmarket/helpers';
import {
  Product,
  User,
  Inventory,
  InventoryExternal,
  Purchase,
  PurchaseExternal,
  Review,
  ReviewExternal,
} from '@graphmarket/entities';
import { UploadAdapter } from '@graphmarket/adapters';
import config from '@app/config';
import {
  InventoryProductResolver,
  ProductResolver,
  PurchaseProductResolver,
  resolveProductReference,
  ReviewProductResolver,
} from '@app/resolvers';
import { URL } from 'url';

/**
 * Federated GraphQL schema.
 */
const schema = buildFederatedSchema(
  {
    resolvers: [
      ProductResolver,
      InventoryProductResolver,
      PurchaseProductResolver,
      ReviewProductResolver,
    ],
    orphanedTypes: [Product, InventoryExternal, PurchaseExternal, ReviewExternal],
    container: Container,
  },
  {
    Product: { __resolveReference: resolveProductReference },
  },
);

/**
 * Service instance.
 */
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

/**
 * Start listening at the given port.
 *
 * @param port - Listening port
 * @returns Address information
 */
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

/**
 * Create and returns a connection with the database.
 *
 * @returns Database connection
 */
const connectDatabase = (): Promise<Connection> => {
  const redisURL = new URL(config.REDIS.URL);

  return createConnection(<ConnectionOptions>{
    type: config.DATABASE.TYPE,
    url: config.DATABASE.URL,
    extra: {
      ssl: config.DATABASE.SSL,
    },
    synchronize: config.DATABASE.SYNCHRONIZE,
    dropSchema: config.DATABASE.DROP_SCHEMA,
    logging: config.DATABASE.LOGGING,
    entities: [Product, Inventory, User, Purchase, Review],
    cache: {
      type: 'ioredis',
      options: {
        host: redisURL.hostname,
        port: redisURL.port,
        password: redisURL.password,
      },
    },
  });
};

/**
 * Initialize the adapters used in the service.
 */
const initAdapters = (): Promise<void> => {
  Container.get(UploadAdapter).init(
    config.ADAPTERS.UPLOAD.CLOUD_NAME,
    config.ADAPTERS.UPLOAD.API_KEY,
    config.ADAPTERS.UPLOAD.API_SECRET,
    config.ADAPTERS.UPLOAD.FOLDER,
  );

  return Promise.resolve();
};

export default { listen, connectDatabase, initAdapters };
